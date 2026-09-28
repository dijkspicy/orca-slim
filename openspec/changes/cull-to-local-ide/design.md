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

### F-10 Barrel 级联：删域成员前必须先收窄 barrel（严重）

实测（远程宿主集群切片，已回滚）：

| 步骤 | 结果 |
| --- | --- |
| 删 `src/relay` + `src/main/{ssh,orcad,server}` + `runtime/{relay,push}`（890 文件） | **264** 处错误（258 处 TS2307，其中 73 个错误文件本身在删除域内、105 个在保留目录，后者多为散落的 SSH 域文件） |
| 再删散落在保留目录的 199 个 SSH 域文件（含 `src/main/providers/ssh-*`） | **4543** 处错误 —— 不可恢复 |

**根因**：`src/main/providers/index.ts` 是 barrel，re-export 了每个 provider。删掉 `ssh-*` 成员后 barrel 的导出消失，所有 barrel 消费者全线崩。同理 `ipc/register-core-handlers.ts` 等聚合点。

**规则**（对剩余每个大簇都适用）：

1. **先收窄 barrel，再删其成员** —— 同一 commit 内：先改 `index.ts` 只导出存活子集（或改成按需具名导出），再删成员。顺序反了就得到 4000+ 错误。
2. **聚合点（barrel / register-* / preload index / store index）单列一步**，不要与成员删除混在一起判断成败。
3. 该集群的正确切法：`删除集群全部成员 + 收窄全部 barrel + 修 66 个保留文件` 作为**一次原子操作**，而不是分层推进。

### F-11 远程宿主集群的实测地形（供下次直接使用）

- 集群规模 **890 文件**：`src/relay`(378)、`src/main/ssh`(359)、`src/main/orcad`(~60)、`src/main/server`(4)、`runtime/relay`(55)、`runtime/push`(30)
- 加上散落在保留目录的 SSH 域文件 **199 个**（`ipc/ssh*` ~25、`ipc/filesystem-import-ssh*`、`ipc/repos/remote-*`、`persistence/leasing-ssh-ptys`、`ports/ssh-*`、`providers/ssh-*`、`runtime/*ssh*`）
- **F-2 的正确解法已验证**：WSL hook relay 需要的传输原语只有 **4 个文件**——
  `ssh-channel-multiplexer.ts`、`ssh-multiplexer-transport-writer.ts`、`ssh-multiplexer-writer-lane-scheduler.ts`、`relay-protocol.ts`，
  它们的外部依赖只有 `src/shared/pty-write-settlement.ts` 与 `src/shared/relay-frame-decoder.ts`（均已在保留侧）。
  把这 4 个文件移到 `src/main/hook-relay/` 并改指 11 个 `agent-hooks/wsl-*` 的相对引用即可（已验证可行，本次回滚时一并撤销）。

### F-12 删除域构成强连通分量：不存在合法的增量删除顺序（阻断性）

实测域间依赖边（`A -> B` 表示 A 的代码 import 了 B）：

```
agent-stack    -> ai-vault, telemetry-stack
ai-vault       -> agent-stack, remote-host, telemetry-stack
artifacts      -> cloud-profiles
automations    -> agent-stack, remote-host
browser        -> agent-stack, remote-host
cloud-profiles -> remote-host
forge-task     -> remote-host, telemetry-stack
remote-host    -> ai-vault, browser, cloud-profiles
skills         -> artifacts, cloud-profiles, telemetry-stack
```

**存在环**：`agent-stack ↔ ai-vault`、`remote-host ↔ ai-vault`、`remote-host ↔ browser`、`ai-vault ↔ remote-host`。

**结论**：这 15 个删除域 + 散件构成**一个强连通分量（SCC）**。因此：

1. **不存在能保持 `pnpm tc` 绿的增量删除顺序** —— 尝试过的每一个「按域切片」都会因为被同簇其它域反向引用而级联（实测：删 artifacts 15 错 → 修不动；删远程集群 264 错 → 再删散件爆到 4543；stub 化后爆到 5169）。
2. **design D-6 的 WAVE 顺序无效** —— 它假设域之间是 DAG。实际是一个 SCC。
3. **Group 5「域清扫」不是收尾工作，而是唯一的删除机制** —— 必须在**一次原子提交**里：删除整个 SCC（约 4,000 文件）+ 同时修完保留侧约 250–300 个引用文件。
4. 这对本仓库的裁剪规模意味着：**这是单一 4000+ 文件的原子变更**，无法用「小步快跑」的方式完成。

**已在本次实施中验证可行的部分**（可复用，不因上述结论作废）：

- 独立于 SCC 的域（star-nag / emulator / updater / plugins / speech / pet / notebook）**可以**按切片删除 —— 已完成 7 个
- F-2 的传输原语提取（4 个文件 → `src/main/hook-relay/`）已验证可行
- 遥测发射端可独立失效（已完成 4.10）
- 依赖清理（4.14 部分）可独立完成

### F-13 平台剥离同样级联：叶子级删除已用尽

尝试 macOS 剥离（Group 10）的孤立部分（`window/macos-*`、`macos-system-sleep-assertion`、`macos-tcc-*`、`macos-press-and-hold-default`、`dock/unread-badge`、`daemon/macos-login-session-death-watch`、`ipc/macos-*`，共 16 个文件）：

| 步骤 | 结果 |
| --- | --- |
| 删除 16 个 macOS 专属文件 | 22 处 TS2307（悬空 import，分布在 18 个文件） |
| 脚本移除悬空 import | 25 处 TS2304（使用点仍在：`deathWatch` 8 处、`handleMacAppActivation`、4 个 ipc/app 注册、`getMacosFullDiskAccessStatus` 等） |

**结论**：macOS 专属模块不是叶子——保留侧文件大量使用它们（`daemon-entry` 的 `MacosLoginSessionDeathWatch`、`index.ts` 的 `MacAppActivation`、`ipc/app.ts` 的键盘布局与 Dock 角标、`developer-permissions` 的 TCC 状态）。因此平台剥离必须与调用点改写同时进行，和 SCC 删除是同一类问题。

**可复用的模式总结（供后续执行者）**：
1. 先按域计算 import 图（`/tmp/opencode/gen-stubs.mjs` 与 `gen-remote-shims.mjs` 里的解析器已修好别名与原始文件表两处 bug）
2. 若目标集自我闭合（无环、且对保留侧的边可穷举）→ 可以切片删
3. 若目标集是 SCC 或对保留侧有大量使用点 → **必须一次原子提交**：删除 + 同时改写全部调用点
4. 每次测量 `pnpm tc` 前先 `rm -f config/*.tsbuildinfo`（F-7）
5. 提交前确认无后台写手（F-8），并跑 `npx oxlint <changed>` 预检 pre-commit


### F-14 叶子剥离法：模块级图正确，但类型消费是隐形的（决定性结论）

**方法**：从叶子向内剥离——一个删除集文件可删当且仅当它的**所有** import 者也在删除集内。这天然正确处理 barrel（F-10），因为保留侧 barrel re-export 会被算作「非删除集 import 者」而阻断。

**结果**（`/tmp/opencode/scc-peel.mjs`，清单见 `docs-slim/cull-scc-peel.md`）：

| 指标 | 值 |
| --- | --- |
| 删除集 | 6,725 |
| 第 1 轮可剥离 | 5,909 |
| 不可约核心 | 816 |
| 引用核心的保留文件 | 2,711 |

**实测**：删除这 5,909 个「安全」文件后 → **1,478 处唯一 `tc` 错误**。

**根因（关键）**：错误不是悬空 import（TS2307），而是**类型退化**：
```
src/cli/linear-format.ts: Property 'capReached' does not exist on type '{}'
src/main/agent-auth-restart-preservation.ts: 'syncForCurrentSelection' is of type 'unknown'
src/main/agent-hooks/first-work-branch-rename.ts: Property 'renameCurrentBranch' does not exist on type 'SshGitProvider'
```
删除一个被保留代码**类型消费**的模块时，如果该类型仍能经由某个残留路径解析（部分 re-export / 同名声明），TS 不会把它降级为 `any`，而是塌缩成 `{}` / `unknown` / `never`，于是每一处成员访问都报错。

**为何模块级 import 图看不见**：保留文件通过 `import type` 消费的是**导出符号**，而剥离算法只看**模块间关系**。一个文件可以「没有保留侧模块 import 它」却仍被大量保留代码依赖其类型。

**结论**：本 cull 需要的是**导出符号级**的依赖分析（哪些类型被保留代码消费），而不是模块级 import 图。这是执行剩余 6,725 文件删除的先决条件；在此之前，任何删除策略（按域、按簇、stub、剥离）都无法收敛——这解释了 F-12、F-10、以及四次失败的共同根因。


### F-15 可达性剥离成功一半；shim 配方实测失败（symbol kind 决定成败）

**成功的部分（F-14 的修正）**：把「叶子」定义从「直接 import 者都在删除集内」改为「**不从任何幸存文件传递可达**」，SCC 删除首次收敛：

| 轮次 | 删除 | 结果 |
| --- | --- | --- |
| 1 | 3,107 文件 | **`pnpm tc` EXIT 0** |
| 2 | 剩余 3,618 全部可达，可删 0 | 达极限 |

失败原因（F-14 的机制）：旧规则会保留「被幸存者 import 的域文件 A」，却删掉 A 自己的依赖 → A 的 re-export 悬空 → TS 不降级为 `any`，而是把其导出类型塌缩成 `{}`/`unknown`/`never`。

**失败的部分（shim）**：对剩余 3,572 个核心中「被幸存者直接导入」的 787 个模块生成 no-op shim（每个符号 = `export type X<...> = any` + `export function X<...>(...)`）+ 删除其余 2,797 个 → **14,500 处错误**。

根因：**符号的种类（kind）不能伪造**。
```
Type '(...) => any' is not assignable to type 'string'      // 消费方要的是字符串常量，不是函数
'"../../shared/artifact-sharing-gate"' has no exported member named
  'ARTIFACT_SHARING_DISABLED_NEXT_STEPS'. Did you mean 'ARTIFACT_SHARING_DISABLED_MESSAGE'?
```
即：const 必须仍是 const（且类型正确）、type 必须仍是 type、enum 必须有成员。用「统一函数」冒充一切符号在 787 个模块 / 2,466 个符号的规模上必然崩溃。

**结论**：剩余 3,618 个可达文件**必须逐个裁定**（保留原文件，或把符号按正确 kind 迁移到 keep 侧），不能靠生成 shim。这一步是人工/长任务的活，规模为 787 个模块 × 2,466 个符号 × 4,582 条 import 语句。

### F-16 剩余工作是可枚举的有限边集：4,459 条直接 import 边（决定性重述）

F-15 把剩余工作描述成「787 模块 × 2,466 符号」并判定为不可枚举。实测**这个结论过悲观**，正确的度量是**边**，不是符号：

**判据的精确化**。可达性从**非删除域文件**出发。因此：

> 删除集整体不可达 ⇔ 不存在任何「非删除域文件 → 删除域文件」的直接边。

即：**不需要逐个裁定符号，只需要切断 4,459 条直接 import 边**。切完这些边，整棵删除域子树一次性失去可达性，剥离算法一次性释放全部剩余文件。上一轮 ai-vault 就是这样收口的（切 15 个文件 → 剥离释放 43 个叶子 → 再切 → 全部释放）。

**当前实测**（`/tmp/opencode/edge-inventory.mjs`，工作单见 `/tmp/opencode/work/`）：

| 指标 | 值 |
| --- | --- |
| 删除集（当前树） | 3,532 |
| 可剥离 | 0 |
| 阻挡剥离的非删除域文件 | 2,669 |
| 需要切断的直接边 | **4,459** |

各域直接边数：`shared` 2,079、`renderer-mirror` 1,049、`agent-stack` 582、`remote-host` 319、`telemetry-stack` 143、`forge-task` 122、`browser` 98、`already-done` 41、`automations` 26。

**分布决定了可并行性**：1,700 个文件只有 1 条边，604 个有 2 条，只有 54 个文件有 6 条以上（最重的 `register-core-handlers.ts` 有 21 条）。即绝大多数是**单点小编辑**，不是架构手术。

**分工方法（避免写冲突）**：按**文件**分片，不按域分片——每个阻挡文件恰有一个所有者，所有者切断该文件内**所有**域的全部边。这样 34 条 lane 互不重叠，可完全并行；域只有在全部阻挡文件的边都断掉后才释放，因此不需要增量剥离，**整波结束后跑一次 peel 即可一次性释放**。

**删除优于掏空**：`main-process-automations.ts`、`runtime-automation-controller.ts`、`ipc/skills.ts`、`renderer/src/store/github/*` 这类文件**本身就是被删域**，只是正则没覆盖到。对它们应当 `git rm` 整删并摘掉其 import/注册行，而不是把功能掏空留壳。实测这类「孤儿特征文件」（import 了删除域、且无非删除域 import 者）有 882 个，其中 813 个是测试（测试天然无 import 者，故不可仅凭此判据删除）。

### F-17 工作单是有保质期的快照，必须在每轮排空后重算（重要）

F-16 把 2,669 个阻挡文件切成 34 条 lane 工作单（`/tmp/opencode/work/lanes/lane-NN.md`），每条列出「文件 → 要切断的边 → 目标」。**但这批工作单在生成的那一刻就开始过期**：别的 lane 在删目标文件，于是后面 lane 的工作单里出现大量已不存在的目标。

实测（20 条 lane 在飞、471 个文件已删时复核 lane 21–34）：

| lane | 指令要切的目标边 | 其中目标已被删除 |
| --- | --- | --- |
| lane-24 | 230 | **128** |
| lane-28 | 153 | 56 |
| lane-26 | 158 | 55 |
| lane-27 | 140 | 51 |
| lane-25 | 142 | 43 |
| lane-23 | 125 | 36 |
| lane-21 | 118 | 35 |
| lane-34 | 66 | 30 |
| 其余 6 条 | — | 20–31 |

**14 条全部过期**（没有一条干净）。后果有两层：轻则 fixer 花时间找不存在的 import；重则它按指令「切断」而顺手删掉别的东西。

**规则**：工作单**不可预生成后长期积压**。每轮必须：

1. 等当前在飞的 lane **全部**终止（这也是 F-8 的提交前提）；
2. 重跑 `edge-inventory.mjs` + `make-lanes.mjs`，从**当前树**重算剩余边与分片；
3. 只派发重算后的前 N 条；重复。

**为什么不能在旧分片上「减去已删项」**：`make-lanes.mjs` 按目录亲和度装箱，剩余文件集一变，装箱结果（以及哪些文件落在同一 lane）就变。手工剔除只会得到一份既不完整、又可能把同一文件同时放进两条 lane 的清单——后者正是写冲突的来源。

**修复成本的量级**：重算是纯静态分析，秒级；派发一份过期工作单的代价是一整条 lane 的时延与上下文。所以宁可在每轮开头多花一次重算。

**并发饱和点**：15 → 20 条 lane 时，实测边切割速率从 ~20.7 边/分回落到 ~7.1 边/分（本机负载仅 5.7/22 核，故瓶颈在 agent 侧的并发配额，不在 CPU）。**20 条以上不再提升吞吐**，应停在 15–20 并靠「排空 → 提交 → 重算」循环推进。

### F-18 删除会跨 lane 制造「无主孤儿」，这是分片法的固有缺口

F-16 的分片依据是「**生成工作单那一刻**该文件是否 import 了删除域」。但 lane 执行的 `git rm` 会**新造出**一批悬空引用：某个文件当时没进任何工作单（它当时不 import 任何删除域），却被**别的 lane 删掉了它 import 的东西**。这类文件此刻编译不过，而**没有任何 lane 拥有它**——于是它既不会被切边，也不会被删除。

实测（lane-07 排空后的自我报告，共 107 处删除）：它撞到并明确留下的无主孤儿约 20 个，集中在
`components/task-page/*`、`use-task-page-*`、`github-item-dialog/*`、`github/pr-check-presentation.ts`、
`pull-request-page/checks/layouts.tsx`、`settings/TaskSourceLinearSetup.tsx`、
`settings/task-tracker-integration-cards.tsx`、`onboarding/IntegrationsStep.tsx`。

更值得注意的是**一条保留侧的传导链**：`TasksPane.tsx`（lane-16 拥有）、`IntegrationsPane.tsx`、
`OnboardingFlow.tsx`、`FeatureWallBody.tsx`、`ConnectIntegrationsList.tsx` 仍 import 上述设置面板；
lane-07 出于「不越界改 lane-16/17/30 的文件」而停手——这是**正确的边界纪律**，但意味着
这条链必须由排空后的收尾来解。

**规则**：不要试图**预测**这批孤儿（预测需要模拟全部 lane 的删除顺序，成本远高于收益）。改为
**让编译器列出它们**：

1. 每轮排空后先跑 `pnpm tc`（清 `config/*.tsbuildinfo`，见 F-7）；
2. `TS2307`（找不到模块）的那批就是无主孤儿清单——**这就是任务 5.x「域清扫」的真正工作单**；
3. 逐个裁定：整删（它的唯一用途就是被删域）或改指向保留侧实现；
4. `TS2307` 清零后再跑 peel，此时释放量才反映真实进展。

**与 F-17 的关系**：F-17 说工作单会过期（目标已被删），F-18 说反方向也会发生（新引用变成悬空）。
两者都指向同一个操作纪律——**一切以「排空后重算 + tc」为准，不以预生成的清单为准**。

**例外规则：保留侧无主消费者存在时，收窄优于删除（lane-11 实测的自我修正）**。

F-16 的「删除优于掏空」有一个必须让位的条件：**当某个文件的唯一用途虽是被删域，但它的导出仍被
保留侧无主文件消费时，整删会制造一个没有所有者能修的悬空引用**。此时正确动作是**保留文件、只删掉
内部指向被删域的代码路径**，让保留的通道返回结构化失败。

实测：lane-11 一开始整删了 `runtime-environment*` 配对运行时簇，随后**恢复 12 个非测试文件并改为收窄**，
理由是多个保留且无主的消费者（`callRuntimeEnvironment` 的调用方、lane-24 的 startup 接线）依赖其导出，
删了没人能修。改法：`runtime-environment-{abortable-requests,connectivity-handlers,diagnostics-broadcast,
pairing-verification,request-connections,shared-control-support,status-owner,support-routing,
tailscale-response,transport-routing}.ts` + `runtime-environments.ts` 去掉被删门面的代码路径，
通道保留契约并返回结构化失败；它们**只测被删传输**的 7 个测试文件删除。

**判据顺序**（多轮实测后固定）：

1. 文件唯一用途是被删域 **且** 无保留侧消费者 → 整删（F-16 默认）。
2. 文件唯一用途是被删域 **但** 有保留侧无主消费者 → 收窄，通道返回结构化失败（本例外）。
3. 文件是保留件 → 只切列出的边（F-16 分片法）。

**派生发现**：`preload/diagnostics-bridge.ts` 属边界情形——被保留、主进程侧 handler 已删、
**且没有任何保留侧 renderer 调用它**，既无消费者也非域成员。这类「双向悬空」的保留件交给
`knip` / `check:dead-classes` 判死，不要凭手感删。

### F-20 跨 lane 并发写会**静默覆盖**，覆盖后的残留 `tc` 不一定报错（须显式扫描）

F-16 假设「按文件分片 + 允许少数越界编辑」是安全的，因为越界冲突会被 `tc` 抓到。**这个假设只对了一半。**

实测（lane-01 主动上报）：它删除了 `rpc/methods/index.ts` 里的 `NOTIFICATION_METHODS` 注册，
**被并发的另一条 lane 覆盖回去，它只好重做一遍**。

**为什么 `tc` 抓不到**：若被覆盖回来的是「**少删了一处**」——即 keep 侧仍注册着一个已删域的 handler——
代码依然自洽、**可以编译**。`tc` 只看类型是否成立，不看「是否还有已删域的痕迹」。于是这类覆盖的产物是
**残留逻辑**，恰好命中目标里最难验的一条：「无残留删除域逻辑」。

**实测复核（决策中途抽查 keep 侧）**：`orchestrationMailbox` 命中 6 个文件、`RelayRevokeOutbox` 4 个、
`relayBinding` 2 个——其中数处位于 `src/main/runtime/runtime-rpc/` 与 `runtime/relay/`（remote-host 域内，
属正常待删），但**该计数无法区分「域内待删」与「keep 侧残留」**，这正是必须逐项裁定的原因。

**规则**：不能把「lane 报告完成」当作完成，也不能把「`tc` 绿」当作无残留。排空后必须**独立跑一次残留扫描**，
判据是可执行计数而非肉眼：

1. 每个删除域取一组特征标识符（模块路径前缀 + 关键导出名 + 关键常量名）；
2. 在 **keep 侧文件**里 `rg`，要求计数为 0，或每一项都有书面裁定（含「留在域内待删」的分类）；
3. 这就是任务 5.4 / 6.1 验证要求的**字面执行**——它的存在不是形式，而是因为本缺陷已被实测。

**特征标识符起始清单**（由各 lane 的残留上报汇总，可直接作为扫描输入）：

| 标识符 | 来源 / 含义 |
| --- | --- |
| `NOTIFICATION_METHODS` | lane-01：被覆盖回的 `rpc/methods/index.ts` 注册 |
| `relayBinding` / `RelayRevokeOutbox` | lane-01：pairing/relay 面残留 |
| `orchestrationMailbox` | lane-01/02：结构化编排邮槽字段 |
| `structuredStopped` | lane-03 删除的 worktree-teardown 结果字段 |
| `remoteUpdateSupport` / `remoteControl` | lane-13 从 `RuntimeStatus` 删掉的字段 |
| `sshStateChanged` / `sshStates` | lane-13 从 `runtime-client-events` 删掉的快照 |
| `orchestrationCompatibilityEvidence` | lane-13 从 `runtime-rpc-envelope` 删掉的字段 |
| `linearContext` / `prState` | lane-13 从 `ui-chrome-types` / source-control 决策类型删掉的字段 |
| `hookSettings` / `upstream` / `ghAccount` | lane-13 从 `project-types` / `repo-types` 删掉的字段 |
| `launchSource` | lane-05：为 ~50 个调用点保留的惰性可选字段（待本轮排空后判死） |
| `SshMutationExpectation` | lane-13 从 `runtime-upload-staging-contract` 去掉的交叉类型 |
| `setAutomationService` | lane-01/02：已删的 automation 注入点 |

**注意**：命中**不等于**残留——域内文件（如 `runtime/relay/`、`runtime/runtime-rpc/`）命中是正常的（它们本身待删）。
判据是「命中该项的**保留侧**文件数为 0」，这才是任务 5.4 要求的「计数归零」。

**附带教训**：越界编辑越少越好。lane-01 的越界清单（`rpc/methods/index.ts`、`main-process-*.ts`、
`orca-runtime-core.ts` 等 20 余处）本身就是覆盖风险的来源。下一轮应把**装配总线文件**
（`rpc/methods/index.ts`、`register-core-handlers.ts`、`startup/main-process-*`）**整体收进单独一条 lane**
独占，而不是让多条 lane 各自越界改同一批文件。

### F-19 同一符号被多条 lane 各自迁移 ⇒ 产生并行副本，必须有一次合并

F-15 规定「被保留代码消费的删除域符号要按正确 kind 迁到 keep 侧，不能 stub」。这条在并行执行下有个副作用：
**若两条 lane 都要迁同一个符号，它们会各自造一份副本**——彼此看不见，且都通过各自的 lint / import 扫描。

实测（lane-10 主动上报）：

- lane-10 新建 `src/renderer/src/store/slices/ssh-host-state-contracts.ts`（迁移 `SshConnectionState` 等）、
  `runtime-environment-rpc-call.ts`（迁移 `RuntimeClientTarget` + `getActiveRuntimeTarget`）、
  `runtime-host-connection-state.ts`、`runtime-status-response-fixture.ts`；
- 而 `ssh-types` / `runtime-client-target` / `runtime-host-connection-state` 这三个被删文件**同样被别的 lane 迁过**，
  于是 keep 侧可能存在 2–4 份语义相同的副本。

**为什么必须收口**：这不是「暂时重复」的小瑕疵——目标要求「**无残留删除域逻辑**」，同一契约的多份副本
既是逻辑重复，也是后续分叉的种子（改一份漏一份就是行为 bug）。它同时会被 `knip` /
`check:dead-classes` 之类的一致性门禁盯上（未被引用的副本算死代码）。

**规则**：

1. 排空后对「新增的 keep 侧模块」做一次归并扫描：按导出符号名聚类，找出语义重复的多份实现；
2. 每组合并成一份，放在**语义所属目录**（不是「谁先建谁留」），其余 lane 的引用改指向它；
3. 合并与新模块的落点一并计入 6.1（装配总线收尾），因为它们跨 lane；
4. lane 上报里凡出现「我新建了迁移模块 X」，都必须进这份待归并清单——**lane 自己无法发现别人的副本**。

**首选做法（lane-17 实测）**：迁移之前先找**已存在的保留侧定义**，能改指向就改指向，不要新建副本。
lane-17 把 `getActiveRuntimeTarget` 改指回存活的 `@/runtime/runtime-client-target`、把
`getRuntimeGitStatus` 改指回存活的 `@/runtime/runtime-git-status-client`、把
`CheckStatus` 改指 `HostedReviewInfo['status']`——**零新增模块**，因此不产生 F-19 的合并债。
lane-10 的情况不同：它要的符号（`SshConnectionState` 等）确实只存在于被删文件里，新建才是对的。
**判据**：先在保留侧按导出符号名搜一遍；搜到就改指向，搜不到才迁。这条顺序能显著缩小第 4 步的清单。

**待归并清单（持续追加，`tc` 看不见这些）**：

| lane | 新建的迁移模块 |
| --- | --- |
| 10 | `store/slices/ssh-host-state-contracts.ts`、`store/slices/runtime-environment-rpc-call.ts`、`store/slices/runtime-host-connection-state.ts`、`store/slices/runtime-status-response-fixture.ts` |
| 15 | `codex/codex-atomic-file-writes.ts`、`codex/codex-journal-payload-bounds.ts`、`codex/codex-probe-termination.ts` |
| 3 | `window/renderer-recovery-loop-guard.ts`（非迁移，是拆分出来的保留件——注明以免误合） |
| 14 | `main/hook-relay/{ssh-channel-multiplexer,ssh-multiplexer-transport-writer,ssh-multiplexer-writer-lane-scheduler,relay-protocol}.ts`（F-2 的落地：把 SSH 传输原语从被删 `ssh/` 抽出，供 WSL hook relay 复用）、`shared/agent-tool-summary.ts`（原 `native-chat/native-chat-tool-summary.ts`）、`shared/agent-subagent-summary.ts` |
| 8 | `right-sidebar/checks-panel/task-source-summary-types.ts`（结构性替代类型，为免 max-lines 而拆；另把 `PanelComment` 定义为 `Extract<PRCommentGroup,{kind:'thread'}>['root']` 骑在 lane-12 的模块上——须与 lane-12 的 re-type 合并核对） |
| 16 | `main/codex/wsl-codex-command.ts`、`settings/runtime-host-access-link.ts`（均从被删设置/命令构建器移出）。**正向信号**：它没有复制 lane-15 的 `codex-atomic-file-writes.ts`，而是**从该模块导出既有的 `renameFileWithWindowsRetry` 复用**——即 F-19 的「先找既有定义再迁」判据在跨 lane 场景下被正确执行，这类项**不进待归并清单** |
| 12 | `shared/{native-chat-blocks,agent-session-option-descriptors,repo-hook-settings,pr-review-data-types}.ts`（逐字形状迁移，带出处注释）。**附带待裁定项**：`persisted-state-types.ts` 保留了遗留的 `githubCache` 字段（forge 域遗留），载荷降级为 `data: unknown`，理由是保留侧无人读其字段、持久化只当不透明 sidecar。**裁定**：它属「残留删除域逻辑」的边界情形——若收尾时判定要整删该字段，须同时确认旧状态的向前兼容（忽略未知字段而非拒绝载入，见 `specs/multi-project-workspaces` 的「旧版本状态仍可载入」）|

lane-17 未新建任何模块（全部改指向），lane-02/03/07/13/20 亦然 —— 即 8 条已排空的 lane 里只有 2 条产生
了迁移副本，规模可控。

**不要抄各 lane 的「悬空引用」清单进文档**：`tc` 的 `TS2307` 会给出**权威并集**（F-18 的规则）。
文档只需记 `tc` 看不见的东西——迁移副本（上表）、以及下面这类**故意收窄**：
lane-13 的 `provider-check-summary.ts` / `setup-script-telemetry.ts`、lane-17 的 6 处改指向
（`runtime-client-target`、`runtime-git-status-client`、`HostedReviewInfo`、`tui-agent-startup`、`window.api.gh`）、
lane-01 保留的 `requireRuntimeGitProvider` null-is-local 契约、lane-03 的 renderer-recovery 崩溃循环守卫。

**其中一条要特别判过再收口（lane-04）**：`store/slices/ui/ui-slice-agent-actions.ts` 的
`sendPromptToSidebarAgentTarget` 被改成**失败关闭**（返回 `false`），因为它原本经被删的 mirror 投递提示。

这条**不是回归，而是与 spec 对齐**：`specs/agent-launch-status/spec.md` 明确要求
「系统 SHALL NOT 向 agent 会话投递提示、审批、回答或附件」。因此「保留的 UI 动作改为失败关闭」
是契约要求的正确行为，**不得**在收尾时被误判为「保留功能行为改变」而回退。

**收尾判据补充**：对每个「故意收窄」项，都要回答一个问题——**它是否让某条 spec 的 SHALL NOT 变得更真？**
是 → 保留并记为合规；否 → 记为待修的行为差异。
这些都必须进 6.1，因为编译器不会提醒它们「还欠一次判断」。

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
