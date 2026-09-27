# Spec Delta

## Purpose

提供完整的本地 Git 工作流：查看仓库状态、暂存与提交、推送、评审差异，以及管理多个 worktree。不依赖任何托管代码平台或远程执行主机。

## ADDED Requirements

### Requirement: 仓库状态与暂存

系统 SHALL 报告工作区中各文件的变更状态（已暂存、未暂存、未跟踪、冲突），并 SHALL 允许用户暂存或取消暂存单个文件。

#### Scenario: 查看变更并暂存单个文件

- **WHEN** 用户打开源控制面板且工作区存在已修改文件
- **THEN** 系统按已暂存/未暂存/未跟踪分组列出这些文件
- **AND** 用户可对单个文件执行暂存，其状态随即移入已暂存组

#### Scenario: 冲突文件被标记

- **WHEN** 工作区中存在处于合并冲突状态的文件
- **THEN** 系统将其标记为冲突，且不将其计入可直接提交的已暂存文件

### Requirement: 提交与推送

系统 SHALL 允许用户创建提交并推送到已配置的 remote。提交信息 SHALL 由用户提供，系统 SHALL NOT 依赖任何 AI 或网络服务才能创建提交。

#### Scenario: 使用手写信息提交

- **WHEN** 用户输入提交信息并对已暂存文件执行提交
- **THEN** 系统创建提交并在历史中显示该提交

#### Scenario: 离线环境下仍可提交

- **WHEN** 应用无法访问任何外部服务
- **THEN** 用户仍能创建本地提交

#### Scenario: 推送失败可恢复

- **WHEN** 推送被 remote 拒绝（例如远端有新提交）
- **THEN** 系统报告失败原因，且不丢失本地提交

### Requirement: Worktree 生命周期

系统 SHALL 支持创建、列出、切换与删除 Git worktree，每个 worktree 拥有独立的工作目录与分支，且共享同一仓库。

#### Scenario: 创建 worktree

- **WHEN** 用户为某仓库创建 worktree 并指定基线引用
- **THEN** 系统在该基线处创建新工作目录与分支，并在侧栏列出该 worktree

#### Scenario: 删除含未提交改动的 worktree 需确认

- **WHEN** 用户删除一个含未提交改动的 worktree
- **THEN** 系统要求用户确认后才执行删除

### Requirement: 差异评审

系统 SHALL 渲染文件差异，支持在工作区改动、单个提交与分支之间查看，并支持按文件导航。

#### Scenario: 打开工作区差异

- **WHEN** 用户对某个已修改文件选择查看差异
- **THEN** 系统展示该文件相对基线的逐行差异

#### Scenario: 大文件差异降级

- **WHEN** 用户打开一个超出渲染预算的文件差异
- **THEN** 系统以分节方式加载，并提示已降级而非静默截断

### Requirement: 不提供托管平台集成与远程执行

系统 SHALL NOT 提供托管代码平台集成（包括 PR/MR 创建、issue 与项目任务页、CI 检查面板），也 SHALL NOT 提供远程执行主机（SSH 或配对 runtime）上的 Git 操作。

#### Scenario: 无托管平台入口

- **WHEN** 用户浏览应用界面
- **THEN** 不存在 PR/MR 创建、issue 任务页或 CI 检查的入口

#### Scenario: 无远程主机选项

- **WHEN** 用户添加仓库或创建 worktree
- **THEN** 可选执行位置仅为本地与 WSL，不存在 SSH 或配对 runtime 主机
