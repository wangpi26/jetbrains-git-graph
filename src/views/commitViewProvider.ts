import * as vscode from "vscode";
import type { GitCache } from "../git/cache";
import type { MessageRouter } from "../messages/messageRouter";
import { getWebviewHtml } from "./html";

export class CommitViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "git-brains.commitPanel";

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly messageRouter: MessageRouter,
    private readonly caches: GitCache[] = [],
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "dist")],
    };

    webview.html = getWebviewHtml(webview, this.extensionUri, "commit");

    const routerDisposable = this.messageRouter.registerWebview(webview);
    webviewView.onDidDispose(() => routerDisposable.dispose());

    // Refresh data when commit panel becomes visible (without auto-focusing Git Log)
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        // Invalidate all git caches to ensure fresh data
        for (const cache of this.caches) {
          cache.invalidate();
        }
        this.messageRouter.broadcastEvent("commitStateChanged", {});
        this.messageRouter.broadcastEvent("gitStateChanged", { scope: "all" });
      }
    });
  }
}
