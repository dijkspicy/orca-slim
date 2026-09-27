# Spec Delta

## Purpose

让 Git、终端与文件操作可以在 Windows 本地主机上指定的 WSL 发行版内执行。WSL 是本地主机上的一个发行版维度，而不是独立的执行主机类型。

## ADDED Requirements

### Requirement: 发行版发现

系统 SHALL 枚举本机可用的 WSL 发行版，并 SHALL 让用户为工作区选择其中之一。

#### Scenario: 列出可用发行版

- **WHEN** 用户在 Windows 主机上打开主机选择器
- **THEN** 系统列出已安装的 WSL 发行版

#### Scenario: 无可用发行版

- **WHEN** 本机未安装任何 WSL 发行版或 WSL 不可用
- **THEN** 系统报告 WSL 不可用，且不提供发行版选项

### Requirement: 操作路由到所选发行版

系统 SHALL 将选定发行版内的 Git 操作、终端会话与文件系统操作路由到该发行版执行，并 SHALL 在该工作区的后续操作中保持该选择。

#### Scenario: Git 操作在发行版内执行

- **WHEN** 一个工作区选择了某个 WSL 发行版，且用户执行 Git 操作
- **THEN** 该操作在该发行版内执行，而不是在 Windows 宿主侧

#### Scenario: 终端在发行版内启动

- **WHEN** 用户在选择了 WSL 发行版的工作区打开终端
- **THEN** 终端会话在该发行版内启动

#### Scenario: 选择在工作区生命周期内保持一致

- **WHEN** 用户在同一工作区连续执行多次 Git、终端与文件操作
- **THEN** 所有操作都路由到同一个发行版

### Requirement: 路径与删除语义

系统 SHALL 正确处理 WSL 的路径表示，包括 UNC 形式的路径，并 SHALL 在发行版内正确执行删除与符号链接处理。

#### Scenario: 通过 UNC 路径访问发行版文件

- **WHEN** 系统需要访问某发行版内的文件
- **THEN** 使用该发行版对应的路径表示，且不把 Windows 路径误当作发行版内路径

#### Scenario: 删除发行版内的目录

- **WHEN** 用户在发行版内删除一个包含符号链接的目录
- **THEN** 删除在发行版内正确完成，且不误删符号链接目标之外的内容

### Requirement: WSL 不改变执行主机标识

选择 WSL 发行版 SHALL NOT 改变工作区的执行主机标识；工作区仍属于本地主机。

#### Scenario: 主机标识保持为本地

- **WHEN** 一个工作区选择在 WSL 发行版内执行
- **THEN** 该工作区的执行主机仍被识别为本地，且不产生新的主机条目

### Requirement: 失败不静默回退

当所选发行版不可用时，系统 SHALL 报告错误，且 SHALL NOT 静默改为在 Windows 宿主侧执行同一操作。

#### Scenario: 发行版停止后操作报错

- **WHEN** 用户对选择了某发行版的工作区执行操作，而该发行版已不可用
- **THEN** 系统报告该发行版不可用，而不是在宿主侧执行该操作
