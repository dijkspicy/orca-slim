# Spec Delta

## Purpose

让用户在工作区终端中启动受支持的 CLI 编码代理，并从终端进程与标题观察其运行状态，在界面上以状态指示呈现。

## ADDED Requirements

### Requirement: 在终端中启动 agent CLI

系统 SHALL 允许用户从工作区在终端中启动一个受支持的 agent CLI，并 SHALL 允许用户配置该 CLI 的启动参数。

#### Scenario: 启动 agent

- **WHEN** 用户选择某个受支持的 agent 并在工作区终端中启动
- **THEN** 系统在该工作区的终端中运行对应 CLI，且该终端保持可交互

#### Scenario: 未知 agent 不被当作受支持项

- **WHEN** 用户启动一个系统未识别的命令
- **THEN** 系统按普通终端命令处理，且不为其声明 agent 状态

### Requirement: 状态识别限于进程与标题

系统 SHALL 通过终端进程与终端标题的观察来判定 agent 的运行状态（运行中、等待输入、空闲），并 SHALL 在界面中显示该状态。

#### Scenario: 状态随进程变化更新

- **WHEN** 某个终端中的 agent 进程从运行转为等待输入
- **THEN** 界面对应的状态指示随之更新

#### Scenario: 状态来源可解释

- **WHEN** 用户查看某个终端的 agent 状态
- **THEN** 该状态可由该终端的进程与标题观察得出，且不依赖代理上报的结构化会话数据

### Requirement: 不向 agent 投递内容

系统 SHALL NOT 向 agent 会话投递提示、审批、回答或附件；系统 SHALL NOT 提供对话式 agent 界面。

#### Scenario: 无对话式界面

- **WHEN** 用户查看一个正在运行 agent 的终端
- **THEN** 界面中不存在用于向该 agent 发送消息或审批的输入区

#### Scenario: 无内容注入通道

- **WHEN** 用户在工作区中操作
- **THEN** 系统不会向 agent 会话写入提示或回答

### Requirement: 不接管或恢复 agent 会话

系统 SHALL NOT 恢复、分叉或接管 agent 会话，也 SHALL NOT 读取或持久化 agent 的结构化会话流。

#### Scenario: 无会话接管入口

- **WHEN** 用户查看终端或侧栏
- **THEN** 不存在恢复、分叉或接管 agent 会话的入口

#### Scenario: 结构化会话流不被消费

- **WHEN** agent 在其终端内产生结构化输出
- **THEN** 系统不解析该输出为会话记录，也不据其驱动界面状态

### Requirement: 不提供用量、账号与编排

系统 SHALL NOT 提供 agent 用量统计、账号切换与密钥管理，也 SHALL NOT 提供多 agent 编排或定时自动化。

#### Scenario: 无用量与账号界面

- **WHEN** 用户查看状态栏与设置
- **THEN** 不存在用量统计、账号切换或密钥管理入口

#### Scenario: 无编排入口

- **WHEN** 用户查看工作区与终端
- **THEN** 不存在派发任务给其他 agent 或调度多 agent 的入口
