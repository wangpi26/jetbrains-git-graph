import * as vscode from "vscode";
import type { GitService } from "../git/gitService";

export const GIT_BRAINS_SCHEME = "git-brains";

/**
 * Provides virtual file content for git file revisions.
 * Uri format: git-brains:/<filePath>?ref=<commitHash>
 *
 * Implements both TextDocumentContentProvider (for text diff) and
 * FileSystemProvider (for binary files like images).
 */
export class GitContentProvider
  implements vscode.TextDocumentContentProvider, vscode.FileSystemProvider
{
  private externalContent: Map<string, string> | null = null;

  private _onDidChangeFile = new vscode.EventEmitter<
    vscode.FileChangeEvent[]
  >();
  readonly onDidChangeFile = this._onDidChangeFile.event;

  constructor(private readonly gitServiceGetter: () => GitService | null) {}

  setExternalContentMap(map: Map<string, string>): void {
    this.externalContent = map;
  }

  // ─── TextDocumentContentProvider ──────────────────────────────────

  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    // Check external content map first (used for shelf diffs)
    if (this.externalContent) {
      const external = this.externalContent.get(uri.toString());
      if (external !== undefined) {
        return external;
      }
    }

    const ref = new URLSearchParams(uri.query).get("ref") ?? "";
    const filePath = uri.path.startsWith("/") ? uri.path.slice(1) : uri.path;
    if (!ref || !filePath) {
      return "";
    }
    // Wait for git service to be available (handles async repo discovery on reload)
    const svc = await this.waitForGitService();
    if (!svc) {
      throw new Error("Git service not available");
    }
    return svc.getFileContent(ref, filePath);
  }

  private async waitForGitService(
    timeoutMs = 5000,
  ): Promise<GitService | null> {
    const svc = this.gitServiceGetter();
    if (svc) return svc;
    // Retry with backoff for up to 5 seconds
    const start = Date.now();
    const interval = 100;
    while (Date.now() - start < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      const s = this.gitServiceGetter();
      if (s) return s;
    }
    return null;
  }

  // ─── FileSystemProvider (for binary files) ────────────────────────

  watch(): vscode.Disposable {
    return new vscode.Disposable(() => {});
  }

  async stat(_uri: vscode.Uri): Promise<vscode.FileStat> {
    return {
      type: vscode.FileType.File,
      ctime: 0,
      mtime: 0,
      size: 0,
    };
  }

  readDirectory(): Thenable<[string, vscode.FileType][]> {
    return Promise.resolve([]);
  }

  createDirectory(): void {}

  async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    const ref = new URLSearchParams(uri.query).get("ref") ?? "";
    const filePath = uri.path.startsWith("/") ? uri.path.slice(1) : uri.path;
    if (!ref || !filePath) {
      return new Uint8Array(0);
    }
    const svc = await this.waitForGitService();
    if (!svc) return new Uint8Array(0);
    const buffer = await svc.getFileContentBuffer(ref, filePath);
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  writeFile(): void {
    throw vscode.FileSystemError.NoPermissions("Read-only git content");
  }

  delete(): void {
    throw vscode.FileSystemError.NoPermissions("Read-only git content");
  }

  rename(): void {
    throw vscode.FileSystemError.NoPermissions("Read-only git content");
  }
}
