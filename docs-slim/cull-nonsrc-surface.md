# 非 `src/` 删除面：构建清单 / e2e / i18n

`pnpm tc` 看不见这一层。删除域落地后必须同步裁剪，否则 `pnpm lint`（reliability gates、knip、readme links）
与 `pnpm test:e2e` 会继续指向已删模块。清单由 `rg -l` 于裁剪中段实测得出，按任务组归档。

## 1. 构建与门禁清单（对应任务 9.4 / 11.2）

| 文件 | 需要处理的域 | 说明 |
| --- | --- | --- |
| `config/tsconfig.node.json` | relay | `src/relay` include/引用 |
| `config/tsconfig.cli.json` | cli、orca-profiles | 任务 9.2 要求收窄为只覆盖 `src/cli/runtime-client` |
| `config/tsconfig.relay.json` | relay | relay 工程整体随域下线 |
| `config/knip.json` | ai-vault、cli、relay | workspace/entry 列表 |
| `config/reliability-gates.jsonc` | ssh、browser、skills、ai-vault、native-chat、cli、relay | 已剪 15 条，剩这些要复检 |
| `config/max-lines-baseline.txt` | ssh、relay | 基线行记录的是已删文件 |
| `config/scripts/*`（~30 个） | ssh、browser、skills、ai-vault、native-chat、cli、relay | bench/probe/workflow 测试脚本，宿主模块删后成死件 |
| `config/vitest.performance.config.ts` | relay | 性能工程 include |
| `package.json` | skills、cli、relay | `test:skill-sharing:release`、`build:cli`、relay 构建脚本、`bin.orca` |
| `electron.vite.config.ts` | ai-vault、native-chat | 额外 entry（已删域仍留 entry 会构建失败） |

`config/scripts/ci-shard-timings.json` 被几乎每个域命中：它是耗时表，**不是**构建依赖，删除域时只需删对应 key，
不删文件。

## 2. e2e spec（对应任务 12.2）

`tests/e2e` 共 533 个 spec，其中按域名可判定为「整删」的：

- **ssh / remote-host（~50）**：`ssh-*.spec.ts`、`ssh-docker-*.spec.ts`、`nested-runtime-ssh-*`、`local-ssh-browser-routing`、`paired-remote-*`、`ssh-codex-*`
- **browser（~35）**：`browser-*.spec.ts`、`paired-client-hosted-browser*`、`paired-*-browser-*`、`client-hosted-browser-tooltip-preview`
- **native-chat（4）**：`native-chat-*.spec.ts`
- **orchestration（10）**：`orchestration-*.spec.ts`
- **plugin（4）**：`plugin-*.spec.ts`
- **automation（3）**：`automation-*.spec.ts`
- **ai-vault（2+2）**：`ai-vault-panel-search`、`ai-vault-session-delete`、`ai-vault-typing-bench-*`
- **skill（3）**：`paired-skill-installation`、`settings-skill-detection`、`staging-skill-sharing`
- **linear / github / gitlab（7）**：`linear-*`、`github-*`、`repro-7732-gitlab-*`
- **mobile / emulator（2）**：`mobile-banner`、`floating-mobile-emulator-tab`

⚠️ **不可整删的命名陷阱**：`runtime-file-browser-windows-drives.spec.ts` 是**文件管理器**的 Windows 盘符浏览
（保留域），`terminal-*-artifact.ts` 的 "artifact" 指测试产物而非 `src/main/artifacts/`。
按文件名批量删除前必须逐个确认，否则会误删保留域的 e2e 覆盖。

## 3. i18n（对应任务 11.1）

`src/renderer/src/i18n/locales/` 为 `en/es/fr/ja/ko/zh` 六语言；`en.json` 顶层 25 个命名空间。
删除域对应、需整删的命名空间：`browser`、`githubChecks`、`sessionSearch`、`sessionHistory`、`aiVault`。
`featureTips`、`dashboardPopout` 是否保留取决于 D6 与 dashboard 存活范围，需在 11.1 现场裁定。
裁完必须跑 `pnpm sync:localization-catalog` 并过三个 verify。
