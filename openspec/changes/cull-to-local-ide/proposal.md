# Proposal

## Why

Orca 的功能面覆盖桌面端、移动端、云中继、SSH 远程执行、内置浏览器、任务集成、编排与遥测。我们不使用其中大部分能力，但每次同步上游都要为它们承担冲突与维护成本。现在把它裁剪成一个**本地 IDE**：只保留 git、文件管理、多项目、终端、WSL，加上最小的 agent 能力（在终端启动 agent CLI + 状态显示）。

## What Changes

- 删除桌面端之外的四个构件：`cloud/`、`mobile/`、`src/relay/`、`src/cli/`（**例外**：保留 `src/cli/runtime-client` 作为 e2e harness）
- 删除 15 个功能域：SSH 与远程执行、内置浏览器与 Design Mode、Computer Use、模拟器、任务集成（GitHub/GitLab/Jira/Linear）、Native Chat、用量与账号、技能、插件、编排、定时自动化、AI Vault、遥测、自动更新、临时 VM / Remote Server、产物与活动流、Notebook、语音、宠物、休眠
- **BREAKING**：目标平台收窄为 Windows + Linux；macOS 全部剥离（打包、CI、原生模块、Keychain、TCC、Dock、caffeinate）
- **BREAKING**：`ExecutionHostKind` 由 `local | ssh | runtime` 收窄为 `local`（WSL 不是 host kind，是正交的 `wslDistro` 维度，保持不变）
- 保留 6 个能力域，行为不变：本地 git、文件/目录管理、多项目管理、终端、WSL、最小 agent
- 新增一个执行 workstream：**域清扫** —— 删除域的逻辑散落在保留目录中（`src/main/ipc/` 58 个 ssh 文件、`src/main/providers/` 45 个、`src/main/runtime/` 约 140 个 mobile/browser 命名文件、renderer 的 hooks/store/lib/settings 约 48 个），按目录删无法删干净
- 同步裁剪构建清单、依赖、CI、测试、i18n 与文档

## Capabilities

### New Capabilities

- `local-git`: 本地 git 操作、源控制面板、diff 评审、worktree 生命周期（不含托管 PR/MR 创建与任务页）
- `file-management`: 文件树、编辑器、内容搜索、Quick Open、远程文件浏览除外
- `multi-project-workspaces`: 多仓库、项目分组、文件夹工作区、磁盘空间分析
- `terminal`: PTY 栈与守护进程、多标签与分屏、主题与键位、滚动缓冲
- `wsl-execution`: WSL distro 发现，以及 git/pty/filesystem 的 `wslDistro` 路由
- `agent-launch-status`: 在终端启动 agent CLI；从进程与标题识别 agent 并显示状态（不做 hook 结构化上报、不投递内容、不接管会话）

### Modified Capabilities

（无。本仓库当前没有已归档 spec，`openspec list --specs` 为空。）

## Impact

- **代码**：`src/` 下约 7,400 个非测试文件删除；约 9,100 个保留文件需要手术
- **枢纽**：`src/main/runtime/`(2,189) · `src/main/ipc/`(1,050) · `src/main/providers/`(212) · `src/main/startup/`(140，装配总线，12 个热点文件各触碰 3–10 个删除域) · `src/main/claude/`(195，其中 51/100 非测试文件耦合 native-chat/structured/usage)
- **依赖**：约 20 个删除 —— `ssh2`、`@linear/sdk`、`sherpa-onnx`(+5 平台包)、`agent-browser`、`electron-updater`、`posthog-node`、`tweetnacl`、`qrcode`、`serve-sim`、`@streamparser/json`、`tldts`、`react-grab`
- **构建清单**（`pnpm tc` 看不见，必须手动同步）：`electron.vite.config.ts` rollup inputs（plugin-host / computer-sidecar / session-scanner×3 / wsl-transcript-fs / usage-scan-worker）与编译期常量、`config/knip.json`、`config/tsconfig.node.json`、`config/tsconfig.tc.web.json`、根 `tsconfig.json` 的 relay reference、`config/electron-builder.config.cjs` 的 `extraResources`
- **CI**：26 个 `cloud-*` + mac/mobile/computer/packaged-browser/skill-roundtrip workflow 删除；`pr.yml` / `e2e.yml` / `unit-tests.yml` / `release-cut.yml` 需摘 job
- **测试**：约 1,500 个单测 + 约 150 个 e2e 属纯删除集；`config/tsconfig.e2e.json` 无门禁（约 198 个既有错误）
- **i18n**：6 个语言 blob（5.8 MB，25 个顶层命名空间）按命名空间裁剪，并同步 `verify:localization-*` 链
- **门禁**：`src/shared/rpc-contract/rpc-params-catalog.generated.ts` 是生成物且触碰 4 个删除域，每个切片后必须重生成（`verify:rpc-params-catalog` 属 `pnpm lint`）
- **持久化**：`persisted-state-types.ts` 的旧状态含 browser/ssh/automation 段，需 pre-cull fixture 测试防拒载
- **规划文档**：`docs-slim/cull-plan.md`、`docs-slim/cull-inventory.md`、`docs-slim/feature-tree.md`
