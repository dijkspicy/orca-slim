# Orca 功能树（裁剪后）

> 仓库：`stablyai/orca`（本工作区 `orca-slim`）· MIT
> 产品：**本地 IDE**。一个工作区一个 git worktree（或一个文件夹），每个工作区里可跑终端与任意 CLI 编码代理；
> 提供本地 Git 工作流、文件管理与编辑、WSL 发行版执行，以及 agent 的启动与状态指示。
> 目标平台：**Windows + Linux**（macOS 已全部剥离）。
> 本文件只描述裁剪后的 6 个能力域，最深 5 层（域 → 功能组 → 功能 → 子功能 → 能力点）。
> 事实来源：`openspec/changes/cull-to-local-ide/specs/` 的 6 个能力 spec，以及 `src/main`、`src/preload`、`src/shared`、`src/renderer/src` 中保留的实现。

## 组成

| 构件 | 位置 | 说明 |
| --- | --- | --- |
| 桌面端 | `src/main` `src/preload` `src/renderer` | Electron + React，主进程 / 桥接层 / 渲染层 |

裁剪后不再包含：`src/cli`、`src/relay`、`cloud/`、`mobile/`、`skills/` `skill-guides/` `skill-stubs/`、
内置浏览器、托管平台集成（GitHub / GitLab / Jira / Linear）、SSH 与远程执行主机、账号与用量、
编排与定时自动化、遥测与崩溃上报、自动更新、设备模拟器、macOS 专有件。

---

## 1. 工作区与多项目

> 契约：`specs/multi-project-workspaces/spec.md`

- **多仓库注册** — `src/main/ipc/repos/`
  - 添加仓库：克隆 / 新建 / 以现有文件夹接入
  - 同一界面并列呈现多个仓库，移除登记不删磁盘目录
- **文件夹工作区** — `src/main/folder-upgrade-worktree-path.ts`
  - 非 Git 目录登记为工作区，提供终端与文件访问
  - 非 Git 工作区不显示源控制操作
- **项目分组与排序** — `src/main/project-groups/`
  - 分组、手动排序，重启后保持
- **磁盘空间分析** — `src/main/workspace-space-analysis.ts`
  - 按工作区列出占用
  - 选择工作区执行清理
- **本地多项目状态持久化** — `src/main/persistence/`
  - 仓库 / 分组 / 文件夹工作区 / 元数据的重启恢复
  - 裁剪前旧状态仍可载入：未知字段被忽略而非拒绝启动
- **主机范围限于本地与 WSL**
  - 可选执行位置只有本地主机与 WSL 发行版
  - 不登记远程、配对 runtime 或临时虚拟机

## 2. 本地 Git 与 Worktree

> 契约：`specs/local-git/spec.md`

- **仓库状态与暂存** — `src/main/source-control/`
  - 按已暂存 / 未暂存 / 未跟踪 / 冲突分组列出变更
  - 单文件暂存与取消暂存
  - 冲突文件标记，且不计入可直接提交集合
- **提交与推送**
  - 用户手写提交信息创建提交
  - 离线环境仍可创建本地提交
  - 推送被拒时报告原因且不丢失本地提交
- **Worktree 生命周期** — `src/main/git/`
  - 创建：指定基线引用，独立工作目录与分支，共享同一仓库
  - 列出 / 切换：侧栏卡片与 worktree 跳转面板
  - 删除：含未提交改动时要求确认，安全删除与家目录守卫
- **差异评审** — `src/renderer/src/components/editor/combined-diff/`
  - 工作区改动、单提交、分支之间的逐行差异
  - 按文件导航；超预算文件分节加载并提示降级
- **Git 操作层** — `src/main/git/command-runner/`
  - 状态 / 历史 / 分支 / worktree / submodule
  - Git 版本能力探测与兼容回退（基线 Git 2.25）
- **不提供托管平台集成与远程执行**
  - 无 PR / MR 创建、无 issue 任务页、无 CI 检查面板
  - 本地与 WSL 之外的执行主机上不提供 Git 操作

## 3. 终端

> 契约：`specs/terminal/spec.md`

- **终端会话** — `src/main/pty/`
  - 工作区内启动 shell 会话，双向传递输入输出
  - 前台进程结束后回到可交互 shell
- **多标签与分屏** — `src/renderer/src/components/terminal-pane/`
  - 标签间切换
  - 面板分割：各面板独立会话
  - 关闭一个标签不影响其他标签
- **滚动缓冲与搜索**
  - 每会话保留滚动缓冲
  - 缓冲内文本搜索与高亮定位
  - 超出上限时按策略裁剪最早内容，不阻塞输入
- **会话恢复** — `src/main/daemon/`
  - 重启后恢复标签与分屏布局
  - 尽力恢复滚动缓冲；不可恢复的会话明确标注为已结束
- **终端外观**
  - 主题与字体配置
  - 外部主题导入，切换后已打开终端立即重绘
- **终端能力**
  - WebGL 渲染与 kitty 键盘协议
  - OSC 52 剪贴板与链接操作
  - 进程树清理（Windows / MSYS 场景）
- **不提供远程终端**
  - 新建终端的可选执行位置只有本地与 WSL 发行版

## 4. 文件管理与编辑

> 契约：`specs/file-management/spec.md`

- **文件树浏览**
  - 展示工作区文件与目录树
  - 外部新增 / 修改 / 删除后自动更新，无需手动刷新
  - 新建 / 重命名 / 删除
- **文件编辑与保存** — `src/renderer/src/components/editor/`
  - 打开文本文件，显式保存与自动保存
  - 未保存时可见指示
  - 外部改动检测：提示而非静默覆盖
- **内容搜索** — `src/main/ripgrep/`
  - 按文本内容搜索已打开工作区
  - 结果列出匹配文件与行，可跳转到位置
  - 无匹配时报告无结果而非报错
- **快速打开** — `src/renderer/src/components/quick-open-file-list.ts`
  - 按文件名模糊匹配打开文件
- **查看器**
  - Markdown 富文本编辑与预览
  - 只读查看：CSV / 图片 / PDF / HTML / Mermaid
- **访问范围限于本地与 WSL**
  - 仅本地路径与 WSL 发行版内路径可访问
  - 工作区根之外且未允许的路径被拒绝

## 5. WSL 执行

> 契约：`specs/wsl-execution/spec.md`

- **发行版发现** — `src/main/wsl/wsl-executable-path.ts`
  - 枚举本机可用发行版
  - 无可用发行版或 WSL 不可用时报告不可用，不提供选项
- **操作路由到所选发行版** — `src/main/wsl/wsl-runner.ts`
  - Git 操作在发行版内执行，而非 Windows 宿主侧
  - 终端会话在发行版内启动
  - 同一工作区的连续操作保持同一发行版
- **路径与删除语义** — `src/shared/wsl-paths.ts`
  - UNC 形式路径表示，不把 Windows 路径误当作发行版内路径
  - 发行版内删除正确处理符号链接，不越界
- **WSL 不改变执行主机标识** — `src/shared/execution-host.ts`
  - 选择发行版不产生新的主机条目，工作区仍属本地主机
  - `ExecutionHostKind` 只有 `local` 一个变体
- **失败不静默回退**
  - 所选发行版不可用时报告错误
  - 不在宿主侧静默执行同一操作

## 6. Agent 启动与状态

> 契约：`specs/agent-launch-status/spec.md`

- **在终端中启动 agent CLI** — `src/main/agent-launch/`
  - 从工作区在终端中启动受支持的 agent，终端保持可交互
  - 可配置该 CLI 的启动参数
  - 未识别的命令按普通终端命令处理，不声明 agent 状态
- **状态识别限于进程与标题** — `src/main/agent-hooks/`
  - 由终端进程与终端标题判定运行中 / 等待输入 / 空闲
  - 状态随进程变化更新
  - 状态可解释：不依赖代理上报的结构化会话数据
- **不向 agent 投递内容**
  - 不存在向 agent 发送消息或审批的输入区
  - 不存在向 agent 会话写入提示或回答的通道
- **不接管或恢复 agent 会话**
  - 无恢复、分叉、接管会话的入口
  - 不读取或持久化 agent 的结构化会话流
- **不提供用量、账号与编排**
  - 无用量统计、账号切换、密钥管理入口
  - 无多 agent 编排或定时自动化入口

---

## 说明

**不作为能力域的横切基础设施**（不单列为域，但为上述 6 域提供支撑）：应用外壳与窗口、菜单与托盘、
快捷键引擎、设置中心、通知、状态持久化与恢复、i18n。它们不新增面向用户的能力域。

**树中做了合并的地方**：

1. 多个具体 agent CLI 方言目录合并为「Agent 启动与状态」下的启动项。
2. 终端协议兼容细节（kitty keyboard、DA 查询回复、Sixel / iTerm 图片协议）合并为「终端能力」。
3. 持久化的抢救路径（salvage、tombstone、fencing、迁移）合并为「本地多项目状态持久化」。
4. Git 版本能力探测与回退合并为「Git 操作层」。
5. WSL 的发行版探测、包装脚本与删除语义合并为「发行版发现」与「路径与删除语义」。

**裁剪前后对照**：裁剪前的功能树（含浏览器、托管平台集成、SSH / 远程执行、移动伴侣、云后端、
CLI、编排、账号用量、技能插件、自动更新、遥测、模拟器）见 `docs-slim/cull-inventory.md` 与
`docs-slim/feature-tree.pre-cull.md` 的历史记录。
