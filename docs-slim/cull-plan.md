# Orca 功能裁剪方案（cull plan）· v2

> 状态：**方案已定稿，未动代码**
> v2 变更：v1 的「水平分层」顺序被证伪（会留下红的中间态），改为**垂直域切片 + 脊柱先行**；补齐 v1 漏掉的 3 个依赖面（`src/main/providers/` 212、`src/main/runtime/rpc/methods/` 481、构建清单）；工时上修。
> v3 变更：4 项阻断决策已锁定（见 §6）：D1 只留本地 git · D2 仅进程/标题检测 · D3 orca-profiles 拆分 · D4 保留 `src/cli/runtime-client`。
> 目标：裁剪为 **Git + 文件管理 + 多项目 + 终端 + WSL** 的本地 IDE，保留最小 agent 能力。
> 落地：原仓库新分支 `cull/local-ide`，Phase 0 打 tag `pre-cull`。
> 明细见 [`cull-inventory.md`](./cull-inventory.md)。

---

## 1. 范围

### 保留（6 域）

Git（本地操作 / 源控制面板 / diff / worktree）· 文件与目录管理（文件树 / 编辑器 / 搜索 / Quick Open）· 多项目管理（多仓库 / 项目分组 / 文件夹工作区 / 磁盘分析）· 终端（完整 PTY 栈）· WSL · **最小 agent**（终端启动 agent CLI + 状态显示）。

### 删除

`cloud/` `mobile/` `src/relay/` `src/cli/` · SSH 与远程执行 · 内置浏览器 / Design Mode · Computer Use · 模拟器 · 任务集成（GitHub/GitLab/Jira/Linear）· Native Chat · 用量与账号 · 技能 · 插件 · 编排 · 定时自动化 · AI Vault · 遥测 · 自动更新 · 临时 VM · Remote Server · 产物 · 活动流 · Notebook · 语音 · 宠物 · 休眠。

### 平台

**Windows + Linux**；macOS 全剥离。

### 规模

约 **1.1 万–1.3 万文件**（含测试与资产）。真正的依赖面不是文件数，而是四个枢纽：

| 枢纽 | 规模 |
| --- | --- |
| `src/shared/execution-host*` | 883 个非测试文件引用 |
| `src/main/runtime/` | 2,189 文件（其中 `rpc/methods/` 481、`orca-runtime-*.ts` 320） |
| `src/main/providers/` | 212 文件（SSH git/fs/pty provider 在此，**不在 `ssh/`**） |
| `src/main/ipc/` | 842 顶层文件，逐文件分类 |

---

## 2. 四条原则

1. **垂直域切片。** 每个域一个 commit，同时删：叶子目录 + `runtime/rpc/methods/<域>` + `providers/<域>` + preload bridge/api + store slice + renderer 组件 + 构建清单条目 + 该域测试。**枢纽本身就是叶子**——水平分层必然留下红的中间态。
2. **脊柱先行。** `execution-host` 收窄、`rpc/methods/index.ts` 分类、`providers/` 去 SSH、`orca-runtime` barrel 重指向，必须在任何域删除**之前**完成。
3. **先普查，再删除。** 四个边界裁定（`rpc-contract` / `structured-agent-session-*` / `runtime/` / `orca-profiles`）会把上千文件在两个集合间搬动，必须 Phase 0b 用调用图定案。
4. **构建清单跟着删除走。** `pnpm tc` 看不见 `electron.vite.config.ts` 的 rollup inputs、`config/knip.json`、tsconfig 的显式 include；漏改会在 Phase 7 构建时才炸。

---

## 3. 必须存活的枢纽

| 模块 | 说明 |
| --- | --- |
| `src/shared/execution-host*` | 883 引用。**收敛为 local + wsl**，不能删 |
| `src/main/runtime/orca-runtime.ts` | 仅 69 行门面；主体是 320 个 `orca-runtime-*.ts`。**逐文件裁，别当单文件处理** |
| `src/main/runtime/rpc/methods/` | 481 文件，`index.ts` 聚合 50 个 import。**逐域分类 + 改 index** |
| `src/main/providers/` | 212 文件，含 SSH git/fs/pty provider。**去 SSH，留本地/WSL** |
| `src/shared/rpc-contract/` | **122 引用，不是 remote 专属**（74 在 rpc/methods、3 在 ipc、3 在 git）。保留本地子集 |
| `src/shared/child-process/**` | git runner / wsl.exe / ripgrep / daemon / hooks 全走它 |
| `src/shared/stable-pane-id.ts`、`pane-key*.ts` | terminal/editor/git/worktree 共用 pane 恒等式 |
| `src/shared/agent-status-*`、`agent-detection`、`agent-hook-*`、`tui-agent*` | 被 100+ 保留文件 import，是 agent 域锚点 |
| `src/shared/git-*`、`worktree/**`、`terminal-*`、`pty-*`、`wsl-*` | 保留域本体 |
| `src/main/runtime/orca-runtime-*.ts` | 按域裁：PTY/worktree/agent-status 留，browser/orchestration/account/automation/mobile 控制器的 re-export 删 |

**agent 域切线**：保留「进程 / 标题 / hook 上报 → 状态行」单向流；删除「向 agent 投递内容 / 接管会话」反向通道。**这条线由 D2 决定粗细**（见 §6）。

---

## 4. 分阶段计划

### Phase 0 — 基线（0.5–1 天）

1. `git switch -c cull/local-ide`；打 tag `pre-cull`
2. 记录基线：`pnpm tc`、`pnpm lint`、`pnpm test`、`pnpm test:e2e`、`pnpm build:win`/`build:linux` 结果与耗时
3. 用 `git ls-files | wc -l` 复核规模；确认基线全绿（不绿先修基线）

### Phase 0b — 调用图普查（2–3 天，**阻塞所有删除**）

用 `knip` + `rg` 对四组做逐文件 keep/delete 分类，产出 `docs-slim/cull-census.md`：

1. `src/shared/rpc-contract/`(89) — 哪些被本地 git/ipc/daemon 用（留），哪些只被 relay/mobile 用（删）
2. `structured-agent-session-*`(~35) + `native-chat-*`(~90) — 被保留的 `agent-hooks/server/server-ingest-structured.ts` 与 122 个 `src/main/runtime/*` 引用；按 D2 定义切
3. `src/main/runtime/`(2,189) — 按域打标：pty/worktree/agent-status（留）、rpc/methods（逐域）、browser、orchestration、account、automation、mobile、structured-session
4. `orca-profiles/`(73) — 拆出 `profile-cloud-*`(~20，账号，删) 与 `profile-storage-paths` / `profile-project-move-record` / `profile-project-domain-changes`（本地多项目持久化，**留**）
5. `src/main/ipc/`(842) — 逐文件打标删除域

**退出**：四个边界各有明确文件清单；`docs-slim/cull-census.md` 成文。

### Phase 1 — 脊柱收窄（5–8 天）

1. `execution-host` 枚举去 remote 变体，保留 local + wsl；逐调用点清分支（git / persistence / worktree / terminal 是主战场）
2. `src/main/providers/` 去 SSH provider（`ssh-git-provider` / `ssh-filesystem-provider` / `ssh-pty-provider` 等约 80 文件），留本地与 WSL
3. `runtime/rpc/methods/index.ts` 按 Phase 0b 分类删 import；删对应 method 文件
4. `orca-runtime.ts` 门面重指向：去掉 `runtime-linear-command-surface` 等删除域 import 与 re-export
5. 修构建清单：`config/tsconfig.node.json`（去掉 `src/renderer/.../skill-freshness-display-status.ts`、`src/relay/**`）、`config/tsconfig.tc.web.json`（去掉 `src/main/gitlab/mappers.ts`、`worktree-linked-work-item-metadata.ts`、`window/macos-app-activation.ts`）、根 `tsconfig.json` 的 relay reference

**退出**：`pnpm tc` 绿。

### Phase 2 — 解耦保留面（3–5 天）

1. **e2e harness**：16 个 spec 依赖 `src/cli/runtime-client`（含保留功能用例：终端保活、tab 重启持久化、worktree 可见性）。**D4 已定：保留 `src/cli/runtime-client` 子目录**，并收窄 `config/tsconfig.cli.json` 只覆盖该子目录
2. **store slice**：`slices/{worktrees/listing,worktrees/teardown,tabs,terminals}` 依赖 `structured-agent-session` — **D2 已定：仅进程/标题检测**，改为消费 `agent-status` 进程/标题来源，删结构化投影字段
3. **agent-hooks/server**：**剥离 `server-ingest-structured.ts` 的结构化 ingest**（`shared/agent-session-wire` + `structured-agent-session-*` 随之删除），只保留进程/标题状态上报通道；同步清理 122 个 `src/main/runtime/*` 文件的结构化路径
4. **遥测 stub**：`src/renderer/src/lib/telemetry.ts` + `src/main/telemetry` 先 no-op stub（41 个保留文件在用），清 `electron.vite.config.ts` 的 `ORCA_BUILD_IDENTITY` / `ORCA_POSTHOG_WRITE_KEY` / `ORCA_DIAGNOSTICS_TOKEN_URL`
5. **持久化**：为 `persisted-state-types.ts` 的 `schemaVersion` 加「pre-cull 旧状态」fixture 测试；确认 `profile-state-database-validation.ts` / `profile-state-domain-write-validation.ts` 不会因未知域拒载

**退出**：`pnpm tc` 绿、`pnpm test` 绿、定向 e2e 冒烟通过。

### Phase 3 — 垂直域切片（15–22 天）

每片一个 commit，动作模板：**叶子 + `rpc/methods/<域>` + `providers/<域>` + preload bridge/api + store slice + renderer 组件 + `electron.vite` inputs + `knip.json` + 测试**。

| 片 | 域 | 主要删除面 |
| --- | --- | --- |
| S1 | SSH / 远程 | `src/main/ssh/`(359)、providers 残留、`remote-*`、`runtime/relay/`(55) |
| S2 | 浏览器 / Design Mode | `src/main/browser/`(529)、`components/browser-pane/`(301)、`web/`(103) |
| S3 | Computer Use | `src/main/computer/`(62)、`native/computer-use-*` |
| S4 | 模拟器 | `src/main/emulator/`(79)、`components/emulator-pane/`(54) |
| S5 | 任务集成 | `github` `gitlab` `jira` `linear` 主+渲染共约 200、`pull-request-page/`(54)、`task-page/`(47)、`hosted-review*` |
| S6 | Native Chat + structured session | `src/main/native-chat/`(385)、`components/native-chat/`(418)、按 D2 |
| S7 | 用量 / 账号 / 限速 | `usage/` `rate-limits/` `*-usage/` `*-accounts/`、`components/stats/`(34) |
| S8 | 技能 | `src/main/skills/`(201)、`components/skills/`(116)、`skills/` 资产 |
| S9 | 插件 | `src/main/plugins/`(121)、`components/plugin-catalog/` |
| S10 | 定时自动化 | `src/main/automations/`(65)、`components/automations/`(282) |
| S11 | AI Vault | `ai-vault/`(292)、`ai-vault-search/`(102) |
| S12 | 遥测 | `telemetry/`(20)、`observability/`(21)、调用点清理 |
| S13 | 自动更新 | `updater/`(16)、`UpdateCard*`、按 D3 |
| S14 | 临时 VM / Server | `ephemeral-vm-*`(14)、`server/`(4)、`runtime/push/`(30) |
| S15 | 产物 / 活动 / Notebook / 语音 / 宠物 / 休眠 | `artifacts/`(13)、`components/activity/`(80)、`notebook/`(4)、`speech/`(39)、`pet/`(22)、`star-nag/`(16) |
| S16 | web client | `renderer/src/web/`、`vite.web.config.ts`、`build:web*` |

**退出（每片）**：`pnpm tc` 绿 + 该片定向测试绿。全片完成后 `pnpm test` 全绿。

### Phase 4 — 外圈整删（3–5 天）

`cloud/`(525) `mobile/`(3,394) `src/relay/`(378) `src/cli/`(307，**保留 `src/cli/runtime-client`**，其余全删) `skills/` `skill-guides/` `skill-stubs/` `resources/skills/` `native/computer-use-*` `native/keyboard-layout-macos` `native/notification-status-macos` `native/windows-cli-launcher` `Casks/` `examples/plugins/` `config/relay-assets/`。

同步：`pnpm-workspace.yaml`、`package.json`（`bin.orca`、~60 脚本、~20 依赖、`build:desktop` 链）、`electron.vite.config.ts`（去 cli/relay 目标）、`config/knip.json`、`config/tsconfig.cli.json`、`vite.web.config.ts`、CI 中 26 个 `cloud-*` + mac/mobile/computer/packaged-browser/skill-roundtrip workflow。

**退出**：`pnpm install` 可跑、`pnpm tc` 绿。

### Phase 5 — macOS 剥离（3–5 天）

整删与去分支清单见 `cull-inventory.md` §I（含约 60 个共享文件的 `darwin` 分支、15+ 构建脚本、5 个 mac workflow）。**只删字面分支，保留 `NodeJS.Platform` 联合类型。**

**退出**：`pnpm tc` 绿、`pnpm build:win` / `build:linux` 可产出。

### Phase 6 — 门禁 / i18n / 文档 / 构建（2–4 天）

- i18n：按顶层命名空间删键，跑 `pnpm sync:localization-catalog` 收敛；同步 `verify:localization-*`、`en-runtime-required.json`、`localized-catalog.ts`、~12 个 locale 回归测试
- lint：`pnpm lint` 去 skill / rpc-catalog 相关 verify；oxlint 配置去 `mobile` 目标；prune `config/{max-lines,ts-nocheck,runtime-electron}-baseline.txt`
- 构建：`config/electron-builder.config.cjs` 去 mac 块 + relay/cli/skills/mobile/ai-vault/plugins 的 `extraResources`；`build:native` 矩阵去 mac
- 杂项：husky / lint-staged globs、`resources/onboarding`、`docs/site` 构建（`docs.yml`）、`verify:renderer-boot-graph`
- 文档：`docs/site/content/docs` 删 ssh/remote-servers/mobile/android-apk/telemetry/cli/browser；`docs/reference` 删约 14 篇；README + `docs/readme/*` + `AGENTS.md` 去 mac/ssh/skills 段；更新 `docs-slim/feature-tree.md`

**退出**：`pnpm lint` 绿、`pnpm tc` 绿。

### Phase 7 — 验证（2–3 天）

- `pnpm test`、`pnpm test:e2e`（headless，`ORCA_BACKGROUND_LAUNCH=1`）、`pnpm build:win`、`pnpm build:linux`
- 手动冒烟 6 项：git 提交/分支/diff、文件树与编辑、多仓库切换与项目分组、终端（多标签/分屏/重启保活）、WSL distro 终端、agent CLI 启动 + 状态点
- 按 `.github/pull_request_template.md` 写 PR 描述

**退出**：6 项冒烟全过，构建产物可运行。

---

## 5. 验证约束（重要）

- `pnpm tc` **只跑** `tsconfig.node` / `tsconfig.tc.web` / `tsconfig.tc.cli`。它看不见：`electron.vite.config.ts` 的 rollup inputs、`config/knip.json`、e2e tsconfig、`src/relay` 的独立 project。**「tc 绿」不等于可构建、不等于 e2e 可跑。**
- `config/tsconfig.e2e.json` 标注 "NOT ENFORCED YET"（约 198 个既有错误）→ e2e 类型安全没有门禁，只能靠实际跑。
- headless 冒烟入口：`pnpm test:e2e` → playwright `electron-headless` + `ORCA_BACKGROUND_LAUNCH=1`；`tests/e2e/helpers/headless-paired-runtime-host.ts` 驱动本地 runtime（依赖 `src/cli/runtime-client`）。
- `audit:dead-code`（knip）**不在** `pnpm lint` 里 → 删除后的孤儿 shared 模块不会被自动发现，必须靠 Phase 0b 普查 + 手工 call-graph。

---

## 6. 决策状态

### 已锁定（4 项）

| # | 决策 | 结论 | 落地影响 |
| --- | --- | --- | --- |
| D1 | 「Git 相关」边界 | **只留本地 git** | S5 整片删：`github` `gitlab` `jira` `linear` 主+渲染约 200 文件、`pull-request-page/`(54)、`task-page/`(47)、`hosted-review*`、`shared/{github,gitlab,jira,linear,task-*}` |
| D2 | 「最小 agent 状态」 | **仅进程/标题检测** | `structured-agent-session-*`(~35) 与 `native-chat-*`(~90) 可删；Phase 2 必须**剥离 `agent-hooks/server/server-ingest-structured.ts` 的结构化 ingest**，并清理 122 个 `src/main/runtime/*` 文件的结构化路径；`shared/agent-session-wire` 随删 |
| D3 | `orca-profiles/` | **拆分** | 删 `profile-cloud-*`(~20，账号)；留 `profile-storage-paths.ts` / `profile-project-move-record.ts` / `profile-project-domain-changes.ts`（本地多项目持久化，54 引用方） |
| D4 | `src/cli/runtime-client` | **保留该子目录** | Phase 4 的 `src/cli` 删除为**例外删除**：保留 `src/cli/runtime-client`（e2e harness，16 个 spec 依赖），其余 cli 全删；`tsconfig.cli.json` 需收窄而非删除 |

### 待定（可延后到对应阶段）

| # | 决策 | 最晚决定时机 | 说明 |
| --- | --- | --- | --- |
| D5 | 自动更新 | Phase 3 / S13 | 删（随 `updater/`）／只留 Windows 更新器 |
| D6 | 防休眠 | Phase 5 | Windows 无等价实现，补 `SetThreadExecutionState` 或砍掉 |
| D7 | 未读 Dock 角标 | Phase 5 | Win 可 `setOverlayIcon`，Linux 无解 |
| D8 | 界面语言 | Phase 6 | 6–7 种 → 砍到 `en + zh` 可省大量 i18n 维护 |
| D9 | iOS 模拟器 | Phase 5 | 随 macOS 下线；iOS 发布流水线依赖 mac runner，需单独确认 |

---

## 7. 风险

| 风险 | 缓解 |
| --- | --- |
| 水平分层留下红的中间态 | 已改垂直切片；每 commit 自洽 |
| 枢纽低估 | 已把 `providers/`(212)、`rpc/methods/`(481)、`runtime/`(2,189) 列入脊柱阶段 |
| tsconfig 显式 include 跨项目炸 | Phase 1 与每片删除时同步改 include 清单 |
| 构建清单漏改 | 每片必须同时改 `electron.vite` inputs 与 `knip.json` |
| 旧持久化状态拒载 | Phase 2 加 pre-cull fixture 测试 |
| 删多了不可逆 | 分支 + `pre-cull` tag |
| e2e harness 被误删 | D4 + Phase 2 先解耦 |

---

## 8. 工时

| 阶段 | 人日 |
| --- | --- |
| Phase 0 基线 | 0.5–1 |
| Phase 0b 普查 | 2–3 |
| Phase 1 脊柱 | 5–8 |
| Phase 2 解耦保留面 | 3–5 |
| Phase 3 垂直域切片（16 片） | 15–22 |
| Phase 4 外圈 | 3–5 |
| Phase 5 macOS | 3–5 |
| Phase 6 门禁/i18n/文档 | 2–4 |
| Phase 7 验证 | 2–3 |
| **合计** | **约 35–55 人日** |

> v1 的 13–23 人日是错的：它没算 `providers/`、`rpc/methods/`、`ipc/` 逐文件分类，也没算垂直切片后每片的构建清单同步。若只做 Phase 0–2 + 外圈（得到一个「保留面自洽、功能仍在」的中间态），约 11–17 人日。
