export const en: Record<string, string> = {
  "extension.noDiffFileList":
    "JetGit: No diff file list. Double-click a file in Changed Files first.",
  "extension.noWorkspace": "JetGit: No workspace open.",
  "extension.unableToLocateConflictFile":
    "Unable to locate conflict file from SCM item.",
  "extension.sourceFileNotExists":
    "Source file does not exist in the working directory.",
  "extension.unsavedMergeChanges":
    "You have unsaved merge changes. Discard them?",
  "extension.discard": "Discard",
  "extension.rollbackFile":
    'Rollback changes to "{filePath}"? This cannot be undone.',
  "extension.rollbackFiles":
    "Rollback changes to {count} file(s)? This cannot be undone.",
  "extension.rollback": "Rollback",
  "extension.delete": "Delete",
  "extension.deleteShelved":
    'Delete shelved changes "{stashId}"? This cannot be undone.',
  "extension.failedUnshelve": "Failed to unshelve file: {message}",
  "extension.deleteShelf": 'Delete shelf "{shelfName}"? This cannot be undone.',
  "extension.couldNotShowDiff":
    'Could not show diff for "{filePath}": {message}',
  "extension.patchSaved": "Patch saved to {path}",
  "extension.failedCreatePatch": "Failed to create patch: {message}",
  "extension.patchCopied": "Patch copied to clipboard",
  "extension.failedCopyPatch": "Failed to copy patch: {message}",
  "extension.importedPatches": "Imported {count} patch{plural}",
  "extension.failedImportPatches": "Failed to import patches: {message}",
  "extension.clipboardEmpty":
    "Clipboard is empty or does not contain patch content.",
  "extension.clipboardInvalid":
    "Clipboard content does not appear to be a valid patch.",
  "extension.importedClipboardPatch":
    "Imported patch from clipboard as shelf entry.",
  "extension.failedImportClipboard":
    "Failed to import patch from clipboard: {message}",
  "extension.deleteBranch": 'Delete branch "{branchName}"?',
  "extension.showMyBranches": "Show My Branches: filter applied in branch tree",
  "extension.toggledFavorite": "Toggled favorite: {branchName}",
  "extension.ok": "OK",
  "extension.cancel": "Cancel",
  "extension.rebasing": "Rebasing {branchName}",
  "extension.rebasingShort": "Rebasing",
  "extension.cherryPicking": "Cherry-picking {hash}",
  "extension.cherryPickingShort": "Cherry-picking",
  "extension.merging": "Merging",
  "extension.mergingBranch": "Merging {branch}",
  "extension.savePatchFile": "Save Patch File",
  "extension.importPatchFiles": "Import Patch Files",
  "extension.patchFilesFilter": "Patch files",
  "extension.allFilesFilter": "All files",
  "extension.openPanel": "Open IDEA Git Graph Panel",
  "extension.noCurrentBranch": "No current branch",
  "extension.invalidCommitHash": "Invalid commit hash",
  "extension.mergeCommitsCannotBeDropped": "Merge commits cannot be dropped",
  "extension.operationTimedOut": "Operation timed out",
  "extension.rollbackChanges": "Rollback Changes",
  "extension.pushCommitsTo": "Push Commits to {branchName}",
  "extension.conflicts": "Conflicts",
  "extension.commitRemovedWarning":
    "Commit was removed from history but its changes could not be applied to the working directory",
  "extension.shelvedChanges": "Shelved changes",
  "extension.noChangesToShelve": "No changes to shelve",
  "extension.headVsStaged": "{filePath} (HEAD ↔ Staged)",
  "extension.headVsWorkingTree": "{filePath} (HEAD ↔ Working Tree)",
  "extension.shelvedDiff": "{filePath} (Shelved: {stashId})",
  "extension.shelvedInShelf": "{fileName} (Shelved in {shelfName})",
  "extension.compareBranches": "{currentBranch} ↔ {branchName}",
};
