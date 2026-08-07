import { useCallback, useEffect, useState } from "react";
import { bridge } from "../shared/bridge";
import { Tooltip } from "../shared/components/Tooltip";
import { t } from "../shared/i18n";
import "../shared/components/Tooltip.css";
import { useCommitStore } from "../shared/store/commit-store";
import { CommitMessageArea } from "./components/CommitMessageArea";
import { CommitTab } from "./components/CommitTab";
import { IdeaShelfTab } from "./components/IdeaShelfTab";
import { ShelfTab } from "./components/ShelfTab";
import "./commit.css";

function ProgressBar({ visible }: { visible: boolean }) {
  return (
    <div className={`commit-progress-bar ${visible ? "" : "hidden"}`}>
      {visible && <div className="commit-progress-bar-inner" />}
    </div>
  );
}

interface RebaseState {
  isRebasing: boolean;
  branchName?: string;
  step?: number;
  totalSteps?: number;
}

function RebaseBanner() {
  const [state, setState] = useState<RebaseState>({ isRebasing: false });
  const [loading, setLoading] = useState(false);

  const fetchState = useCallback(async () => {
    try {
      const result = (await bridge.request("getRebaseState")) as RebaseState;
      setState(result);
    } catch {
      setState({ isRebasing: false });
    }
  }, []);

  useEffect(() => {
    fetchState();
    const unsub = bridge.onEvent((event) => {
      if (event === "gitStateChanged" || event === "commitStateChanged") {
        fetchState();
      }
    });
    return unsub;
  }, [fetchState]);

  const handleAction = useCallback(
    async (action: "continue" | "abort" | "skip") => {
      setLoading(true);
      try {
        await bridge.request("rebaseAction", { action });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        bridge
          .request("showErrorNotification", { message: msg })
          .catch(() => {});
      } finally {
        setLoading(false);
        fetchState();
      }
    },
    [fetchState],
  );

  if (!state.isRebasing) return null;

  const label = state.branchName
    ? t("status.rebasing", { branchName: state.branchName })
    : t("status.rebasingShort");
  const progress =
    state.step && state.totalSteps
      ? ` (${state.step}/${state.totalSteps})`
      : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: "#e8f5e9",
        borderBottom: "1px solid #c8e6c9",
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>⚠️</span>
      <span style={{ fontWeight: 600, flex: 1, color: "var(--app-fg, #ccc)" }}>
        {label}
        {progress}
      </span>
      <Tooltip text={t("status.continueRebase")}>
        <div
          role="button"
          tabIndex={0}
          aria-disabled={loading}
          onClick={() => !loading && handleAction("continue")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!loading) handleAction("continue");
            }
          }}
          className="rebase-action-btn rebase-continue"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2.5 11.5L6 8L2.5 4.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 11.5L12 8L8.5 4.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
      <Tooltip text={t("status.abortRebase")}>
        <div
          role="button"
          tabIndex={0}
          aria-disabled={loading}
          onClick={() => !loading && handleAction("abort")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!loading) handleAction("abort");
            }
          }}
          className="rebase-action-btn rebase-abort"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 12L12 4M12 12L4 4"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
    </div>
  );
}

interface MergeStateInfo {
  isMerging: boolean;
  mergeHead?: string;
  mergeMsg?: string;
}
interface CherryPickStateInfo {
  isCherryPicking: boolean;
  cherryPickHead?: string;
}

function CherryPickBanner() {
  const [state, setState] = useState<CherryPickStateInfo>({
    isCherryPicking: false,
  });
  const [loading, setLoading] = useState(false);
  const fetchState = useCallback(async () => {
    try {
      setState(
        (await bridge.request("getCherryPickState")) as CherryPickStateInfo,
      );
    } catch {
      setState({ isCherryPicking: false });
    }
  }, []);
  useEffect(() => {
    fetchState();
    const unsub = bridge.onEvent((event) => {
      if (event === "gitStateChanged" || event === "commitStateChanged")
        fetchState();
    });
    return unsub;
  }, [fetchState]);
  const handleAction = useCallback(
    async (action: "continue" | "abort" | "skip") => {
      setLoading(true);
      try {
        await bridge.request("cherryPickAction", { action });
      } catch (err) {
        bridge
          .request("showErrorNotification", {
            message: err instanceof Error ? err.message : String(err),
          })
          .catch(() => {});
      } finally {
        setLoading(false);
        fetchState();
      }
    },
    [fetchState],
  );
  if (!state.isCherryPicking) return null;
  const shortHash = state.cherryPickHead
    ? state.cherryPickHead.substring(0, 7)
    : "";
  const label = shortHash
    ? t("status.cherryPicking", { hash: shortHash })
    : t("status.cherryPickingShort");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: "var(--vscode-inputValidation-warningBackground, #352a05)",
        borderBottom:
          "1px solid var(--vscode-inputValidation-warningBorder, #665500)",
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>🍒</span>
      <span style={{ fontWeight: 600, flex: 1, color: "var(--app-fg, #ccc)" }}>
        {label}
      </span>
      <Tooltip text={t("status.continueCherryPick")}>
        <div
          role="button"
          tabIndex={0}
          aria-disabled={loading}
          onClick={() => !loading && handleAction("continue")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!loading) handleAction("continue");
            }
          }}
          className="rebase-action-btn rebase-continue"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2.5 11.5L6 8L2.5 4.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 11.5L12 8L8.5 4.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
      <Tooltip text={t("status.skipCherryPick")}>
        <div
          role="button"
          tabIndex={0}
          aria-disabled={loading}
          onClick={() => !loading && handleAction("skip")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!loading) handleAction("skip");
            }
          }}
          className="rebase-action-btn rebase-continue"
          style={{ background: "#fb8c00" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M5 4L11 8L5 12"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
      <Tooltip text={t("status.abortCherryPick")}>
        <div
          role="button"
          tabIndex={0}
          aria-disabled={loading}
          onClick={() => !loading && handleAction("abort")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!loading) handleAction("abort");
            }
          }}
          className="rebase-action-btn rebase-abort"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 12L12 4M12 12L4 4"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
    </div>
  );
}

function MergeBanner() {
  const [state, setState] = useState<MergeStateInfo>({ isMerging: false });
  const [loading, setLoading] = useState(false);
  const fetchState = useCallback(async () => {
    try {
      setState((await bridge.request("getMergeState")) as MergeStateInfo);
    } catch {
      setState({ isMerging: false });
    }
  }, []);
  useEffect(() => {
    fetchState();
    const unsub = bridge.onEvent((event) => {
      if (event === "gitStateChanged" || event === "commitStateChanged")
        fetchState();
    });
    return unsub;
  }, [fetchState]);
  const handleContinue = useCallback(async () => {
    setLoading(true);
    try {
      const conflicts = (await bridge.request("getConflictFiles")) as string[];
      if (conflicts?.length > 0) await bridge.request("openConflictsPanel");
      else await bridge.request("mergeAction", { action: "continue" });
    } catch (err) {
      bridge
        .request("showErrorNotification", {
          message: err instanceof Error ? err.message : String(err),
        })
        .catch(() => {});
    } finally {
      setLoading(false);
      fetchState();
    }
  }, [fetchState]);
  const handleAbort = useCallback(async () => {
    setLoading(true);
    try {
      await bridge.request("mergeAction", { action: "abort" });
    } catch (err) {
      bridge
        .request("showErrorNotification", {
          message: err instanceof Error ? err.message : String(err),
        })
        .catch(() => {});
    } finally {
      setLoading(false);
      fetchState();
    }
  }, [fetchState]);
  if (!state.isMerging) return null;
  let label = t("status.merging");
  if (state.mergeMsg) {
    const match = state.mergeMsg.match(
      /Merge (?:branch '([^']+)'|remote-tracking branch '([^']+)')/,
    );
    if (match)
      label = t("status.mergingBranch", { branch: match[1] || match[2] });
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: "#e8f5e9",
        borderBottom: "1px solid #c8e6c9",
        fontSize: 12,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>⚠️</span>
      <span style={{ fontWeight: 600, flex: 1, color: "var(--app-fg, #ccc)" }}>
        {label}
      </span>
      <Tooltip text={t("status.resolveConflicts")} position="top">
        <div
          role="button"
          tabIndex={0}
          aria-disabled={loading}
          onClick={() => !loading && handleContinue()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!loading) handleContinue();
            }
          }}
          className="rebase-action-btn rebase-continue"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2.5 11.5L6 8L2.5 4.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 11.5L12 8L8.5 4.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
      <Tooltip text={t("status.abortMerge")} position="top">
        <div
          role="button"
          tabIndex={0}
          aria-disabled={loading}
          onClick={() => !loading && handleAbort()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!loading) handleAbort();
            }
          }}
          className="rebase-action-btn rebase-abort"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 12L12 4M12 12L4 4"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Tooltip>
    </div>
  );
}

// ─── Collapsible Section ────────────────────────────────────────────
function CollapsibleSection({
  title,
  count,
  defaultExpanded = true,
  children,
}: {
  title: string;
  count?: number;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="scm-section">
      <div
        className="scm-section-header"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: expanded ? "rotate(90deg)" : "none",
            transition: "transform 0.1s",
            flexShrink: 0,
          }}
        >
          <path
            d="M6 11.5L9.5 8L6 4.5"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </svg>
        <span className="scm-section-title">{title}</span>
        {count !== undefined && (
          <span className="scm-section-count">{count}</span>
        )}
      </div>
      {expanded && <div className="scm-section-body">{children}</div>}
    </div>
  );
}

// ─── Repo Selector ──────────────────────────────────────────────────
function RepoSelector() {
  const repos = useCommitStore((s) => s.repos);
  const activeRepoName = useCommitStore((s) => s.activeRepoName);
  const switchRepo = useCommitStore((s) => s.switchRepo);
  const [open, setOpen] = useState(false);

  if (repos.length <= 1) return null;

  return (
    <div className="scm-repo-selector">
      <button
        type="button"
        className="scm-repo-selector-btn"
        onClick={() => setOpen(!open)}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M1.5 3.5C1.5 2.95 1.95 2.5 2.5 2.5H6.09c.27 0 .52.1.71.3l5.41 5.41c.39.39.39 1.02 0 1.41l-3.59 3.59c-.39.39-1.02.39-1.41 0L1.79 7.8a1 1 0 01-.29-.71V3.5z"
            fill="var(--app-bg, #fff)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="5" cy="5" r="0.9" fill="currentColor" />
        </svg>
        <span>{activeRepoName || t("panel.toolbar.selectRepo")}</span>
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
          <polyline
            points="4,6 8,10 12,6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <>
          <div
            className="scm-repo-dropdown-backdrop"
            onClick={() => setOpen(false)}
          />
          <div className="scm-repo-dropdown">
            {repos.map((repo) => (
              <button
                key={repo.path}
                type="button"
                className={`scm-repo-dropdown-item ${repo.isActive ? "active" : ""}`}
                onClick={() => {
                  void switchRepo(repo.path);
                  setOpen(false);
                }}
              >
                {repo.path === "." ? repo.name : repo.path}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CommitApp() {
  const {
    loading,
    fetchChanges,
    fetchShelves,
    fetchIdeaShelves,
    fetchRepos,
    shelves,
    ideaShelves,
    changes,
  } = useCommitStore();

  useEffect(() => {
    fetchRepos();
    fetchChanges();
    fetchShelves();
    fetchIdeaShelves();
  }, [fetchChanges, fetchShelves, fetchIdeaShelves, fetchRepos]);

  useEffect(() => {
    const unsub = bridge.onEvent((event) => {
      if (event === "reposDiscovered" || event === "repoChanged") {
        fetchRepos();
        fetchChanges();
        fetchShelves();
        fetchIdeaShelves();
      }
      if (event === "gitStateChanged" || event === "commitStateChanged") {
        fetchChanges();
        fetchShelves();
        fetchIdeaShelves();
      }
    });
    return unsub;
  }, [fetchChanges, fetchShelves, fetchIdeaShelves, fetchRepos]);

  const changesCount = changes.length;
  const shelfCount = ideaShelves.length;
  const stashCount = shelves.length;

  return (
    <div className="commit-app scm-app">
      <RepoSelector />
      <RebaseBanner />
      <CherryPickBanner />
      <MergeBanner />
      <ProgressBar visible={loading} />

      {/* Scrollable content: file groups + shelf + stash */}
      <div className="scm-scroll-container">
        <CollapsibleSection
          title={t("commitTab.changes")}
          count={changesCount}
          defaultExpanded
        >
          <CommitTab />
        </CollapsibleSection>

        {shelfCount > 0 && (
          <CollapsibleSection
            title={t("commitTab.shelf")}
            count={shelfCount}
            defaultExpanded={false}
          >
            <IdeaShelfTab />
          </CollapsibleSection>
        )}

        {stashCount > 0 && (
          <CollapsibleSection
            title={t("commitTab.stash")}
            count={stashCount}
            defaultExpanded={false}
          >
            <ShelfTab />
          </CollapsibleSection>
        )}
      </div>

      {/* Fixed at bottom: commit message + buttons */}
      <CommitMessageArea />
    </div>
  );
}
