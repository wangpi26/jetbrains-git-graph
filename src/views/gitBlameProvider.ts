import * as vscode from "vscode";
import type { GitService } from "../git/gitService";
import { t } from "../i18n";

interface BlameLineInfo {
  author: string;
  authorEmail: string;
  authorDate: string;
  authorDateLong: string;
  summary: string;
  hash: string;
  line: number;
}

/**
 * GitLens-style blame features:
 * - Inline decoration on current line (author · time · message)
 * - Status bar item showing current line's blame
 * - Hover tooltip with full commit details
 */
export class GitBlameProvider implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];
  private blameCache = new Map<string, Map<number, BlameLineInfo>>();
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private currentLine = -1;
  private currentBlame: BlameLineInfo | null = null;

  // Inline decoration for the current line (hover/selection style)
  private readonly inlineDecorationType =
    vscode.window.createTextEditorDecorationType({
      after: {
        color: new vscode.ThemeColor("editorGhostText.foreground"),
        textDecoration: "opacity:0.6; font-style:italic",
      },
      isWholeLine: true,
    });

  // Gutter decoration: highlight recently changed lines
  private readonly recentChangeDecorationType =
    vscode.window.createTextEditorDecorationType({
      backgroundColor: {
        id: "gitlens.lineBlame.recentChange.background",
      },
      isWholeLine: false,
      opacity: "0.3",
    });

  // Status bar item
  private statusBarItem: vscode.StatusBarItem;

  constructor(
    private readonly getGitService: (filePath?: string) => GitService | null,
    private readonly outputChannel?: vscode.OutputChannel,
  ) {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      10,
    );
    this.statusBarItem.tooltip = "Git Blame";
    this.disposables.push(this.statusBarItem);

    // Track cursor line changes
    this.disposables.push(
      vscode.window.onDidChangeTextEditorSelection((e) => {
        const editor = e.textEditor;
        if (editor.document.uri.scheme !== "file") return;
        const line = e.selections[0]?.active.line ?? -1;
        if (line !== this.currentLine) {
          this.currentLine = line;
          this.updateDecorations(editor);
        }
      }),
    );

    // Update on active editor change
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        this.currentLine = -1;
        this.currentBlame = null;
        this.statusBarItem.hide();
        // Clear decorations from all editors
        vscode.window.visibleTextEditors.forEach((e) => {
          e.setDecorations(this.inlineDecorationType, []);
        });
        if (editor && editor.document.uri.scheme === "file") {
          this.currentLine = editor.selection.active.line;
          this.updateDecorations(editor);
        }
      }),
    );

    // Clear on visible editors change
    this.disposables.push(
      vscode.window.onDidChangeVisibleTextEditors((editors) => {
        for (const editor of editors) {
          if (editor.document.uri.scheme !== "file") {
            editor.setDecorations(this.inlineDecorationType, []);
          }
        }
      }),
    );

    // Invalidate cache on save
    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument((doc) => {
        this.invalidateCache(doc.uri);
        if (vscode.window.activeTextEditor) {
          this.updateDecorations(vscode.window.activeTextEditor);
        }
      }),
    );

    // Hover provider — shows full commit details on hover
    this.disposables.push(
      vscode.languages.registerHoverProvider(
        { scheme: "file" },
        {
          provideHover: async (doc, position) => {
            const gitService = this.getGitService(doc.uri.fsPath);
            if (!gitService) return null;

            const relPath = this.getRelativePath(doc.uri.fsPath, gitService);
            if (!relPath) return null;

            const info = await this.getBlameForLine(
              relPath,
              gitService,
              position.line,
            );
            if (!info || info.hash.startsWith("0000000")) return null;

            const md = new vscode.MarkdownString();
            md.isTrusted = true;
            md.supportThemeIcons = true;

            // Build GitLens-style hover content
            const dateLong = info.authorDateLong || info.authorDate;
            const shortHash = info.hash.substring(0, 8);

            md.appendMarkdown(`### ● ${shortHash} ${info.summary}\n\n`);
            md.appendMarkdown(
              `**${info.author}** &lt;${info.authorEmail}&gt; · ${dateLong}\n\n`,
            );
            md.appendMarkdown(`---\n\n`);
            md.appendMarkdown(`Line ${position.line + 1} · \`${relPath}\`\n\n`);

            // Add command links
            md.appendMarkdown(
              `[${t("blame.viewCommit")}](command:git-brains.showBlameCommit?${encodeURIComponent(JSON.stringify(info.hash))} "${t("blame.viewInGitLog")}")`,
            );

            return new vscode.Hover(md, doc.lineAt(position).range);
          },
        },
      ),
    );

    // Initial update
    if (vscode.window.activeTextEditor) {
      const editor = vscode.window.activeTextEditor;
      this.currentLine = editor.selection.active.line;
      this.updateDecorations(editor);
    }
  }

  private log(msg: string) {
    this.outputChannel?.appendLine(`[Blame] ${msg}`);
  }

  private invalidateCache(uri: vscode.Uri) {
    this.blameCache.delete(uri.fsPath);
  }

  private getRelativePath(
    fsPath: string,
    gitService: GitService,
  ): string | null {
    const cwd = gitService.cwd;
    if (!fsPath.startsWith(cwd)) return null;
    let relPath = fsPath.substring(cwd.length);
    if (relPath.startsWith("/")) relPath = relPath.substring(1);
    return relPath || null;
  }

  private async getBlameForLine(
    relPath: string,
    gitService: GitService,
    line: number,
  ): Promise<BlameLineInfo | null> {
    const cacheKey = relPath;
    let cached = this.blameCache.get(cacheKey);
    if (cached?.has(line)) {
      return cached.get(line)!;
    }

    try {
      const startLine = Math.max(1, line - 20);
      const endLine = line + 20;
      console.log(
        "[JetGit Blame] running git blame",
        relPath,
        `L${startLine},${endLine}`,
        "cwd:",
        gitService.cwd,
      );
      const output = await gitService.rawGit([
        "blame",
        "--line-porcelain",
        `-L${startLine},${endLine}`,
        "--",
        relPath,
      ]);

      this.log(`blame output length: ${output?.length ?? 0}`);
      if (!output) return null;

      if (!cached) {
        cached = new Map();
        this.blameCache.set(cacheKey, cached);
      }

      const lines = output.split("\n");
      let i = 0;
      while (i < lines.length) {
        const headerLine = lines[i];
        const match = headerLine.match(
          /^([0-9a-f]+)\s+(\d+)\s+(\d+)(?:\s+(\d+))?/,
        );
        if (!match) {
          i++;
          continue;
        }

        const hash = match[1];
        const finalLine = parseInt(match[3], 10) - 1;
        const numGroupLines = match[4] ? parseInt(match[4], 10) : 1;

        let author = "";
        let authorEmail = "";
        let authorTime = "";
        let _authorTz = "";
        let summary = "";

        i++;
        while (i < lines.length) {
          const metaLine = lines[i];
          if (metaLine.startsWith("author ")) {
            author = metaLine.substring(7);
          } else if (metaLine.startsWith("author-mail ")) {
            authorEmail = metaLine.substring(12).replace(/[<>]/g, "");
          } else if (metaLine.startsWith("author-time ")) {
            authorTime = metaLine.substring(12);
          } else if (metaLine.startsWith("author-tz ")) {
            _authorTz = metaLine.substring(10);
          } else if (metaLine.startsWith("summary ")) {
            summary = metaLine.substring(8);
          } else if (metaLine.startsWith("\t")) {
            break;
          }
          i++;
        }

        const dateLong = this.formatDateLong(authorTime);
        const dateShort = this.formatTimestamp(authorTime);

        const isUncommitted = hash.startsWith("0000000");
        for (let j = 0; j < numGroupLines; j++) {
          const lineIdx = finalLine + j;
          if (isUncommitted) {
            i++; // skip content line
            continue; // don't cache uncommitted lines
          }
          cached.set(lineIdx, {
            author,
            authorEmail,
            authorDate: dateShort,
            authorDateLong: dateLong,
            summary,
            hash: hash.substring(0, 8),
            line: lineIdx,
          });
          i++;
        }
        i++;
      }

      return cached.get(line) ?? null;
    } catch {
      return null;
    }
  }

  private formatTimestamp(timestamp: string): string {
    if (!timestamp) return "";
    const ts = parseInt(timestamp, 10);
    if (Number.isNaN(ts)) return "";
    const date = new Date(ts * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMin = Math.floor(diffMs / (1000 * 60));
        if (diffMin < 1) return "just now";
        return `${diffMin}m ago`;
      }
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  }

  private formatDateLong(timestamp: string): string {
    if (!timestamp) return "";
    const ts = parseInt(timestamp, 10);
    if (Number.isNaN(ts)) return "";
    const date = new Date(ts * 1000);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  private updateDecorations(editor: vscode.TextEditor) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      void this.doUpdateDecorations(editor);
    }, 200);
  }

  private async doUpdateDecorations(editor: vscode.TextEditor) {
    // Only for normal file editors
    if (editor.document.uri.scheme !== "file") {
      editor.setDecorations(this.inlineDecorationType, []);
      this.statusBarItem.hide();
      return;
    }

    const filePath = editor.document.uri.fsPath;
    this.log(`doUpdateDecorations: ${filePath} | line: ${this.currentLine}`);
    const gitService = this.getGitService(filePath);
    this.log(`gitService cwd: ${gitService?.cwd ?? "null"}`);
    if (!gitService) {
      editor.setDecorations(this.inlineDecorationType, []);
      this.statusBarItem.hide();
      return;
    }

    const relPath = this.getRelativePath(filePath, gitService);
    this.log(`relPath: ${relPath}`);
    if (!relPath) {
      editor.setDecorations(this.inlineDecorationType, []);
      this.statusBarItem.hide();
      return;
    }

    const line = this.currentLine;
    if (line < 0 || line >= editor.document.lineCount) {
      editor.setDecorations(this.inlineDecorationType, []);
      this.statusBarItem.hide();
      return;
    }

    const info = await this.getBlameForLine(relPath, gitService, line);
    this.currentBlame = info;

    if (!info || info.hash.startsWith("0000000")) {
      editor.setDecorations(this.inlineDecorationType, []);
      this.statusBarItem.hide();
      return;
    }

    // Inline decoration on current line
    const lineContent = editor.document.lineAt(line);
    const lineLength = lineContent.text.length;
    const text = `  ${info.author} · ${info.authorDate} · ${info.summary}`;

    const decorations: vscode.DecorationOptions[] = [
      {
        range: new vscode.Range(line, lineLength, line, lineLength),
        renderOptions: {
          after: {
            contentText: text,
          },
        },
      },
    ];
    editor.setDecorations(this.inlineDecorationType, decorations);

    // Status bar item
    this.statusBarItem.text = `$(git-commit) ${info.author} · ${info.authorDate}`;
    this.statusBarItem.tooltip = `${info.summary}\n${info.author} <${info.authorEmail}>\n${info.authorDateLong}\n${relPath}:${line + 1}`;
    this.statusBarItem.show();
  }

  dispose() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.inlineDecorationType.dispose();
    this.recentChangeDecorationType.dispose();
    this.statusBarItem.dispose();
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
  }
}
