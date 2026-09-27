# Tasks

> 顺序遵循 `design.md` D-6（便宜先行、脊柱前置、域清扫与装配总线并行）。每个切片一个 commit，切片内自洽：删除该域叶子 + `runtime/rpc/methods/<域>` + `providers/<域>` + preload bridge/api + store slice + renderer 组件 + 构建清单条目 + 该域测试 + 本域在 `src/main/startup/*` 的注册行。
> 验证命令：`pnpm tc`（类型）、`pnpm test <path>`（单测）、`pnpm run verify:rpc-params-catalog`（生成物一致）、`pnpm test:e2e`（headless，`ORCA_BACKGROUND_LAUNCH=1`）。

## 1. 基线与回滚点

- [x] 1.1 创建分支 `cull/local-ide` 并打 tag `pre-cull`；验证：`git tag --list pre-cull` 有输出且 `git branch --show-current` 为 `cull/local-ide`
- [ ] 1.2 跑基线 `pnpm tc`、`pnpm lint`、`pnpm test`、`pnpm build:linux`，结果与耗时记入 `docs-slim/cull-baseline.md`（`build:win` 本机无工具链，移交 CI）；验证：命令在文档中各有记录，`pnpm test` 记录完整失败集合作为后续弱信号基线
- [x] 1.3 用 `git ls-files | wc -l` 与 `find src -name '*.ts*' | wc -l` 复核规模并写入 `docs-slim/cull-baseline.md`；验证：数字与 `proposal.md` 的 7,400/9,100 量级一致，偏差超过 20% 时更新 proposal

## 2. 调用图普查与边界裁定（阻塞所有删除）

- [x] 2.1 产出 `docs-slim/cull-census.md`，对 `rpc-contract`(89)、`structured-agent-session`(~35)、`native-chat`(~90)、`src/main/runtime`(2,189)、`orca-profiles`(73)、`src/main/ipc`(842) 逐文件标 keep/delete；验证：六个目标各有完整文件清单，且无「未定」条目
- [x] 2.2 裁定 `rpc-contract` 本地子集；验证：清单列出被 `src/main/git/*` 与 `src/main/ipc/*` 引用的 schema 文件名，且 `pnpm tc` 在后续切片中不因该目录失败
- [x] 2.3 拆分 `orca-profiles`：列出 `profile-cloud-*`（删）与 `profile-storage-paths` / `profile-project-move-record` / `profile-project-domain-changes`（留）；验证：给出 54 个引用方中依赖保留件的清单，`pnpm test src/main/orca-profiles` 通过
- [ ] 2.4 为 pre-cull 持久化状态加 fixture 测试（含已移除的 browser/ssh/automation 字段）；验证：`pnpm test src/main/persistence` 通过，且测试在旧状态含未知字段时断言正常载入
- [x] 2.5 逐项处理 `design.md` 的 6 个 Open Question：给出结论或明确标注延后到对应切片；验证：`design.md` 每个 Open Question 有条目状态，且无「未定且不阻塞」之外的悬空项

## 3. 脊柱收窄（WAVE 2）

- [ ] 3.1 `ExecutionHostKind` 删除 `ssh` 与 `runtime` 变体，只留 `local`；验证：`pnpm tc` 通过，且 `rg "ExecutionHostKind" src/shared/execution-host.ts` 只出现 `local`
- [ ] 3.2 收窄 `execution-host-registry`，去掉 `ssh-types` / `runtime-types` / `runtime-environments` / `protocol-compat` / `protocol-version` / `runtime-host-status` 依赖；验证：`pnpm tc` 通过，且 `rg "from './ssh-types'|from './runtime-types'" src/shared/execution-host-registry.ts` 无输出
- [ ] 3.3 删除 `src/main/providers/` 的 SSH provider（约 80 文件），保留本地与 WSL；验证：`pnpm tc` 与 `pnpm test src/main/providers` 通过
- [ ] 3.4 按 2.1 分类结果删 `src/main/runtime/rpc/methods/` 的删除域方法并改 `methods/index.ts` 聚合表；验证：`pnpm tc` 通过，且 `pnpm run generate:rpc-params-catalog && pnpm run verify:rpc-params-catalog` 通过
- [ ] 3.5 `src/main/runtime/orca-runtime.ts` 门面重指向，去掉删除域 import 与 re-export；验证：`pnpm tc` 通过，且 `rg "runtime-linear-command-surface|runtime-automation-controller|runtime-account-controller|runtime-mobile-notification-controller|runtime-remote-fetch-controller" src/main/runtime/orca-runtime.ts` 无输出
- [ ] 3.6 脊柱分流落地：整删 `browser-client-host-protocol.ts`、`structured-agent-session-create.ts`、`structured-agent-session-projection.ts`；就地收窄 `native-chat-session-options.ts`（改名 `agent-session-options.ts`）与 `native-chat-types.ts`；收窄 `browser-workspace-types.ts`；`telemetry-events.ts` 转 no-op stub；验证：`pnpm tc` 通过，且每个脊柱的引用计数相对基线下降
- [ ] 3.7 同步构建清单：`config/tsconfig.node.json`（去 `src/renderer/.../skill-freshness-display-status.ts`、`src/relay/**`）、`config/tsconfig.tc.web.json`（去 gitlab/worktree-linked-work-item-metadata/macos-app-activation）、根 `tsconfig.json`（去 relay reference）、`electron.vite.config.ts` inputs、`config/knip.json`；验证：`pnpm tc` 通过且 `pnpm run audit:dead-code` 可运行
- [ ] 3.8 把脊柱判定表与 `execution-host` 收窄结论落进 `docs-slim/cull-census.md`；验证：表格覆盖 `design.md` D-2 列出的全部 8 个脊柱

## 4. 便宜域整删（WAVE 1，切割边 ≤ 11）

每片动作：删域目录与其测试、`runtime/rpc/methods/<域>`、`providers/<域>`、preload bridge/api、store slice、renderer 组件、构建清单条目，并移除本域在 `src/main/startup/*` 与 `src/preload/index.ts` / `api-types.ts` 的注册行。

- [x] 4.1 删 `src/main/star-nag/`；验证：`pnpm tc` 通过，`find src/main/star-nag` 无输出
- [ ] 4.2 删 `src/main/server/`、`src/main/ephemeral-vm-*.ts`、`runtime/push/`；验证：`pnpm tc` 通过，三者路径均不存在。**⚠️ 见 design.md F-1：本任务不能独立执行**——`server ↔ orcad ↔ ssh ↔ relay` 互相咬合，已合并为「远程宿主集群」切片（含 tasks 8.1 的 ssh 与 relay/serve-mode）
- [ ] 4.3 删 `src/main/artifacts/` 与 renderer `components/artifacts/`；验证：`pnpm tc` 通过
- [ ] 4.4 删 `src/main/jira/`、`src/main/linear/` 与 renderer 对应任务页；验证：`pnpm tc` 通过
- [x] 4.5 删 `src/main/speech/` 与 renderer `components/dictation/`、voice settings pane、dictation store slice、speech ipc/RPC、`sherpa-onnx` 运行时引用；验证：`pnpm tc` 通过（`sherpa-onnx` 的 package.json 依赖条目移除并入 4.14）
- [x] 4.6 删 `src/main/plugins/`、renderer `components/plugin-catalog/`、`shared/plugins/`、`resources/plugins/`、plugin panel/settings/consent/marketplace、plugin 命令与打包校验脚本；验证：`pnpm tc` 通过（agent 侧 codex/hermes/opencode 的“plugin”配置不属本域，保留）
- [ ] 4.7 删 `src/main/automations/`、renderer `components/automations/`、`persistence/scheduling-automations/`；验证：`pnpm tc` 通过
- [ ] 4.8 删 `src/main/skills/` 与 renderer `components/skills/`、`skills/` `skill-guides/` `skill-stubs/` `resources/skills/`；验证：`pnpm tc` 通过
- [ ] 4.9 删 `src/main/ai-vault/`、`ai-vault-search/` 与 renderer AiVault 面板；验证：`pnpm tc` 通过
- [x] 4.10 让遥测永不传输并移除可见面：`TELEMETRY_ENABLED true→false`（主进程 `track()` 走禁用分支）、renderer `lib/telemetry.ts` 的 `track()` 改 no-op、删除首启遥测 opt-in 面（`TelemetryFirstLaunchSurface`）。**范围说明**：`telemetry`/`observability`/`crash-reporting` 三个模块及其约 300 个调用点暂留，其删除归入 Group 5 域清扫（两次尝试分别产生 300–600 处类型错误，簇与每个装配层交织；见 design F-7/F-8/F-9 与 D-2）。验证：`pnpm tc` 0（需先清 `config/*.tsbuildinfo`，见 F-7）、changed-code 质量门禁通过
- [ ] 4.11 删 `src/main/updater/`、`UpdateCard*`、`electron-updater` 依赖（按 2.5 的 D5 结论决定是否保留 Windows 更新器）；验证：`pnpm tc` 通过且 `pnpm install` 成功
- [ ] 4.12 删 `src/main/orca-profiles/` 的账号部分（按 2.3 清单），保留本地多项目持久化件；验证：`pnpm tc` 与 `pnpm test src/main/orca-profiles` 通过
- [ ] 4.13 删 `src/main/ipc/` 中剩余删除域 handler 散件（按 2.1 清单）；验证：`pnpm tc` 通过
- [x] 4.14 依赖清理批次一：移除 `sherpa-onnx` + 5 个平台 optional 包（语音域已删，实测 0 代码引用）。**其余依赖暂留**：`qrcode`(6)、`@streamparser/json`(1)、`tldts`(2)、`react-grab`(3)、`@linear/sdk`(11) 仍被尚未删除的域引用，随各自域一并移除；`electron-updater` 条目已在 4.11 移除（仅剩注释）。验证：`pnpm install --lockfile-only` 退出 0（1469 条目）、`pnpm tc` 0
- [x] 4.15 删设备模拟器域（Android emulator + iOS simulator）：`src/main/emulator/`(79)、renderer `components/emulator-pane/`(54)、`shared/emulator-{touch,keyboard}-frame`、`shared/rpc-contract/emulator-params`、preload emulator bridge/api、settings `MobileEmulator*` panes、`lib/{emulator-right-split-target,open-mobile-emulator-tab,simulator-launch-coordination,ensure-simulator-tab}`、cli emulator spec/handler/format、emulator skill bundle（guides/skills/stubs）。**实施中新增的任务**（原 tasks 未单列此域）；验证：`pnpm tc` 通过，`skill-guide-cli-parity` 3 passed，`verify:bundled-skill-guides` / `verify:skill-bundle-manifest` 退出 0。终端 headless emulator（`src/main/daemon/headless-emulator*`）保留
- [x] 4.16 删桌面宠物域（`renderer/components/pet/`、main pet ipc bundle/manifest/sprite、preload pet api、`PetStatusSegment`、pet UI-state 字段）。**实施中新增的任务**（原 tasks 未单列此域）；验证：`pnpm tc` 通过
- [ ] 4.17 删 Notebook 域（`src/main/notebook/`、`ipc/notebook.ts`、preload notebook bridge、`shared/notebook-*`、编辑器 ipynb 内核组件）。⚠️ 需先确认 `editor/IpynbViewer` 等文件查看器是否属保留侧，再决定边界；验证：`pnpm tc` 通过且 ipynb 文件查看行为按结论保留或移除

## 5. 域清扫（WAVE 2.5）

对每个域，按文件名、import 关系与内容关键字在保留目录中做全量命中，逐个判定 keep/delete，并入对应切片。与第 6 组可并行（改的是不同文件集）。

- [ ] 5.1 SSH 散件：`src/main/ipc/`(58)、`src/main/providers/` 残留、`persistence/leasing-ssh-ptys/`、`ports/ssh-*`、`src/main/runtime/*ssh*`、renderer `hooks`/`store/slices`/`lib`/`settings`(~48)；验证：`rg -l "ssh" src/main src/renderer/src --glob '!*.test.*'` 剩余项仅为通用执行主机件，且每项在 `docs-slim/cull-census.md` 有裁定
- [ ] 5.2 mobile 散件：`src/main/runtime/`(~61)、`runtime/rpc/methods` 残留、renderer(~13)；验证：`rg -l "mobile" src/main src/renderer/src --glob '!*.test.*'` 计数归零或仅剩保留注释
- [ ] 5.3 browser 散件：`src/main/runtime/`(~77)、renderer `store/slices/browser`、`lib`；验证：`rg -l "browser" src/main src/renderer/src --glob '!*.test.*'` 计数归零或仅剩 `browser-url` 等保留件
- [ ] 5.4 其余域散件：`structured-agent-session`(47)、`orchestration`(62)、`usage`(51)、`skill`(40)、`automation`(36)、`ai-vault`(70)、`ephemeral-vm`(18)、`native-chat`(23)、`emulator`(10)、`computer`(5)；验证：逐域 `rg` 计数归零或列出保留理由
- [ ] 5.5 把全部散件清单与裁定落进 `docs-slim/cull-census.md`；验证：每个删除域都有散件小节，且无「命中但未裁定」

## 6. 装配总线收尾（WAVE 3）

- [ ] 6.1 收尾 `src/main/startup/*` 12 个热点文件、`ipc/register-core-handlers/`、`ipc/settings.ts`、`window/attach-main-window-services.ts` 的跨域残留接线；验证：`pnpm tc` 通过，且 `rg "automations|plugins|star-nag|emulator|orca-profiles" src/main/startup` 无输出
- [ ] 6.2 重生成 `rpc-params-catalog.generated.ts` 并使 `pnpm lint` 中的 `verify:rpc-params-catalog` 通过；验证：`pnpm run verify:rpc-params-catalog` 退出码为 0
- [ ] 6.3 持久化解析收尾：`loaded-state-parsing.ts`、`normalize-loaded-*`、`profile-state-database-validation.ts` 的删除域分支；验证：2.4 的 pre-cull fixture 测试通过，且应用能载入旧状态
- [ ] 6.4 更新 `docs-slim/cull-inventory.md`，把已完成项标注为完成并记录实际删除数；验证：文档中每个条目有状态

## 7. 中等域（WAVE 4）

- [ ] 7.1 删浏览器主域：`src/main/browser/`(529)、renderer `components/browser-pane/`(301)、`renderer/src/web/`(103)、`agent-browser` 依赖；验证：`pnpm tc` 通过，`pnpm test src/main/browser` 无该目录
- [ ] 7.2 删托管与任务集成：`github`/`gitlab`/`bitbucket`/`gitea`/`azure-devops` 主进程域、renderer 任务页与评审页、`pull-request-page/`、`hosted-review*`；验证：`pnpm tc` 通过，`rg -l "hosted-review" src --glob '!*.test.*'` 无输出
- [ ] 7.3 删 `src/main/runtime/orchestration/`(297) 与编排 RPC 方法；验证：`pnpm tc` 通过，`rg "orchestration" src/main/runtime --glob '!*.test.*'` 只剩保留件的非编排用法
- [ ] 7.4 收尾 `src/main/runtime/rpc/`（删除域方法、relay/push 残留）与 `runtime-*contracts` 的 remote 专属件；验证：`pnpm tc` 通过且 `pnpm run verify:rpc-params-catalog` 通过
- [ ] 7.5 处理 `observability` 与 `crash-reporting`（按 2.5 的 D6 结论同删或同留）；验证：`pnpm tc` 通过，`rg -l "observability" src/main/crash-reporting` 结果与结论一致
- [ ] 7.6 删 renderer 剩余删除域：`runtime/`(444)、`ssh/`(8)、组件残留、`use-task-page-*`；验证：`pnpm tc` 通过
- [ ] 7.7 依赖清理批次二（`ssh2` + `@types/ssh2`、`serve-sim`、`tweetnacl`、`posthog-node`、`@anthropic-ai/claude-agent-sdk` 视最小 agent 实现）；验证：`pnpm install` 与 `pnpm tc` 通过

## 8. 昂贵域（WAVE 5，各自独立成片，不并行）

- [ ] 8.1 删 SSH 主域：`src/main/ssh/`(359) 与 `runtime/relay/`(55) 残留；验证：`pnpm tc` 通过，`find src/main/ssh -type f` 无输出，且第 5.1 的散件已无残留
- [ ] 8.2 删用量与账号：`usage/`、`rate-limits/`、`claude-usage/`、`*-accounts/`、renderer `components/stats/`；验证：`pnpm tc` 通过
- [ ] 8.3 删 Native Chat 主域并完成 `claude/` + `codex/` 结构化手术（51/100 非测试文件）：`native-chat/`(385)、renderer `components/native-chat/`(418)、`agent-hooks/server` 结构化 ingest、`agent-session-wire`；验证：`pnpm tc` 通过，`pnpm test src/main/claude src/main/agent-hooks` 通过，且 `rg "structured-agent-session|native-chat" src/main/claude --glob '!*.test.*'` 无输出
- [ ] 8.4 验证 `agent-launch-status` spec 的「不投递内容 / 不接管会话」两条要求：确认不存在向 agent 会话写入或恢复会话的通道；验证：`rg -l "agent-prompt-|agent-interrupt-intent|agent-resume-|agent-question-answer" src --glob '!*.test.*'` 无输出

## 9. 外圈整删（WAVE 6a）

- [ ] 9.1 删 `cloud/`(525)、`mobile/`(3,394)、`src/relay/`(378)；验证：三者路径不存在，且 `pnpm tc` 通过
- [ ] 9.2 删 `src/cli/`（保留 `src/cli/runtime-client`）并收窄 `config/tsconfig.cli.json` 只覆盖该子目录；验证：`pnpm tc` 通过，`pnpm test:e2e --project=electron-headless` 中 16 个依赖 `cli/runtime-client` 的 spec 仍可加载
- [ ] 9.3 删 `native/computer-use-*`、`native/keyboard-layout-macos`、`native/notification-status-macos`、`native/windows-cli-launcher`、`Casks/`、`examples/plugins/`、`config/relay-assets/`；验证：路径不存在且 `pnpm tc` 通过
- [ ] 9.4 收尾 `package.json`（`bin.orca`、~60 脚本、`build:desktop` 链）、`pnpm-workspace.yaml`、`electron.vite.config.ts`、`vite.web.config.ts`、`config/knip.json`；验证：`pnpm install`、`pnpm tc`、`pnpm run build:electron-vite` 通过
- [ ] 9.5 CI：删 26 个 `cloud-*` 与 mac/mobile/computer/packaged-browser/skill-roundtrip workflow，摘 `pr.yml`/`e2e.yml`/`unit-tests.yml`/`release-cut.yml` 的对应 job；验证：`actionlint`（或本地 workflow 语法检查）无错，且 `.github/workflows` 中无引用 `cloud/` 或 `mobile/` 的 job

## 10. macOS 剥离（WAVE 6b）

- [ ] 10.1 删 main 进程 mac 专属模块：`macos-keychain/`、`macos-*` 系列、`dock/`、TCC 全家、`emulator/serve-sim-*` 与 iOS 后端、`updater-mac-install.ts`、mac 构建脚本；验证：`pnpm tc` 通过，且 `find src/main -name 'macos-*'` 无输出
- [ ] 10.2 约 60 个共享文件去 `darwin` 分支（`createMainWindow.ts`、`system-tray.ts`、`system-fonts.ts`、`ghostty/*`、`hydrate-shell-path.ts` 等），保留 `NodeJS.Platform` 联合类型；验证：`pnpm tc` 通过，`rg "=== 'darwin'|=== \"darwin\"" src --glob '!*.test.*'` 无输出
- [ ] 10.3 renderer 去 mac 分支与 ⌘/⇧ 文案（`app-window-chrome.ts`、`TitlebarLeftControls`、`lib/shortcut-platform.ts`、`TerminalMacKeyboardSection.tsx`、TCC 通知组件）；验证：`pnpm tc` 通过，`rg "isMac|⌘" src/renderer/src --glob '!*.test.*'` 无输出
- [ ] 10.4 构建与打包去 mac：`electron-builder.config.cjs` 的 mac 块与 mac `extraResources`、`build:native` 矩阵、`resources/darwin/`、entitlements、`icon.icns`、5 个 mac workflow 与矩阵中的 macos 条目；验证：`pnpm build:win` 与 `pnpm build:linux` 产出
- [ ] 10.5 依赖去 darwin（`sherpa-onnx-darwin-*`）；验证：`pnpm install` 成功且 lockfile 中无 darwin 二进制
- [ ] 10.6 落地 D6/D7 决策（防休眠 Windows 实现或砍掉、Dock 角标 `setOverlayIcon` 或砍掉）；验证：`pnpm tc` 通过，且结论记入 `design.md` 的 Open Questions

## 11. 门禁 / i18n / 文档

- [ ] 11.1 i18n 按顶层命名空间裁剪 `src/renderer/src/i18n/locales/*.json`，跑 `pnpm sync:localization-catalog`；验证：`pnpm run verify:localization-catalog`、`verify:localization-extraction`、`verify:localization-coverage` 均通过
- [ ] 11.2 lint 链去 skill/rpc-catalog 相关 verify，oxlint 配置去 `mobile` 目标，prune `config/{max-lines,ts-nocheck,runtime-electron}-baseline.txt`；验证：`pnpm lint` 通过
- [ ] 11.3 清理 husky/lint-staged globs（含 `!(cloud)`）、`resources/onboarding`、`orca.yaml`、`config/{docker,dev-app-update.yml}`；验证：`pnpm install` 与 `pnpm lint` 通过
- [ ] 11.4 文档：`docs/site/content/docs` 删 ssh/remote-servers/mobile/android-apk/telemetry/cli/browser，`docs/reference` 删约 14 篇，README + `docs/readme/*` + `AGENTS.md` 去 mac/ssh/skills 段；验证：`pnpm run check:readme-local-links` 通过
- [ ] 11.5 更新 `docs-slim/feature-tree.md` 为裁剪后功能树；验证：树中只含 6 个保留域，且深度不超过 5 层

## 12. 集成验证

- [ ] 12.1 强门禁：`pnpm tc` 与 `pnpm lint` 退出码均为 0；`pnpm test` 失败集合不超出 `docs-slim/cull-baseline.md` 记录的基线集合；验证：tc/lint 为 0，且 test 无新增失败
- [ ] 12.2 headless e2e：`ORCA_BACKGROUND_LAUNCH=1 pnpm test:e2e`；验证：保留功能 spec 全通过，无依赖已删模块的失败
- [ ] 12.3 构建产物：`pnpm build:linux`；验证：产物存在且可启动到主界面。`build:win` 本机无工具链，移交 CI
- [ ] 12.4 手动冒烟 6 项：git 提交/分支/diff、文件树与编辑、多仓库切换与项目分组、终端多标签分屏与重启保活、WSL 发行版终端、agent CLI 启动 + 状态点；验证：6 项逐条记录结果，任一失败回到对应切片
- [ ] 12.5 按 `.github/pull_request_template.md` 写 PR 描述；验证：四个小节（before/after、机制、替代方案、影响）均有内容
