# Orca 功能树

> 仓库：`stablyai/orca`（本工作区 `orca-slim`）· 版本 `1.4.197` · MIT
> 产品：面向并行 agentic 开发的桌面 IDE。一个任务一个 git worktree，每个 worktree 里可跑任意 CLI 编码代理，并配独立的终端、编辑器、浏览器与移动端遥控。
> 层级：本文件最深 5 层（域 → 功能组 → 功能 → 子功能 → 能力点）。

## 组成

| 构件 | 位置 | 说明 |
| --- | --- | --- |
| 桌面端 | `src/main` `src/preload` `src/renderer` | Electron 43 + React 19，主进程 / 桥接层 / 渲染层 |
| Orca CLI | `src/cli` | 代理与脚本驱动 Orca 的命令行入口 |
| 主机中继 | `src/relay` | 远程执行宿主上的守护进程 |
| 云后端 | `cloud/` | 移动端配对中继与推送网关 |
| 移动伴侣 | `mobile/` | React Native / Expo 应用 |
| 捆绑技能 | `skills/` `skill-guides/` | 随包分发的代理技能 |

---

## 1. 工作区与 Worktree

- **Worktree 生命周期** — `src/main/worktree-create-*.ts`
  - 创建
    - 后台创建池与 base ref 预取
    - 指定 base ref / 父 worktree（父子谱系追踪）
    - 创建时直接启动代理
    - 从 Linear 工单或 GitHub issue 建区
    - 共享目录注入（`orca.yaml`、`.worktreeinclude`）
  - 命名与分支
    - 智能命名与冲突重试
    - emoji 工作区名
  - 切换与检索
    - Cmd-J worktree 跳转面板
    - 侧栏卡片与看板视图
  - 删除与回收
    - 安全删除、家目录守卫
    - 孤儿清理与血缘回收
    - 保留分支
- **项目与仓库**
  - 添加仓库：克隆 / 新建 / 远程 / 嵌套导入
  - 项目分组与手动排序 — `src/main/project-groups/`
  - 文件夹工作区（非 git 目录） — `src/shared/folder-workspaces.ts`
  - 稀疏检出与可见性控制
- **资源管理**
  - 磁盘空间分析（本地 / 远程双扫描） — `src/main/workspace-space-analysis.ts`
  - 工作区清理与快照剪枝 — `src/shared/workspace-cleanup.ts`

## 2. 终端与 Shell

- **终端会话**
  - PTY 管理 — `src/main/pty/`
    - 启动握手与查询回复
    - 存活判定与退役账本
  - 终端守护进程 — `src/main/daemon/`
    - 跨重启会话保活
    - 历史冷恢复与检查点
  - 多 Shell 集成
    - zsh / fish / PowerShell / CMD / WSL 包装
    - 提示符就绪探测、OSC 133 引导
    - fish / zsh 历史同步
  - 历史与滚动缓冲
    - 滚动缓冲落盘与快照 — `src/main/terminal-scrollback-snapshots.ts`
    - 缓冲搜索与 Copy Context 有界转录
- **终端界面** — `src/renderer/src/components/terminal-pane/`
  - 标签、标签组与分屏（拖拽停靠、常驻窗格）
  - 面板内搜索、右键菜单、恢复横幅
  - 浮动终端（全局快捷键、编排对话框）
  - 终端外观：主题库、Ghostty / Warp 导入、自定义字体
- **终端能力**
  - WebGL 渲染与 kitty 键盘协议
  - OSC 52 剪贴板、链接操作弹层
  - 代理标签身份与实时状态显示
  - 进程树清理（Windows / MSYS 场景）

## 3. 编码代理协作

- **代理接入** — `src/main/agent-launch/`
  - 任意 CLI 代理；30+ 预配置方言（Claude Code、Codex、Cursor、Gemini、Grok、OpenCode、Pi、Droid、Kimi、Qwen、ZCode、Antigravity 等）
  - 启动脚本与提示注入
  - 权限默认：Yolo 绕过旗标 vs Manual，可按代理覆盖
  - 代理信任预设
- **Agent 状态与身份**
  - Hook 服务器状态存储 — `src/main/agent-hooks/`
  - 面板身份与属主解析 — `src/shared/pane-agent-identity-resolver.ts`
  - 首次工作自动改名
- **原生 Chat** — `src/renderer/src/components/native-chat/`
  - Composer：附件、目标芯片、上下文用量环
  - 交互卡片：审批、提问、diff、后台任务
  - 结构化会话投影 — `src/shared/structured-agent-session-reducer.ts`
- **会话与历史**
  - AI Vault 会话库（搜索、恢复聊天、子代理展开） — `src/main/ai-vault/`
  - 会话接续与重启恢复
  - 休眠与唤醒（空闲窗口调参）
- **编排与自动化**
  - 多代理编排：dispatch / worker / 决策门 / 舰队调度 — `src/shared/orchestration-rpc-contract.ts`
  - 定时自动化：cron、运行主机选择、missed-run 宽限 — `src/main/automations/`
  - 代理会话全文检索
- **账号与用量**
  - 账号热切（Claude / Codex）与密钥库
  - 用量与限速统计、估算成本 — `src/main/usage/`
  - 防休眠（caffeinate）
- **技能与插件**
  - 技能安装 / 更新 / 私有分享 — `src/main/skills/`
  - 插件宿主与目录（实验） — `src/main/plugins/`

## 4. 编辑、文件与源码控制

- **编辑器** — `src/renderer/src/components/editor/`
  - Monaco 多标签、自动保存、多光标、变更视图
  - Markdown 富文本编辑与预览（slash 菜单、内链、TOC）
  - 查看器：ipynb、CSV、图片、PDF、HTML、Mermaid
  - 外部改动检测与对比
- **文件浏览**
  - 文件树：新建 / 重命名 / 删除 / 拖拽移动 / 监视刷新
  - 内容搜索（ripgrep） — `src/main/ripgrep/`
  - Quick Open（Cmd+P） — `src/shared/quick-open-filter.ts`
  - 远程文件浏览器（SSH / 远程下载）
- **差异审查**
  - Diff 查看器：组合差异、大文件分节降级 — `src/renderer/src/components/editor/combined-diff/`
  - 行内评论与批量发送给代理 — `src/renderer/src/components/diff-comments/`
  - 冲突审查
  - Attribution：AI / 人工代码归属
- **源码控制** — `src/main/source-control/`
  - 暂存 / 提交 / 推送，AI 提交信息生成
  - Git 操作层：状态、历史、分支、worktree、submodule，含二进制版本兼容回退 — `src/main/git/`
  - 托管评审创建：PR / MR、PR 栈
  - Checks 面板与 CI 状态
  - Git 提供商：GitHub、GitLab、Bitbucket、Gitea、Azure DevOps

## 5. 任务与评审集成

- **任务页框架** — `src/renderer/src/components/task-page/`
  - 统一来源栏：GitHub / GitLab / Jira / Linear
- **GitHub** — `task-page/github/`
  - Issue 与 PR 列表、筛选、Projects 表
  - Actions 与 Tasks
- **GitLab** — `task-page/gitlab/`
  - MR 与待办列表、流水线状态
- **Jira** — `src/renderer/src/components/JiraIssueWorkspace.tsx`
  - 问题工作区、排序、用户选择、ADF 创建
- **Linear** — `task-page/linear/`
  - 看板 / 表格、自定义视图、属性筛选、富编辑
  - CLI 读写双向
- **评审页面** — `src/renderer/src/components/pull-request-page/`
  - 多标签审查：文件 / 对话 / 检查 / 评论 / 审查者

## 6. 浏览器与设计验证

- **内置浏览器** — `src/main/browser/`
  - 每 worktree 浏览器：标签、导航、下载管理
  - 浏览器 profile：身份、cookie 导入、隔离
  - 视口模拟、链接路由、localhost 标签代理
  - 分享为 artifact
- **代理浏览器桥**
  - snapshot / click / fill / type / screenshot 等指令
  - 鼠标键盘事件与页面状态读取
- **Design Mode 标注** — `src/renderer/src/components/browser-pane/annotate/`
  - 涂抹标注、元素抓取、HTML/CSS/截图入 prompt
- **Computer Use 桌面控制** — `src/main/computer/` `native/computer-use-*`
  - 权限校验、动作验证、多窗口应用
- **安卓模拟器** — `src/main/emulator/`
  - 设备画面、手势、实体键、日志、Agent 控制向导
- **端口侦测** — `src/main/ports/`

## 7. 远程执行与多主机

- **执行主机抽象** — `src/shared/execution-host.ts`
  - 本地 / WSL / SSH / 中继统一分派
  - 按主机分区的状态与能力缓存
- **SSH** — `src/main/ssh/`
  - 主机接入：host key 验证、passphrase、Kerberos/GSSAPI、FIDO2
  - PTY 租约与断线重挂
  - 远端 orcad 部署与 GC
  - 端口转发、跨应用关闭保活
- **WSL** — `src/main/wsl/`
  - 发行版探测与 UNC 删除
  - hook / 浏览器 / 网络桥接
- **Remote Orca Server**
  - headless `orca serve`、Tailscale 访问
  - 配对与安全、移动端接无头服务器
- **临时虚拟机**
  - 每工作区一次性环境配方 provision 与回滚
- **远程运行时协议** — `src/shared/remote-runtime-*.ts`
  - WebSocket RPC 与订阅流
  - 端到端加密、断线续传

## 8. Orca CLI

- **核心与运行时** — `src/cli/specs/core.ts`
  - `open` / `status`：启动并等待运行时可达
  - `serve`：无窗口启动运行时服务器
  - `claude-teams`、`agent-context`、`search`、`diagnostics memory`
- **仓库与项目**
  - `repo`：list / add / show / set-base-ref / search-refs
  - `project`：setup-clone / setup-create / setup-update / setup-delete 等
- **Worktree 生命周期**
  - list / show / current / create / set / rm / ps
- **终端控制**
  - list / show / read / send / wait / create / switch / rename / split / close
- **文件与产物**
  - `file`：open / diff / open-changed
  - `artifacts`：share / update / unshare / list / delete
- **编排 orchestration** — `src/cli/specs/orchestration.ts`
  - run、消息（send / check / reply / inbox / ask）、task
  - dispatch、gate-create / gate-resolve、worker 生命周期
- **浏览器自动化**
  - 页面操作：open-url / snapshot / screenshot / click / fill / type / scroll / eval / wait / drag / upload / pdf
  - 标签与身份：identity、tab 增删改切、profile 克隆
  - 高级：cookie / viewport / geolocation / intercept / console / network / mouse / clipboard / dialog / storage
- **Computer Use 与模拟器**
  - `computer`：capabilities / list-apps / permissions / click / type-text / hotkey / set-value
  - `emulator`：attach / tap / type / gesture / install / launch / logcat / kill
- **Linear 工单**
  - 读取：issue / search / list / team / project
  - 写入：create / attach / status / assignee / priority / comment / relation
- **定时自动化**
  - list / show / create / edit / remove / run / runs
- **宿主与环境**
  - `host`：name / list
  - `environment`：add / list / show / rm
  - `vm recipe doctor`
- **技能、账号与钩子**
  - `skills`：installed / share / list / get / install / update
  - `account`：add / list
  - `agent hooks`：prepare-codex / status / on / off

## 9. 移动伴侣与云服务

- **移动 App** — `mobile/`
  - 配对与连接：扫码 / 链接配对、E2EE RPC、连接日志、故障排查
  - 首页与宿主：主机列表、任务卡、用量卡、恢复卡、worktree 目录
  - 会话与终端：实时 PTY 流、手势与外接键输入、草稿恢复、steering
  - 审查与源码控制：git 状态 / 提交、diff 逐行评论、PR 创建、CI 检查
  - 浏览器镜像：投屏帧与触摸 / 指针控制
  - 文件与任务：文件树与预览、Linear / GitHub Projects 任务面板、创建工作区
  - 代理历史：按 worktree 查看并续跑
  - 通知：推送授权、投递偏好、横幅快捷回复
  - 设置与语音：浏览器 / 终端 / 聊天设置、账号统计、语音听写
- **云后端** — `cloud/`
  - 中继服务 — `cloud/apps/relay/`
    - director / cell 双角色，配对并转发帧
    - 宿主会话注册、凭据存储、分配调度
    - 区域迁移（rehome）与纠偏、容量准入
  - 线协议契约 — `cloud/packages/relay-contract/`
    - 帧格式、关闭码、splice 状态机、续传确认
  - 推送网关 — `cloud/apps/push/`
    - X25519 挑战应答、APNs / FCM 令牌注册
    - 持久队列、配额限速、失效令牌退役
  - 运维基建
    - relay-fence-broker（变更租约）
    - relay-ops 控制台与巡检
    - postgres-schema、Terraform（GCE cell、DNS、IAM、可观测性）

## 10. 应用外壳、设置与运维

- **外壳与系统集成**
  - 窗口与菜单、托盘与 Dock — `src/main/window/` `src/main/menu/`
  - 快捷键引擎与原生键位 — `src/main/keybindings/`
  - 系统通知、电源生命周期、macOS 权限引导
  - 外部编辑器打开（VS Code / JetBrains）
  - 多 Profile 隔离与云端账号 PKCE 认证
  - 主题与字体、语音转写、Notebook 内核
- **设置中心** — `src/renderer/src/components/settings/`
  - 通用 / 外观 / 编辑 / 终端 / 输入法
  - Agent 与账户：目录、默认值、Claude / Codex 切换
  - 集成：Git 提供商令牌、任务源、Browser / Computer Use
  - 远程：SSH 主机、运行环境、临时 VM、移动与模拟器
  - 高级 / 实验 / 开发者 / DevTools / 语音 / 自动化 / 产物
  - 全局设置搜索
- **状态栏**
  - 账号切换（Claude / Codex）
  - 用量统计与图表页
  - 资源占用与端口段
  - 连接、更新、技能更新提示
  - 防休眠状态
- **会话持久化**
  - 状态存储与恢复，按主机分区 — `src/main/persistence.ts`
  - 工作区会话模式：标签 / 滚动缓冲 / 浏览器历史落盘
  - 密钥保护与耐久写入、崩溃修复
- **更新与诊断**
  - 自动更新：多渠道构建、预发布回退、退出看门狗
  - 遥测与同意管理 — `src/main/telemetry/`
  - 崩溃报告、hang watchdog、内存观测
  - 诊断日志与报障
- **引导与通知**
  - 通知卡栈与未读状态
  - 新手引导、设置向导、功能墙、情境导览
  - 多语言（6 种）
  - 反馈提交与星标提醒

## 11. 捆绑代理技能

- **技能正文** — `skills/<name>/SKILL.md`
  - `orca-cli`：操作 worktree / 终端 / 仓库 / 自动化 / 产物
  - `orchestration`：编排受监督 worker，线程消息与阻塞 ask / reply
  - `computer-use`：经 `orca computer` 驱动本机 GUI
  - `orca-linear` / `linear-tickets`：处理已关联工单
  - `orca-emulator` / `orca-emulator-android`：模拟器与真机控制
  - `orca-per-workspace-env`：每工作区环境配方
- **版本化指南** — `skill-guides/`
  - 与 CLI 版本匹配的 Markdown，部分含 `references/`
- **存根** — `skill-stubs/`
  - 轻量入口，共享 `_shared/cli-resolution.md`

---

## 说明

**文档与代码的对照**：`docs/site/content/docs` 的导航结构与上面的域基本一一对应（worktrees / tabs-panes-splits / agents-sessions / terminal / editing / browser / review / ssh / cli / mobile / notifications / settings / telemetry）。抽查文档提到的特性（Kerberos、FIDO2、Ghostty 导入、JIS 键、Voice、Plugins、Floating Workspace、MCP）都能在 `src/main` 或 `src/renderer` 找到实现或测试，未发现只有文档没有代码的功能。

**树中做了合并的地方**：

1. 20+ 个具体 agent 方言目录（amp、antigravity、devin、droid、kimi、mimo、muse、pi、zcode、copilot 等）合并为「多 Agent CLI 启动」。
2. 终端协议兼容细节（kitty keyboard、DA 查询回复、Sixel / iTerm 图片协议）合并为「终端能力」。
3. 持久化的抢救路径（salvage、tombstone、fencing、迁移测试群）合并为「状态存储与恢复」。
4. 发布渠道、构建缓存等 updater 供应链细节合并为「自动更新」。
5. 云后端的数据库迁移、准入预算等运维实现文件合并为「分配调度」。
6. CLI 的全局 flags（`--json`、宿主选择器）未逐条列出，见 `src/cli/flags.ts`。
7. 彩蛋类功能（桌面宠物 Pet、海洋生物命名生成器）未单列。

**证据来源**：`src/main`、`src/preload`、`src/shared`、`src/types`、`src/renderer/src`、`src/cli/specs`、`src/relay`、`cloud/`、`mobile/`、`skills/`、`docs/site/content/docs`。
