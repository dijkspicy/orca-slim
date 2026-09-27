# Design

## Context

动机见 `proposal.md`。这里只记录塑造方案的当前状态与约束。

**代码组织与功能域不重合。** 这是本工程最大的隐性约束。`src/main/ssh/`(359) 是唯一「目录 = 域」的大块；其余删除域散落在保留目录中：

```
 目录维度                              删除域
 --------------------------------      ------
 src/main/ssh/              359        SSH      <- 目录 = 域
 src/main/providers/        212        SSH+本地  <- 45 个 *ssh* 文件
 src/main/ipc/            1,050        混合      <- 58 个 *ssh* 文件
 src/main/runtime/        2,189        混合      <- 61 个 *mobile* + 77 个 *browser*
 renderer hooks/store/lib/settings    混合      <- ~48 个 *ssh* 文件
```

**执行主机模型与直觉不符。** `ExecutionHostKind = 'local' | 'ssh' | 'runtime'`，**没有 `wsl`**。WSL 是正交的 `wslDistro` 维度，threaded through git options / pty owner / filesystem options。`runtime:` 仅由配对的远程 runtime 产生（`orcad` / `daemon` / `server` 中零引用）。

**枢纽规模远大于目录清单暗示的。** `src/main/runtime/` 2,189 文件（其中 `rpc/` 642、`orchestration/` 297、root 级约 1,011）；`orca-runtime.ts` 只有 69 行，是个门面，主体是 320 个 `orca-runtime-*.ts`。`src/shared/execution-host*` 被 883 个非测试文件引用。

**约束**：`pnpm tc` 只跑 `tsconfig.node` / `tsconfig.tc.web` / `tsconfig.tc.cli`，看不见 `electron.vite.config.ts` 的 rollup inputs、`config/knip.json`、e2e tsconfig、`src/relay` 独立 project。`audit:dead-code`（knip）不在 `pnpm lint` 里。`config/tsconfig.e2e.json` 标注 "NOT ENFORCED YET"（约 198 个既有错误）。

## Goals / Non-Goals

**Goals**

- 裁剪后保留集自洽：`pnpm tc` / `pnpm lint` / `pnpm test` 绿，`pnpm build:win` 与 `pnpm build:linux` 可产出
- 删除域不残留逻辑：不留「没有入口 UI 但仍能执行」的 SSH / mobile / browser 代码
- 过程可回滚：每个切片一个 commit，阶段边界可停
- 保留域行为不变

**Non-Goals**

- 不重构保留域的内部设计（除删除域耦合必须动的部分）
- 不新增功能
- 不追求删除域测试的等价覆盖迁移；删除域测试随功能删
- 不做 i18n 文案质量改进（只做按命名空间裁剪）

## Decisions

### D-1 垂直域切片，不是水平分层

**决定**：每个切片一个 commit，同时删「叶子目录 + `runtime/rpc/methods/<域>` + `providers/<域>` + preload bridge/api + store slice + renderer 组件 + 构建清单条目 + 该域测试」。

**理由**：水平分层（先删所有 `src/main` 叶子、再删所有 renderer）必然留下红的中间态——枢纽本身就是叶子。`orca-runtime.ts` 在模块加载时 import `runtime-linear-command-surface` 并 re-export automation/account/mobile/remote 控制器；`store/slices/{worktrees,tabs,terminals}` import `structured-agent-session`；`agent-hooks/server/server-ingest-structured.ts` import `agent-session-wire`。删任何一边都让另一边红。

**替代方案**：水平分层（被证伪）；一次性大爆炸（不可回滚，放弃）。

### D-2 脊柱按证据分流，不搞一刀切

**决定**：对「被保留代码广泛 import 的 shared 类型文件」逐个判定，不统一走一种策略。

| 脊柱 | 保留引用 | 策略 |
| --- | --- | --- |
| `browser-client-host-protocol.ts` | 3 | 整删（引用者全是 browser 域 + 生成物） |
| `structured-agent-session-create.ts` | 6 | 整删（D2 已定删结构化会话） |
| `structured-agent-session-projection.ts` | 8 | 整删（tabs slice + agent-session-wire 随 D2 删） |
| `native-chat-session-options.ts` | 16 | 就地收窄 + 改名 `agent-session-options`（这是**保留**的 agent 启动选项） |
| `native-chat-types.ts` | 23 | 就地收窄（引用者全是 `claude/` + `codex/` 的 background-task / subagent 行） |
| `browser-workspace-types.ts` | 46 | 就地收窄（多数是 tab-bar / tab-group / floating-terminal 行模型） |
| `ssh-types.ts` | 106 | **先做域清扫再定**（106 个「保留」引用者多为散落的 ssh 域文件） |
| `telemetry-events.ts` | 61 | stub（真正贯穿 daemon / agent-hooks / ipc-pty，删调用点不划算） |

**理由**：脊柱的「保留引用数」在修正分类器后大幅缩水——大部分引用者是删除域文件住在保留目录里。就地收窄的成本是 1 处改动 + 0 个调用点改动；彻底删除是 N 处改动。两者差一个量级，必须按证据选。

**替代方案**：统一 stub（语义空洞，类型不诚实）；统一整删（在 106 个引用者上改一遍，且多数是假引用）。

### D-3 `execution-host` 收窄为 `local`

**决定**：`ExecutionHostKind` 删除 `ssh` 与 `runtime` 两个变体，只留 `local`。WSL 不动——它不是 host kind。

**理由**：`ssh` 变体由 `ssh-types` / `runtime-environments` 驱动；`runtime:` 由配对远程 runtime 产生，本地 daemon 零引用。收窄后 `execution-host-registry` 丢掉 `ssh-types` / `runtime-types` / `runtime-environments` / `protocol-compat` / `protocol-version` / `runtime-host-status` 六个依赖，883 个引用点里的 `kind === 'ssh' | 'runtime'` 分支自然收敛。

**替代方案**：保留 host 抽象只删 UI（留下无法删除的远程代码路径）；把 WSL 提升为 host kind（改动面大且与现有 `wslDistro` 机制重复）。

### D-4 新增「域清扫」workstream

**决定**：在脊柱手术之后、中等域之前，插入一步按「域」而非「目录」的全量清扫：对每个删除域，按文件名、import 关系、内容关键字在保留目录中命中，逐个判定 keep/delete，产出散件清单并入对应切片。

**理由**：只删目录，交付的是一个仍然能连 SSH、仍有 mobile 配对逻辑的「精简版」，只是没有入口 UI。至少 200 个删除域文件住在保留目录里。

**替代方案**：只删目录（功能删不干净）；依赖 knip 自动发现（`audit:dead-code` 不在 `pnpm lint`，且 knip 找的是未引用，不是「域残留」）。

### D-5 产品边界（已与用户确认）

| 决策 | 结论 |
| --- | --- |
| 「Git 相关」边界 | 只留本地 git + diff + commit/push；任务集成整片删 |
| 「最小 agent 状态」 | 仅进程/标题检测；剥离 hook 结构化 ingest，`structured-agent-session-*` 与 `native-chat-*` 可删 |
| `orca-profiles/` | 拆分：删 `profile-cloud-*`（账号），留 `profile-storage-paths` / `profile-project-move-record` / `profile-project-domain-changes`（本地多项目持久化，54 引用方） |
| `src/cli/runtime-client` | 保留该子目录作为 e2e harness（16 个保留功能 spec 依赖它） |

### D-6 便宜先行，脊柱前置

**决定**：按「切割边成本」而非「域大小」排序。

```
 WAVE 1   便宜域整删（切割边 <= 11）
          star-nag, server, artifacts, tasks(jira/linear), push, speech,
          emulator, plugins, relay, automations, updater, skills, ai-vault,
          orca-profiles(拆), ipc 散落
 WAVE 2   脊柱手术（D-2 表）
 WAVE 2.5 域清扫（D-4）          <-- 与 WAVE 3 可并行
 WAVE 3   装配总线：src/main/startup/*(12 热点) + ipc/register-core-handlers
          + ipc/settings + window/attach-main-window-services
          + persistence/loaded-state-parsing + rpc-params-catalog 重生成
 WAVE 4   中等域：browser, forges+task, runtime/orchestration, runtime/rpc,
          observability, renderer web/runtime, renderer 组件
 WAVE 5   昂贵域（各自独立成片，不并行）：ssh, usage+accounts, native-chat,
          claude 手术
 WAVE 6   外圈整删 + macOS 剥离 + 门禁/i18n/文档 + 验证
```

**理由**：域大小 ≠ 手术成本。`star-nag`(16 文件/2 边) 与 `native-chat`(385/95) 不是一个量级。WAVE 2 必须先于 4/5——否则 `ssh-types` 的引用点会在删 ssh 时全炸。WAVE 2.5 与 3 改的是不同文件集（散件 vs 装配点），可并行。

### D-7 装配总线：切片各摘各的注册行，跨域残留集中收尾

**决定**：每个切片在删本域叶子的同时，移除本域在 `src/main/startup/*`、`src/preload/index.ts`、`api-types.ts` 的注册行——保证切片自洽。`startup/*` 的 12 个热点文件在切片期间会被顺序触碰多次，这是可接受的（切片是顺序的，不是并行的，不存在冲突）。WAVE 3 只处理**跨域残留**：`rpc-params-catalog` 重生成、持久化解析与 profile-state 校验、以及切片无法归属的共享脚手架。

**理由**：`main-process-state.ts` 触碰 10 个删除域，`main-process-preflight.ts` 与 `main-process-runtime-service.ts` 各 7 个。若把整批 `startup/*` 改动推迟到所有域删完之后，WAVE 1–2 的每个切片都会留下红的中间态，违反 D-1 的切片自洽约束。代价是热点文件被多次编辑；收益是每个 commit 都可停、可验证。

**替代方案**：装配总线先行（先把注册行全部摘掉再删叶子）——会让叶子暂时成为无引用死代码，knip 不在 `pnpm lint` 里所以不会报错，但会引入一个「代码在、入口没了」的中间态，与「切片自洽」的语义冲突。

### D-8 每个切片同步构建清单

**决定**：切片的定义包含 `electron.vite.config.ts` inputs、`config/knip.json`、4 个 tsconfig include 清单，并重生成 `rpc-params-catalog.generated.ts`。

**理由**：`pnpm tc` 看不见这些；漏改会在 WAVE 6 构建时才炸。`rpc-params-catalog.generated.ts` 是生成物且触碰 4 个删除域，`verify:rpc-params-catalog` 属 `pnpm lint`。

## Risks / Trade-offs

- **切割边数字是上界** → 分类器是路径正则近似，部分删除域文件（`ipc/ssh-*`、`persistence/leasing-ssh-ptys/`）曾被算进保留。每个切片开工前用 `rg` 复核该域的实际引用者，不信历史数字。
- **`src/main/claude/` 是隐藏工作流** → 100 个非测试文件里 51 个耦合 native-chat / structured / usage。D-2「仅进程/标题检测」的账单落在这里。WAVE 5 单独成片，不与其他片并行。
- **`pnpm tc` 绿不等于可构建、不等于 e2e 可跑** → 每片额外跑定向 e2e 冒烟（headless，`ORCA_BACKGROUND_LAUNCH=1`）；WAVE 6 必须实跑 `build:win` / `build:linux`。
- **旧持久化状态拒载** → `persisted-state-types.ts` 的旧状态含 browser/ssh/automation 段，`profile-state-database-validation.ts` 可能拒绝过期域。WAVE 3 加 pre-cull fixture 测试。
- **e2e 无类型门禁** → `config/tsconfig.e2e.json` 约 198 个既有错误，不能作为回归信号；只能靠实跑。
- **`observability` / `crash-reporting` 归属未定** → `crash-reporting`(59) 只 4 处依赖 `observability`(21)。两者同删或同留，不能只删一个。列为开放问题。
- **工时估算易偏低** → 保留集 9,100 个非测试文件，主工作是给保留代码做手术而非删文件。

## Implementation Findings

实施中发现的事实，修正计划（D-1 的垂直切片粒度需要按实际耦合调整）。

### F-1 远程宿主集群互相咬合，tasks 4.2 无法独立执行

实测依赖：`src/main/ssh/` → `src/main/orcad/` → `src/main/server/`，且 `src/main/runtime/relay/` → `src/main/orcad/`。
删 `server/` 会断 `orcad/`，删 `orcad/` 会断 `ssh/` 与 `relay/`。

**修正**：把 tasks 4.2（server + ephemeral-vm + push）与 8.1（ssh）与 relay/serve-mode 合并为一个「远程宿主集群」切片：

```
集群成员（898 文件）
  src/relay/                        378
  src/main/ssh/                     359
  src/main/orcad/                   ~60
  src/main/runtime/relay/           55
  src/main/runtime/push/            30
  src/main/server/                  4
  src/main/runtime/remote-server-updater.ts
  src/main/startup/{serve-mode-argv,main-process-serve,serve-options,
                   serve-desktop-activation,serve-signal-handlers,
                   main-process-push-startup}.ts
```

真正的保留域手术面只有 **18 个文件**（其余 70 个引用者是 SSH 域散件，随集群一起删）：

- `src/main/startup/main-process-runtime-launch.ts`（6 处）
- `src/main/startup/main-process-state.ts`（6 处）
- `src/main/startup/main-process-preflight.ts`（4 处）
- `src/main/agent-hooks/wsl-hook-relay-*` + `wsl-guest-plugin-install` + `wsl-hook-fs-adapter`（7 个文件，见 F-2）
- `src/main/ipc/{filesystem/filesystem-write-handlers,filesystem-mutations,shell}.ts`、`ipc/worktrees/listing/*`（5 处）
- `src/main/runtime/runtime-file-commands-mobile-file-list-limit.ts`、`runtime-rpc/runtime-rpc-{pairing,state}.ts`（3 处）

### F-2 WSL hook relay 复用 SSH 传输原语（硬耦合）

`src/main/agent-hooks/wsl-hook-relay-*`（WSL，**保留**）导入 `src/main/ssh/ssh-channel-multiplexer.ts` 与 `src/main/ssh/relay-protocol.ts`（SSH，**删除**）。

**处置**：删除前必须把这两个文件里的**通用传输原语**提取到保留侧（例如 `src/shared/hook-channel-multiplexer.ts`），再删 SSH 连接层。不能直接删，否则 WSL hook relay 编译不过、功能失效。

### F-3 删除域散件实测

`src/main/ipc/`(58 ssh)、`src/main/providers/`(45 ssh)、`persistence/leasing-ssh-ptys/`(12)、`src/main/runtime/`(mobile/browser 命名约 140)、renderer `hooks`/`store`/`lib`/`settings`(~48) —— 与 D-4 的估计一致。

### F-4 其余域的自足性（实测修正）

原判断「`jira` / `linear` / `speech` / `emulator` / `notebook` 可能自足」只对一半成立：

- `emulator` **自足**（仅删除域内部引用）→ 已作为 4.15 完成
- `speech` **自足**（零集群耦合）→ 已并入 4.5 完成
- `plugins` / `pet` **自足** → 已并入 4.6 / 4.16 完成
- `jira` + `linear` + 六家 forge 集成 **不自足**：实测 **323 个保留域文件**引用它们（`src/main/github` 218、`gitlab` 53、`linear` 63、`jira` 32、`bitbucket`/`gitea`/`azure-devops` 35、`shared/github` 35、`shared/linear` 22、renderer 任务页/评审页 264）

### F-5 接线边密度是本工程的主导成本

实测每个删除域到保留装配层（`startup` / `preload` / `store` / `settings` 导航 / i18n / status-bar）的接线边数：

| 域 | 域自身文件 | 保留域引用者 |
| --- | --- | --- |
| telemetry + observability + crash-reporting | ~100 | ~240 |
| 六家 forge + jira/linear | ~780 | ~323 |
| plugins + speech + pet | ~290 | ~250（估算，实际修改 157 文件） |
| updater | ~50 | ~20 |
| emulator | ~180 | ~20 |

**结论**：切片成本由「接线拆除」决定，而非域自身大小。`emulator`(180 文件) 比 `telemetry`(~100 文件) 便宜一个量级。

**对 plan 的影响**：D-2 的「薄而广脊柱走 stub」策略适用范围比原判断更宽——telemetry 的全量调用点拆除（606 处 tc 错误）证明「完整拆除」在这类脊柱上不经济。后续遇到同类高扇入脊柱（如 `shared/execution-host` 883 引用）应**优先就地收窄/保留最小类型**，把完整拆除留给 Group 5 域清扫。

### F-6 工具链陷阱（实施中踩到）

- `pkill -f <pattern>` 会匹配到执行它的 shell 自身命令行 → 用 `pgrep`/`pkill` 时避免模式与当前命令字符串重合
- `nohup ... &` 在工具调用超时后会被连带杀死 → 长任务用 `setsid nohup ... < /dev/null &`
- 后台 fixer 会话可能被中断，中断时文件改动**已落盘**（不是原子的）；恢复前必须先 `git status` + `pnpm tc` 判断真实状态
- pre-commit（lint-staged → oxlint）会拦下 fixer 遗留的未使用变量与多余 `return`；提交前先跑 `npx oxlint <changed files>`
- 巨型字符串字面量文件（如 `src/cli/bundled-skill-guides.ts`）用 `rg` 检索会灌满上下文 → 用 `rg -c` 或限制输出

### F-7 stale `tsbuildinfo` 造成幻影错误（严重）

`config/*.tsbuildinfo`（node / tc.web / tc.cli 三个）在源文件被删除后会残留过期引用，使 `pnpm tc` 报出**大量「Module X has no exported member Y」的幻影错误**——即使工作树内容正确、该导出确实存在。

实测：一处工作树内容与好提交完全一致的状态下，`pnpm tc` 报 36 处此类错误；删除三个 `.tsbuildinfo` 后重跑，**0 错误**。

**影响**：实施过程中两次错误计数被显著高估（521 / 473 → 真实 312）。

**规则**：任何删除/移动源文件之后、测量 `pnpm tc` 之前，先 `rm -f config/*.tsbuildinfo`。

### F-8 提交时后台写手仍在活动会污染提交

`d5557a28e` 本应是 docs-only，却把后台 fixer 正在写入的 telemetry 删除一并提交了（lint-staged 的 "hiding/unstaging" stash-restore 与并发写冲突）。结果是 HEAD 处于 tc 红的状态，需要额外一个恢复提交。

**规则**：`git commit` 之前确认没有后台 specialist 在写 `src/`；或在提交前先 `git status` 核对暂存内容与预期一致。

### F-9 TS2307 是「模块已删」阶段的主导错误形态

删除一簇模块后，真实错误几乎全是 `TS2307 Cannot find module`（实测 312 中 303 处），而**不是** `TS2304 Cannot find name`。原因：TS 把无法解析的 import 绑定当作 `any`，其使用点不会级联报错。

**后果**：仅删除悬空 import 就能让 `pnpm tc` 变绿，但运行时会调用 `undefined` —— 所以修复必须**同时删掉调用点**，不能只删 import。这一点在派活时必须写清楚，否则会得到一个「编译过但运行时炸」的假绿。

## Migration Plan

- 分支 `cull/local-ide`，WAVE 0 打 tag `pre-cull`
- 每个切片一个 commit，commit 边界 = 可停点；每片结束 `pnpm tc` 绿
- 回滚：整支丢弃，或 `git reset --hard pre-cull`；切片粒度允许回退到任一 WAVE 边界
- 中间可交付态：WAVE 1–2 完成后得到「保留面自洽、删除域入口仍在」的可用版本

## Open Questions

**全部已裁定（任务 2.5）**：

1. **自动更新去留** → **删**（随 `updater/` 一起移除，精简版不提供自动更新）。用户裁定。
2. **防休眠 Windows 实现** → 延后到任务 10.6 决定（补 `SetThreadExecutionState` 或砍掉）。
3. **未读 Dock 角标** → 延后到任务 10.6 决定（Windows `setOverlayIcon` 或砍掉；Linux 无解）。
4. **界面语言数量** → 延后到任务 11.1 决定（6–7 种裁到 `en + zh`）。
5. **iOS 模拟器 / iOS 发布流水线** → 延后到任务 10.4（模拟器随 macOS 下线；发布流水线单独确认）。
6. **`observability` / `crash-reporting` 归属** → **同删**。用户裁定。

### 验证标准（用户裁定，任务 2.5）

目标原文要求「`pnpm test` 全绿 + `build:win`/`build:linux` 产出 + 6 项手动冒烟」，但基线实测不支持：

- `pnpm test` **起始即非绿**：41 处失败跨 20+ 文件，其中 9 个落在保留域，性质是容器无真实 PTY + 并发负载（个别用例单跑 30–42 秒），非逻辑回归。详见 `docs-slim/cull-baseline.md`。
- `build:win` 在 Linux 主机上存在工具链风险；`build:linux` 无基线。

因此本 change 的验收标准改为：

| 门禁 | 强度 | 判据 |
| --- | --- | --- |
| `pnpm tc` | **强** | 每个切片必须退出码 0 |
| `pnpm lint` | **强** | 每个切片必须退出码 0 |
| `pnpm test` | 弱 | 失败集合不超出基线集合（`docs-slim/cull-baseline.md`），不要求全绿 |
| `pnpm build:linux` | 中 | 最终验证阶段产出可启动产物 |
| `pnpm build:win` | 移交 CI | 本机无工具链，不计入本环境验收 |
| 6 项手动冒烟 | 降级 | 无 GUI 桌面，改为 headless e2e + 定向测试覆盖；手动项移交有桌面的环境 |

PTY / native 类用例视为环境依赖，不作为回归信号。
