import { useCallback } from "react";
import { t } from "../../shared/i18n";
import type { WorkingTreeFile } from "../../shared/store/commit-store";
import { getCommitFileIcon } from "../utils/file-icon";

export interface FileItemProps {
  file: WorkingTreeFile;
  selected: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onShowDiff: () => void;
  onClick: (e: React.MouseEvent) => void;
  onStage: () => void;
  onUnstage: () => void;
  onOpenFile: () => void;
}

export function FileItem({
  file,
  selected,
  highlighted,
  onToggle,
  onContextMenu,
  onShowDiff,
  onClick,
  onStage,
  onUnstage,
  onOpenFile,
}: FileItemProps) {
  const parts = file.path.split("/");
  const fileName = parts.pop() || parts.pop() || file.path;
  const dirPath = parts.length > 0 ? parts.join("/") : "";

  const statusLabel = getStatusLabel(file.status);
  const statusColor = getStatusColor(file.status);
  const FileIcon = getCommitFileIcon(file.path);

  const handleStageClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (file.staged) {
        onUnstage();
      } else {
        onStage();
      }
    },
    [file.staged, onStage, onUnstage],
  );

  const handleOpenFileClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onOpenFile();
    },
    [onOpenFile],
  );

  return (
    <div
      className={`commit-file-item ${highlighted ? "highlighted" : ""}`}
      onDoubleClick={onShowDiff}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e);
      }}
    >
      <input
        type="checkbox"
        className="commit-file-checkbox"
        checked={selected}
        onChange={onToggle}
      />
      <span className="commit-file-icon">
        <FileIcon style={{ width: 16, height: 16 }} />
      </span>
      <span
        className="commit-file-name"
        title={file.path}
        style={{ color: statusColor }}
      >
        {fileName}
      </span>
      {dirPath && (
        <span className="commit-file-path" title={dirPath}>
          {dirPath}
        </span>
      )}
      <span className="commit-file-actions">
        <button
          type="button"
          className="commit-file-action-btn"
          title={t("fileItem.openFile")}
          onClick={handleOpenFileClick}
        >
          <OpenFileIcon />
        </button>
        <button
          type="button"
          className="commit-file-action-btn"
          title={
            file.staged
              ? t("fileItem.unstageChanges")
              : t("fileItem.stageChanges")
          }
          onClick={handleStageClick}
        >
          {file.staged ? <UnstageIcon /> : <StageIcon />}
        </button>
      </span>
      <span className="commit-file-status" style={{ color: statusColor }}>
        {statusLabel}
      </span>
    </div>
  );
}

function StageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v12M2 8h12" />
    </svg>
  );
}

function UnstageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8h12" />
    </svg>
  );
}

function OpenFileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 3h5l2 2h3v8H4z" />
      <path d="M9 3v2h2" />
    </svg>
  );
}

function getStatusLabel(status: WorkingTreeFile["status"]): string {
  switch (status) {
    case "added":
      return "A";
    case "modified":
      return "M";
    case "deleted":
      return "D";
    case "renamed":
      return "R";
    case "untracked":
      return "U";
    case "conflicted":
      return "C";
    default:
      return "?";
  }
}

function getStatusColor(status: WorkingTreeFile["status"]): string {
  switch (status) {
    case "added":
      return "#6a8759";
    case "untracked":
      return "#d1675a";
    case "modified":
      return "#6897bb";
    case "deleted":
      return "#6c6c6c";
    case "renamed":
      return "#b9b462";
    case "conflicted":
      return "#d1675a";
    default:
      return "inherit";
  }
}
