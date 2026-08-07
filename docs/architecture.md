# JetGit 插件架构文档

## 概述

JetGit 是一个将 IntelliJ IDEA Git 体验带到 VS Code / Cursor 的扩展插件。支持 Git 图表可视化、IDEA 风格的提交面板（含搁置/贮藏）、分支管理、Cherry-Pick、Rebase、Merge、三方合并编辑器等功能。

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端（Extension Host） | Node.js + TypeScript，通过 `child_process.execFile` 调用 Git CLI |
| 前端（Webview） | React + Zustand 状态管理 + Vite 构建 |
| 通信 | 自定义消息协议（postMessage），`MessageRouter` ↔ `bridge` |
| 构建 | esbuild（后端） + Vite（前端） |

## 目录结构

```
jetgit/
├── src/                          ← 后端（Node.js / VS Code Extension Host）
│   ├── extension.ts              ← 插件入口，activate()，注册所有命令和消息处理器
│   ├── git/
│   │   ├── gitService.ts         ← 核心：封装所有 git CLI 调用（execFile("git", ...)）
│   │   ├── graphLayout.ts        ← Git Graph 图形布局算法（分支线排列）
│   │   ├── cache.ts              ← Git 数据缓存层
│   │   ├── repoScanner.ts        ← 子仓库自动发现（扫描嵌套 .git 目录）
│   │   └── types.ts              ← 后端类型定义
│   ├── messages/
│   │   ├── messageRouter.ts      ← 消息路由：webview ↔ extension 通信桥梁
│   │   └── protocol.ts          ← 通信协议定义（命令类型、事件类型）
│   ├── views/                    ← VS Code Webview 面板管理
│   │   ├── html.ts               ← 生成 webview HTML 容器（注入 main.js）
│   │   ├── gitLogViewProvider.ts ← Git Log 面板（JetGit 标签页）
│   │   ├── commitViewProvider.ts ← 提交面板
│   │   ├── pushPanel.ts          ← 推送面板
│   │   ├── rollbackPanel.ts      ← 回滚面板
│   │   ├── conflictsManager.ts   ← 冲突面板
│   │   ├── mergeEditorManager.ts← 三方合并编辑器
│   │   ├── diffEditorManager.ts ← Diff 编辑器导航
│   │   └── gitContentProvider.ts← 虚拟文件系统（git-brains:// 协议读取 git 内容）
│   ├── watchers/
│   │   └── gitWatcher.ts         ← 文件监听（.git/HEAD, index 等变化触发刷新）
│   └── i18n/                     ← 后端国际化
│       ├── index.ts
│       └── locales/en.ts, zh-cn.ts
│
├── webview/src/                  ← 前端（React SPA，打包成 main.js 注入 webview）
│   ├── main.tsx                  ← 前端入口，根据 data-mode 决定渲染哪个 App
│   │
│   ├── panel/                    ← Git Log 面板（JetGit）
│   │   ├── App.tsx               ←   图表面板主组件
│   │   └── components/
│   │       ├── GitGraphPanel.tsx ←     整体布局
│   │       ├── GitGraphSvg.tsx   ←     分支图 SVG 渲染
│   │       ├── CommitList.tsx    ←     提交列表（虚拟滚动）
│   │       ├── CommitRow.tsx     ←     单行提交
│   │       ├── BranchSidebar.tsx ←     分支侧边栏
│   │       ├── BranchTree.tsx    ←     分支树
│   │       ├── CommitDetail.tsx  ←     提交详情
│   │       ├── FileChangeTree.tsx←     文件变更树
│   │       ├── Toolbar.tsx       ←     顶部工具栏（含仓库选择器）
│   │       └── ...
│   │
│   ├── commit/                   ← 提交面板
│   │   ├── App.tsx               ←   提交面板主组件（Commit/Shelf/Stash 标签页）
│   │   └── components/
│   │       ├── CommitTab.tsx     ←     更改/已暂存文件列表
│   │       ├── FileItem.tsx      ←     文件行（含暂存/打开按钮）
│   │       ├── CommitMessageArea.tsx ← 提交消息输入框
│   │       ├── ShelfTab.tsx      ←     Stash 标签页
│   │       ├── IdeaShelfTab.tsx  ←     Shelf 标签页
│   │       └── ...
│   │
│   ├── push/                     ← 推送面板
│   ├── rollback/                 ← 回滚面板
│   ├── conflicts/                ← 三方合并冲突编辑器
│   │
│   └── shared/                   ← 前端公共模块
│       ├── bridge/                ←   通信层（与后端 messageRouter 对接）
│       ├── store/                 ←   状态管理（Zustand）
│       │   ├── panel-store.ts     ←     Git Log 面板状态
│       │   └── commit-store.ts    ←     提交面板状态
│       ├── i18n/                  ←   前端国际化
│       ├── components/            ←   公共组件（FileTree, Tooltip, CommitInfo）
│       └── theme/                 ←   CSS 变量主题
│
├── package.nls.json              ← VS Code 扩展本地化（英文）
├── package.nls.zh-cn.json        ← VS Code 扩展本地化（中文）
└── biome.json                    ← Lint / Format 配置
```

## 前后端职责划分

| | `src/`（后端） | `webview/src/`（前端） |
|---|---|---|
| **运行环境** | Node.js（VS Code Extension Host） | 浏览器（Webview iframe） |
| **能力** | 可执行 `git` 命令、读写文件系统、调用 VS Code API | 只能渲染 UI，不能直接访问文件系统或 git |
| **通信** | 通过 `MessageRouter` 接收请求、返回数据 | 通过 `bridge` 发送请求、接收响应 |
| **打包** | esbuild → `dist/extension.js` | Vite → `dist/webview/main.js` |
| **框架** | 纯 TypeScript，无 UI 框架 | React + Zustand 状态管理 |

## 通信流程

前端与后端通过 `postMessage` 进行通信，流程如下：

```
webview (React)                    extension.ts (Node.js)
     │                                    │
     │  bridge.request("getLog", {...})    │
     │ ─────────────────────────────────→ │
     │                                    │
     │                            messageRouter.handle("getLog", async (params) => {
     │                                    │
     │                              gitService.getLog(params)
     │                                ↓
     │                              execFile("git", ["log", ...])
     │                                ↓
     │                              return commitList
     │                            })
     │                                    │
     │ ←───────────────────────────────── │
     │  { commits: [...], lanes: {...} }  │
     │                                    │
     │  set({ commits, graphLayout })     │
     │  React re-render                    │
```

## 面板列表

所有面板共享同一个 `gitService` 实例，切换仓库时同步切换。

| 面板 | data-mode | 前端组件 | 用途 |
|------|-----------|----------|------|
| Git Log | `panel` | `PanelApp` | 提交历史图表、分支管理、文件差异 |
| 提交 | `commit` | `CommitApp` | 提交/暂存/搁置/贮藏 |
| 推送 | `push` | `PushApp` | 推送提交到远程 |
| 回滚 | `rollback` | `RollbackApp` | 回滚文件更改 |
| 冲突 | `conflicts` | `ConflictsApp` | 三方合并冲突解决 |
| 合并 | `merge` | `MergeStandaloneApp` | 独立合并编辑器 |

## Git 操作机制

插件**完全通过调用 Git CLI 命令行**来操作，不使用任何 Node.js Git 库（如 simple-git、nodegit 等）。

核心方法（`src/git/gitService.ts`）：

```typescript
private async execGit(args: string[], maxBuffer = MAX_BUFFER): Promise<string> {
    const { stdout } = await execFileAsync("git", args, {
        cwd: this.cwd,
        maxBuffer,
        env: {
            ...process.env,
            LC_ALL: "C",          // 强制英文输出，避免本地化影响解析
            GIT_TERMINAL_PROMPT: "0", // 禁止交互提示
        },
    });
    return stdout;
}
```

设计特点：
- 使用 NUL 字节（`\x00`）作为分隔符解析 `git log` 输出，避免歧义
- 10MB 缓冲区，应对大型仓库
- 缓存层（`GitCache`）减少重复 git 命令调用
- 文件监听（`GitWatcher`）监控 `.git/` 目录变化自动刷新

## 子仓库支持

插件支持在工作区中自动发现嵌套的 Git 仓库：

1. 插件激活时扫描工作区根目录，最多深入 2 层子目录
2. 查找所有包含 `.git` 的目录（跳过 `node_modules`、`dist` 等无关目录）
3. 为每个发现的仓库创建独立的 `GitService` 实例
4. 当存在多个仓库时，Git Log 面板工具栏显示仓库选择器
5. 切换仓库后，Git Log 和提交面板同步切换到目标仓库

相关代码：
- `src/git/repoScanner.ts` — 仓库扫描逻辑
- `src/extension.ts` 中 `getRepos` / `switchRepo` 消息处理器 — 仓库列表与切换
- `webview/src/panel/components/Toolbar.tsx` — 仓库选择器 UI

## 国际化

插件支持中英文双语，通过两层机制实现：

### 前端（webview）国际化
- `webview/src/shared/i18n/locales/en.ts` — 英文翻译
- `webview/src/shared/i18n/locales/zh-cn.ts` — 中文翻译
- 使用 `t("key", params)` 函数获取翻译文本

### 后端（extension）国际化
- `src/i18n/locales/en.ts` — 英文翻译
- `src/i18n/locales/zh-cn.ts` — 中文翻译
- 同样使用 `t("key", params)` 函数

### VS Code 扩展层面本地化
- `package.nls.json` — 英文（视图标题、命令标题）
- `package.nls.zh-cn.json` — 中文
- `package.json` 中通过 `%key%` 占位符引用

### 语言检测
- 设置项 `git-brains.language`：`auto`（默认）| `en` | `zh-cn`
- `auto` 模式下跟随 VS Code 显示语言
