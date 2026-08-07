export const zhCN: Record<string, string> = {
  // Common
  "common.delete": "删除",
  "common.cancel": "取消",
  "common.rollback": "回滚",
  "common.loading": "加载中...",
  "common.branch": "分支",
  "common.refresh": "刷新",
  "common.settings": "设置",
  "common.search": "搜索",

  // Panel - Toolbar
  "panel.toolbar.searchCommits": "搜索提交...",
  "panel.toolbar.selectBranch": "选择分支...",
  "panel.toolbar.selectUser": "选择用户...",
  "panel.toolbar.selectDateRange": "选择日期范围...",
  "panel.toolbar.viewOptions": "视图选项",
  "panel.toolbar.columns": "列",
  "panel.toolbar.author": "作者",
  "panel.toolbar.date": "日期",
  "panel.toolbar.hash": "哈希",
  "panel.toolbar.message": "消息",

  // Panel - App (sidebar toggle)
  "panel.showBranches": "显示分支",
  "panel.hideBranches": "隐藏分支",
  "panel.showDetails": "显示详情",
  "panel.hideDetails": "隐藏详情",

  // Panel - BranchSidebar
  "branch.newBranch": "新建分支",
  "branch.updateSelected": "更新选中",
  "branch.deleteBranch": "删除分支",
  "branch.compareWithCurrent": "与当前比较",
  "branch.showMyBranches": "显示我的分支",
  "branch.fetch": "拉取",
  "branch.toggleFavorite": "标记/取消收藏",
  "branch.navigateToHead": "导航日志到所选分支头",
  "branch.expandAll": "全部展开",
  "branch.collapseAll": "全部折叠",
  "branch.settings": "设置",
  "branch.hideBranches": "隐藏分支",
  "branch.onSingleClick": "单击时",
  "branch.updateBranchFilter": "更新分支筛选",
  "branch.navigateToBranchHead": "导航日志到分支头",
  "branch.searchPlaceholder": "分支或标签",
  "branch.local": "本地",
  "branch.remote": "远程",
  "branch.tags": "标签",
  "branch.branchNamePlaceholder": "分支名",
  "branch.checkout": "检出",
  "branch.rename": "重命名...",
  "branch.delete": "删除",
  "branch.update": "更新",
  "branch.push": "推送...",
  "branch.newBranchFrom": '从 "{name}" 新建分支...',

  // Panel - CommitContextMenu
  "commit.copyRevisionNumber": "复制版本号",
  "commit.cherryPick": "拣选",
  "commit.checkoutRevision": "检出版本",
  "commit.resetMixed": "重置当前分支到此 (Mixed)...",
  "commit.resetSoft": "重置当前分支到此 (Soft)...",
  "commit.resetHard": "重置当前分支到此 (Hard)...",
  "commit.revertCommit": "还原提交",
  "commit.dropCommit": "丢弃提交",
  "commit.newBranch": "新建分支...",
  "commit.newTag": "新建标签...",
  "commit.showInGitLog": "在 Git Log 中显示",

  // Panel - FileContextMenu
  "file.showDiff": "显示差异",
  "file.editSource": "编辑源文件",
  "file.openRepoVersion": "打开仓库版本",
  "file.revertSelected": "还原选中更改",
  "file.cherryPickSelected": "拣选选中更改",
  "file.copyPath": "复制路径",
  "file.copyFileName": "复制文件名",
  "file.historyUpToHere": "历史到此为止",

  // Panel - FileChangeTree
  "file.treeView": "树视图",
  "file.flatList": "平铺列表",

  // Panel - CreateBranchDialog
  "dialog.createBranch": "创建分支",
  "dialog.cancel": "取消",
  "dialog.create": "创建",

  // Commit panel - Toolbar
  "commitToolbar.refresh": "刷新",
  "commitToolbar.rollback": "回滚",
  "commitToolbar.shelveChanges": "搁置更改",
  "commitToolbar.showDiff": "显示差异",
  "commitToolbar.pull": "拉取",
  "commitToolbar.push": "推送...",
  "commitToolbar.viewOptions": "视图选项",
  "commitToolbar.expandAll": "全部展开",
  "commitToolbar.collapseAll": "全部折叠",
  "commitToolbar.groupBy": "分组方式",
  "commitToolbar.directory": "目录",
  "commitToolbar.show": "显示",
  "commitToolbar.unversionedFiles": "更改",

  // Commit panel - CommitTab
  "commitTab.noChanges": "未检测到更改",
  "commitTab.rollback": "回滚...",
  "commitTab.openInSystemFolder": "在系统文件夹中打开",

  // Commit panel - CommitFileContextMenu
  "commitFile.showDiff": "显示差异",
  "commitFile.jumpToSource": "跳转到源文件",
  "commitFile.openInSystemFolder": "在系统文件夹中打开",
  "commitFile.unstage": "取消暂存",
  "commitFile.addToVcs": "添加到版本控制",
  "commitFile.rollback": "回滚...",
  "commitFile.shelveChanges": "搁置更改...",
  "commitFile.delete": "删除...",

  // Commit panel - CommitMessageArea
  "commitMessage.placeholder": "提交信息 (Ctrl+Enter 提交)",
  "commitMessage.recentMessages": "最近的提交信息",

  // Commit panel - Shelf tabs
  "shelf.noShelvedChanges": "没有搁置的更改",
  "shelf.unshelve": "取消搁置...",
  "shelf.restore": "恢复",
  "shelf.delete": "删除...",
  "shelf.unshelveThisFile": "取消搁置此文件",
  "shelf.showDiff": "显示差异",
  "shelf.jumpToSource": "跳转到源文件",
  "shelf.copyPath": "复制路径",
  "shelf.importPatches": "导入补丁...",
  "shelf.importPatchesFromClipboard": "从剪贴板导入补丁",
  "shelf.createPatch": "创建补丁...",
  "shelf.copyAsPatch": "复制补丁到剪贴板",

  // Commit panel - Status banners
  "status.rebasing": "正在变基 {branchName}",
  "status.rebasingShort": "正在变基",
  "status.cherryPicking": "正在拣选 {hash}",
  "status.cherryPickingShort": "正在拣选",
  "status.merging": "正在合并",
  "status.mergingBranch": "正在合并 {branch}",
  "status.mergeInProgress": "合并进行中",
  "status.noMergeInProgress": "无合并进行中",
  "status.continueRebase": "继续变基 (git rebase --continue)",
  "status.abortRebase": "中止变基 (git rebase --abort)",
  "status.continueCherryPick": "继续拣选 (git cherry-pick --continue)",
  "status.skipCherryPick": "跳过拣选 (git cherry-pick --skip)",
  "status.abortCherryPick": "中止拣选 (git cherry-pick --abort)",
  "status.abortMerge": "中止合并 (git merge --abort)",
  "status.resolveConflicts": "解决冲突",

  // Conflicts
  "conflicts.name": "名称",
  "conflicts.leftTheirs": "左侧 (他们的)",
  "conflicts.centerResult": "中间 (结果)",
  "conflicts.rightYours": "右侧 (你的)",
  "conflicts.previousConflict": "上一个冲突",
  "conflicts.nextConflict": "下一个冲突",
  "conflicts.acceptAllLeft": "接受左侧全部更改",
  "conflicts.acceptAllRight": "接受右侧全部更改",
  "conflicts.discardAndClose": "丢弃更改并关闭",
  "conflicts.saveAndStage": "保存合并结果并暂存文件",
  "conflicts.skipLeft": "跳过左侧",
  "conflicts.acceptLeft": "接受左侧",
  "conflicts.acceptRight": "接受右侧",
  "conflicts.skipRight": "跳过右侧",
  "conflicts.undo": "撤销",

  // Push panel
  "push.pushRejected": "推送被拒绝",
  "push.rejectedMessage":
    '当前分支 "{branchName}" 的推送被拒绝。需要先合并远程更改再推送。',
  "push.rebase": "变基",
  "push.merge": "合并",
  "push.cancel": "取消",
  "push.noCommits": "没有要推送的提交",
  "push.noCommitsSelected": "未选择提交",
  "push.pushing": "推送中...",
  "push.push": "推送",
  "push.forcePush": "强制推送",
  "push.everythingUpToDate": "一切都是最新的",

  // Rollback panel
  "rollback.rollingBack": "正在回滚...",
  "rollback.rollback": "回滚",
  "rollback.deleteLocalCopies": "删除已添加文件的本地副本",
  // Commit panel - CommitTab group labels
  "commitTab.mergeConflicts": "合并冲突",
  "commitTab.changes": "更改",
  "commitTab.staged": "暂存的更改",
  "commitTab.unversionedFilesLabel": "更改",
  "commitTab.shelvedChanges": "搁置的更改",
  "commitTab.deleteDir": '删除 "{dirName}"...',

  // Branch tree - current branch header
  "branch.currentBranchLabel": "当前分支：",
  "branch.detached": "游离头",
  "branch.checkoutAndRebaseOnto": "检出并变基到 '{currentBranch}'",
  "branch.rebaseCurrentOnto": "将 '{currentBranch}' 变基到 '{branchName}'",
  "branch.mergeBranchIntoCurrent": "将 '{branchName}' 合并到 '{currentBranch}'",
  "branch.deleteConfirm": "删除分支 '{branchName}'？",
  "branch.forceDelete": "强制删除",
  "branch.notFullyMergedConfirm": "分支 '{branchName}' 未完全合并。强制删除？",
  "branch.merge": "合并",
  "branch.rebase": "变基",
  "branch.mergeConfirm": "将 '{branchName}' 合并到 '{currentBranch}'？",
  "branch.rebaseConfirm": "将 '{currentBranch}' 变基到 '{branchName}'？",

  // File context menu - confirm dialogs
  "file.revertConfirm": "从此提交还原 '{fileName}' 的更改？",
  "file.revert": "还原",
  "file.applyConfirm": "从此提交将 '{fileName}' 的更改应用到工作区？",
  "file.apply": "应用",

  // Commit context menu - confirm dialogs
  "commit.resetHardConfirm":
    "将 '{currentBranch}' 重置到 {shortHash} (hard)？这将丢弃所有未提交的更改。",
  "commit.reset": "重置",
  "commit.dropCommitConfirm":
    '丢弃提交 {shortHash} "{subject}"？\n\n这将从历史中移除该提交，但保留其更改为未暂存的修改。\n\n此操作不可撤销。',
  "commit.dropCommitLabel": "丢弃提交",

  // Panel toolbar - filter labels and date ranges
  "panel.toolbar.branch": "分支",
  "panel.toolbar.user": "用户",
  "panel.toolbar.allBranches": "所有分支",
  "panel.toolbar.allUsers": "所有用户",
  "panel.toolbar.allTime": "所有时间",
  "panel.toolbar.today": "今天",
  "panel.toolbar.last7Days": "最近 7 天",
  "panel.toolbar.last30Days": "最近 30 天",
  "panel.toolbar.last90Days": "最近 90 天",

  // CreateBranchDialog
  "dialog.branchName": "分支名：",
  "dialog.checkoutBranch": "检出分支",
  "dialog.overwriteExisting": "覆盖已有分支",

  // Shelf tab default
  "shelf.defaultChanges": "更改",
  // Shelf empty state hints
  "shelf.emptyHintStash":
    "使用提交标签页工具栏中的搁置图标来搁置更改以备后用。",
  "shelf.emptyHintIdea":
    "使用提交标签页工具栏中的搁置图标来搁置更改到 .idea/shelf/（IDEA 兼容格式）。",

  // Amend checkbox
  "commitMessage.amend": "修订",

  // Create Branch dialog titles
  "dialog.createBranchFromPoint": "从 '{startPoint}' 创建分支",
  "dialog.createBranchFromCommit": "从 {shortHash} 创建分支",

  // Panel toolbar - History label
  "panel.toolbar.history": "历史：",
  // FileChangeTree
  "file.changedFiles": "已更改的文件",
  "file.selectCommitToSee": "选择一个提交以查看更改的文件",
  "file.noChangesToFile": "此提交中 {fileName} 无更改",

  // CommitDetail
  "commit.selectToViewDetails": "选择一个提交以查看详情",

  // CommitList column headers
  "commitList.author": "作者",
  "commitList.date": "日期",
  "commitList.hash": "哈希",
  // CommitInfo date prefix
  "commitInfo.on": "于",
  // Commit panel tabs
  "commitTab.commit": "提交",
  "commitTab.shelf": "搁置",
  "commitTab.stash": "贮藏",
  // File item action buttons
  "fileItem.stageChanges": "暂存更改",
  "fileItem.unstageChanges": "取消暂存",
  "fileItem.openFile": "打开文件",

  // Repo selector
  "panel.toolbar.selectRepo": "选择仓库",

  // Commit buttons
  "commitButton.commit": "提交",
  "commitButton.commitAndPush": "提交并推送...",
  "commitButton.commitAndPushMenu": "提交并推送",
};
