# Cull Baseline

> 任务 1.2 / 1.3 的记录。裁剪开始前的仓库状态与门禁结果。
> 分支 `cull/local-ide` · 回滚 tag `pre-cull`（指向 `da6d483ab9aa`，与 `main` 的 HEAD 相同）。

## 环境

| 项 | 值 |
| --- | --- |
| 起始分支 | `main` @ `da6d483ab` |
| 回滚 tag | `pre-cull` → `da6d483ab9aa` |
| 裁剪分支 | `cull/local-ide` |
| `node_modules` | **起始时不存在**，用 `pnpm install --frozen-lockfile` 安装（1m11s，2 个 workspace 项目） |
| pnpm | 12.0.0 |
| node | 24.15.0 |

## 规模（任务 1.3）

| 指标 | 数值 |
| --- | --- |
| `git ls-files` | 29,929 |
| `src/` 下 `.ts` + `.tsx` | 23,385 |
| 全部被跟踪的 `.ts` + `.tsx` | 26,970 |
| 测试文件（`*.test.ts(x)`） | 10,562 |

与 `proposal.md` 的量级对照：proposal 估「约 7,400 删除 / 约 9,100 保留」（非测试）。可达性普查（`docs-slim/cull-census.md`）实测：

- 保留域可达文件 **6,990**（22 个保留根，遍历时不进入删除域）
- 总扫描 22,687（`src/main` + `src/renderer/src` + `src/shared` + `src/preload`）

偏差说明：可达数 6,990 低于 proposal 的 9,100，差额主要是「不可达的保留域文件」——它们既不在删除域，也无法从保留入口到达（孤儿，或只被测试引用）。这部分需要在对应切片里逐个裁定，不能按「保留」直接放行。

## 门禁基线（任务 1.2）

| 命令 | 结果 | 备注 |
| --- | --- | --- |
| `pnpm tc` | **EXIT 0** | 成功时静默（`run-typecheck-projects-in-parallel.mjs` 无输出） |
| `pnpm lint` | **EXIT 0** | 含 ratchet、rpc-params-catalog、localization、anti-slop、react-doctor 等全链 |
| `pnpm test` | **非绿** | 见「测试基线」一节；跑 25 分钟未完成，已观察到 41 处失败 / 20+ 文件 |
| `pnpm build:win` | 未跑 | 本机为 Linux，Windows 目标可能需 wine |
| `pnpm build:linux` | 未跑 | — |

### `pnpm lint` 基线中的门禁事实

- `max-lines` ratchet：7 个祖父级 suppression，无新增
- `ts-nocheck` ratchet：166 个祖父级文件，无新增
- `runtime-electron` ratchet：0 条目
- `verify:rpc-params-catalog`：**属 `pnpm lint`**，且 `rpc-contract` 是删除域 → 该门禁必须随删除一起移除（见 `cull-census.md` 2.2）
- localization：en.json 14,733 条目，es 缺 2,405，其余语言 0 缺；`en-runtime-required.json` 覆盖 1,693 条

## 测试基线（关键）

`pnpm test` 在**裁剪开始前**就不是绿的。25 分钟未跑完，已观察到 41 处失败，分布在 20+ 测试文件。

**落在保留域的失败**（这些是真正的基线债务，裁剪不会消除）：

- `src/main/daemon/history-manager.test.ts`
- `src/main/daemon/pty-subprocess-wsl-launch.test.ts`
- `src/main/git/worktree-create-preparation-real-git.test.ts`
- `src/main/providers/local-pty-provider-windows-shell-launch.test.ts`
- `src/main/providers/local-pty-shell-ready-wrapper-generation.test.ts`
- `src/main/pty/omp-shell-wrapper.node-pty.test.ts`
- `src/main/startup/configure-process.test.ts`
- `src/renderer/src/components/settings/SessionHistorySettingsPane.test.ts`
- `src/renderer/src/components/terminal-pane/pty-connection-pty-exit-teardown.test.ts`

**落在删除域的失败**（随切片消失，不构成问题）：`src/cli/handlers/agent-hooks`、`src/main/browser/*.electron`、`src/main/pi/*`、`src/main/runtime/rpc/*`、`src/main/ssh/ssh-g-config-resolution`、`src/relay/git-handler-*`、`src/shared/remote-runtime-*`。

**性质判断**：失败集中在 PTY / native 模块 / 真实 git / 时序敏感用例，且部分用例单跑耗时 30–42 秒（`pty-connection-pty-exit-teardown`），符合「容器环境无真实 PTY + 高并发负载」的特征，而非逻辑回归。

**对目标的影响**：目标里的验证要求「`pnpm test` 全绿」在本环境**不可达**。可行的替代是：

1. 用「失败集合不扩大」作为回归信号——记录基线失败集合，每个切片只要求不新增失败
2. 把 PTY/native 类用例标注为环境依赖，在 CI（有真实 PTY 的 runner）上验证
3. 保留域冒烟以定向测试 + headless e2e 为准，不以全量 `pnpm test` 为门禁

## 任务 2.4 的发现（省工作）

`src/main/persistence/profile-state-cutover-fixture.ts` + `.test.ts` **已经在做 2.4 要的事**：构造跨域状态（ssh 会话、automations、`linkedPR`、`opencodeSessionCookie`），并断言未知顶层字段 `futureTopLevelExtension` 在 round-trip 后仍存在。

所以 2.4 是**改造**而非新建：等 Group 4/7 删掉 `listAutomations()` / ssh 访问器后，把该 fixture 从「断言删除域状态可读」改成「断言含已移除域字段的旧状态仍可载入」，且必须与删除域切片在同一 commit 内完成。

## 基线结论

- `pnpm tc` 与 `pnpm lint` 起始即绿，可作为每个切片的强回归信号。
- `pnpm test` **起始即非绿**，只能作为「失败集合不扩大」的弱信号；目标中「test 全绿」的验收标准需要重新定义。
- `pnpm build:win` / `build:linux` 尚未取得基线，且本机为 Linux，Windows 目标存在工具链风险。
- 完整跑完 `pnpm test` 需要更安静的环境（25 分钟未完成）。
