export const en: Record<string, string> = {
  // Common
  "common.delete": "Delete",
  "common.cancel": "Cancel",
  "common.rollback": "Rollback",
  "common.loading": "Loading...",
  "common.branch": "Branch",
  "common.refresh": "Refresh",
  "common.settings": "Settings",
  "common.search": "Search",

  // Panel - Toolbar
  "panel.toolbar.searchCommits": "Search commits...",
  "panel.toolbar.selectBranch": "Select branch...",
  "panel.toolbar.selectUser": "Select user...",
  "panel.toolbar.selectDateRange": "Select date range...",
  "panel.toolbar.viewOptions": "View Options",
  "panel.toolbar.columns": "Columns",
  "panel.toolbar.author": "Author",
  "panel.toolbar.date": "Date",
  "panel.toolbar.hash": "Hash",
  "panel.toolbar.message": "Message",

  // Panel - App (sidebar toggle)
  "panel.showBranches": "Show Branches",
  "panel.hideBranches": "Hide Branches",
  "panel.showDetails": "Show Details",
  "panel.hideDetails": "Hide Details",

  // Panel - BranchSidebar
  "branch.newBranch": "New Branch",
  "branch.updateSelected": "Update Selected",
  "branch.deleteBranch": "Delete Branch",
  "branch.compareWithCurrent": "Compare with Current",
  "branch.showMyBranches": "Show My Branches",
  "branch.fetch": "Fetch",
  "branch.toggleFavorite": "Mark/Unmark As Favorite",
  "branch.navigateToHead": "Navigate Log to Selected Branch Head",
  "branch.expandAll": "Expand All",
  "branch.collapseAll": "Collapse All",
  "branch.settings": "Settings",
  "branch.hideBranches": "Hide Branches",
  "branch.onSingleClick": "On Single Click",
  "branch.updateBranchFilter": "Update Branch Filter",
  "branch.navigateToBranchHead": "Navigate Log to Branch Head",
  "branch.searchPlaceholder": "Branch or tag",
  "branch.local": "Local",
  "branch.remote": "Remote",
  "branch.tags": "Tags",
  "branch.branchNamePlaceholder": "branch-name",
  "branch.checkout": "Checkout",
  "branch.rename": "Rename...",
  "branch.delete": "Delete",
  "branch.update": "Update",
  "branch.push": "Push...",
  "branch.newBranchFrom": 'New Branch from "{name}"...',

  // Panel - CommitContextMenu
  "commit.copyRevisionNumber": "Copy Revision Number",
  "commit.cherryPick": "Cherry-Pick",
  "commit.checkoutRevision": "Checkout Revision",
  "commit.resetMixed": "Reset Current Branch to Here (Mixed)...",
  "commit.resetSoft": "Reset Current Branch to Here (Soft)...",
  "commit.resetHard": "Reset Current Branch to Here (Hard)...",
  "commit.revertCommit": "Revert Commit",
  "commit.dropCommit": "Drop Commit",
  "commit.newBranch": "New Branch...",
  "commit.newTag": "New Tag...",
  "commit.showInGitLog": "Show in Git Log",

  // Panel - FileContextMenu
  "file.showDiff": "Show Diff",
  "file.editSource": "Edit Source",
  "file.openRepoVersion": "Open Repository Version",
  "file.revertSelected": "Revert Selected Changes",
  "file.cherryPickSelected": "Cherry-Pick Selected Changes",
  "file.copyPath": "Copy Path",
  "file.copyFileName": "Copy File Name",
  "file.historyUpToHere": "History Up to Here",

  // Panel - FileChangeTree
  "file.treeView": "Tree View",
  "file.flatList": "Flat List",

  // Panel - CreateBranchDialog
  "dialog.createBranch": "Create Branch",
  "dialog.cancel": "Cancel",
  "dialog.create": "Create",

  // Commit panel - Toolbar
  "commitToolbar.refresh": "Refresh",
  "commitToolbar.rollback": "Rollback",
  "commitToolbar.shelveChanges": "Shelve Changes",
  "commitToolbar.showDiff": "Show Diff",
  "commitToolbar.pull": "Pull",
  "commitToolbar.push": "Push...",
  "commitToolbar.viewOptions": "View Options",
  "commitToolbar.expandAll": "Expand All",
  "commitToolbar.collapseAll": "Collapse All",
  "commitToolbar.groupBy": "Group By",
  "commitToolbar.directory": "Directory",
  "commitToolbar.show": "Show",
  "commitToolbar.unversionedFiles": "Unversioned Files",

  // Commit panel - CommitTab
  "commitTab.noChanges": "No changes detected",
  "commitTab.rollback": "Rollback...",
  "commitTab.openInSystemFolder": "Open in System Folder",

  // Commit panel - CommitFileContextMenu
  "commitFile.showDiff": "Show Diff",
  "commitFile.jumpToSource": "Jump to Source",
  "commitFile.openInSystemFolder": "Open in System Folder",
  "commitFile.unstage": "Unstage",
  "commitFile.addToVcs": "Add to VCS",
  "commitFile.rollback": "Rollback...",
  "commitFile.shelveChanges": "Shelve Changes...",
  "commitFile.delete": "Delete...",

  // Commit panel - CommitMessageArea
  "commitMessage.placeholder": "Commit message (Ctrl+Enter to commit)",
  "commitMessage.recentMessages": "Recent commit messages",

  // Commit panel - Shelf tabs
  "shelf.noShelvedChanges": "No shelved changes",
  "shelf.unshelve": "Unshelve...",
  "shelf.restore": "Restore",
  "shelf.delete": "Delete...",
  "shelf.unshelveThisFile": "Unshelve This File",
  "shelf.showDiff": "Show Diff",
  "shelf.jumpToSource": "Jump to Source",
  "shelf.copyPath": "Copy Path",
  "shelf.importPatches": "Import Patches...",
  "shelf.importPatchesFromClipboard": "Import Patches from Clipboard",
  "shelf.createPatch": "Create Patch...",
  "shelf.copyAsPatch": "Copy as Patch to Clipboard",

  // Commit panel - Status banners
  "status.rebasing": "Rebasing {branchName}",
  "status.rebasingShort": "Rebasing",
  "status.cherryPicking": "Cherry-picking {hash}",
  "status.cherryPickingShort": "Cherry-picking",
  "status.merging": "Merging",
  "status.mergingBranch": "Merging {branch}",
  "status.mergeInProgress": "Merge in progress",
  "status.noMergeInProgress": "No merge in progress",
  "status.continueRebase": "Continue Rebase (git rebase --continue)",
  "status.abortRebase": "Abort Rebase (git rebase --abort)",
  "status.continueCherryPick":
    "Continue Cherry-pick (git cherry-pick --continue)",
  "status.skipCherryPick": "Skip Cherry-pick (git cherry-pick --skip)",
  "status.abortCherryPick": "Abort Cherry-pick (git cherry-pick --abort)",
  "status.abortMerge": "Abort Merge (git merge --abort)",
  "status.resolveConflicts": "Resolve Conflicts",

  // Conflicts
  "conflicts.name": "Name",
  "conflicts.leftTheirs": "Left (Theirs)",
  "conflicts.centerResult": "Center (Result)",
  "conflicts.rightYours": "Right (Yours)",
  "conflicts.previousConflict": "Previous Conflict",
  "conflicts.nextConflict": "Next Conflict",
  "conflicts.acceptAllLeft": "Accept all changes from left side",
  "conflicts.acceptAllRight": "Accept all changes from right side",
  "conflicts.discardAndClose": "Discard changes and close",
  "conflicts.saveAndStage": "Save merged result and stage file",
  "conflicts.skipLeft": "Skip left",
  "conflicts.acceptLeft": "Accept left",
  "conflicts.acceptRight": "Accept right",
  "conflicts.skipRight": "Skip right",
  "conflicts.undo": "Undo",

  // Push panel
  "push.pushRejected": "Push Rejected",
  "push.rejectedMessage":
    'Push of the current branch "{branchName}" was rejected. Remote changes need to be merged before pushing.',
  "push.rebase": "Rebase",
  "push.merge": "Merge",
  "push.cancel": "Cancel",
  "push.noCommits": "No commits to push",
  "push.noCommitsSelected": "No commits selected",
  "push.pushing": "Pushing...",
  "push.push": "Push",
  "push.forcePush": "Force Push",
  "push.everythingUpToDate": "Everything is up to date",

  // Rollback panel
  "rollback.rollingBack": "Rolling back...",
  "rollback.rollback": "Rollback",
  "rollback.deleteLocalCopies": "Delete local copies of added files",
  // Commit panel - CommitTab group labels
  "commitTab.mergeConflicts": "Merge Conflicts",
  "commitTab.changes": "Changes",
  "commitTab.staged": "Staged",
  "commitTab.unversionedFilesLabel": "Unversioned Files",
  "commitTab.shelvedChanges": "Shelved changes",
  "commitTab.deleteDir": 'Delete "{dirName}"...',

  // Branch tree - current branch header
  "branch.currentBranchLabel": "Current Branch:",
  "branch.detached": "detached",
  "branch.checkoutAndRebaseOnto": "Checkout and Rebase onto '{currentBranch}'",
  "branch.rebaseCurrentOnto": "Rebase '{currentBranch}' onto '{branchName}'",
  "branch.mergeBranchIntoCurrent":
    "Merge '{branchName}' into '{currentBranch}'",
  "branch.deleteConfirm": "Delete branch '{branchName}'?",
  "branch.forceDelete": "Force Delete",
  "branch.notFullyMergedConfirm":
    "Branch '{branchName}' is not fully merged. Force delete?",
  "branch.merge": "Merge",
  "branch.rebase": "Rebase",
  "branch.mergeConfirm": "Merge '{branchName}' into '{currentBranch}'?",
  "branch.rebaseConfirm": "Rebase '{currentBranch}' onto '{branchName}'?",

  // File context menu - confirm dialogs
  "file.revertConfirm": "Revert changes to '{fileName}' from this commit?",
  "file.revert": "Revert",
  "file.applyConfirm":
    "Apply changes to '{fileName}' from this commit to working tree?",
  "file.apply": "Apply",

  // Commit context menu - confirm dialogs
  "commit.resetHardConfirm":
    "Reset '{currentBranch}' to {shortHash} (hard)? This will discard all uncommitted changes.",
  "commit.reset": "Reset",
  "commit.dropCommitConfirm":
    'Drop commit {shortHash} "{subject}"?\n\nThis will remove the commit from history but keep its changes as unstaged modifications.\n\nThis operation cannot be undone.',
  "commit.dropCommitLabel": "Drop Commit",

  // Panel toolbar - filter labels and date ranges
  "panel.toolbar.branch": "Branch",
  "panel.toolbar.user": "User",
  "panel.toolbar.allBranches": "All branches",
  "panel.toolbar.allUsers": "All users",
  "panel.toolbar.allTime": "All time",
  "panel.toolbar.today": "Today",
  "panel.toolbar.last7Days": "Last 7 days",
  "panel.toolbar.last30Days": "Last 30 days",
  "panel.toolbar.last90Days": "Last 90 days",

  // CreateBranchDialog
  "dialog.branchName": "Branch Name:",
  "dialog.checkoutBranch": "Checkout branch",
  "dialog.overwriteExisting": "Overwrite existing branch",

  // Shelf tab default
  "shelf.defaultChanges": "Changes",
  // Shelf empty state hints
  "shelf.emptyHintStash":
    "Use the shelf icon in the Commit tab toolbar to shelve changes for later.",
  "shelf.emptyHintIdea":
    "Use the shelf icon in the Commit tab toolbar to shelve changes to .idea/shelf/ (IDEA-compatible format).",

  // Amend checkbox
  "commitMessage.amend": "Amend",

  // Create Branch dialog titles
  "dialog.createBranchFromPoint": "Create Branch from '{startPoint}'",
  "dialog.createBranchFromCommit": "Create Branch from {shortHash}",

  // Panel toolbar - History label
  "panel.toolbar.history": "History:",
  // FileChangeTree
  "file.changedFiles": "Changed Files",
  "file.selectCommitToSee": "Select a commit to see changed files",
  "file.noChangesToFile": "No changes to {fileName} in this commit",

  // CommitDetail
  "commit.selectToViewDetails": "Select a commit to view details",

  // CommitList column headers
  "commitList.author": "Author",
  "commitList.date": "Date",
  "commitList.hash": "Hash",
  // CommitInfo date prefix
  "commitInfo.on": "on",
  // Commit panel tabs
  "commitTab.commit": "Commit",
  "commitTab.shelf": "Shelf",
  "commitTab.stash": "Stash",
  // File item action buttons
  "fileItem.stageChanges": "Stage Changes",
  "fileItem.unstageChanges": "Unstage Changes",
  "fileItem.openFile": "Open File",

  // Repo selector
  "panel.toolbar.selectRepo": "Select Repo",

  // Commit buttons
  "commitButton.commit": "Commit",
  "commitButton.commitAndPush": "Commit and Push...",
  "commitButton.commitAndPushMenu": "Commit and Push",
};
