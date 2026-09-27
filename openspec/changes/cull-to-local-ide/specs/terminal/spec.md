# Spec Delta

## Purpose

提供本地与 WSL 内的终端会话，支持多标签、分屏、可搜索的滚动缓冲，并在应用重启后恢复布局与缓冲。

## ADDED Requirements

### Requirement: 终端会话

系统 SHALL 在工作区内启动 shell 会话，并 SHALL 在会话与用户之间双向传递输入输出。

#### Scenario: 打开终端并执行命令

- **WHEN** 用户在工作区打开一个终端并输入命令
- **THEN** 系统执行该命令并在终端中显示输出

#### Scenario: 前台进程结束后回到 shell

- **WHEN** 终端中运行的前台进程退出
- **THEN** 终端回到可交互的 shell 提示符

### Requirement: 多标签与分屏

系统 SHALL 支持在多个终端标签之间切换，并 SHALL 支持将工作区划分为多个终端面板。

#### Scenario: 分屏显示两个终端

- **WHEN** 用户将一个终端面板分割为两个
- **THEN** 两个面板各自拥有独立会话，且可分别输入

#### Scenario: 关闭一个标签不影响其他标签

- **WHEN** 用户关闭一个终端标签
- **THEN** 其余标签的会话继续运行

### Requirement: 滚动缓冲与搜索

系统 SHALL 保留每个终端会话的滚动缓冲，并 SHALL 允许在其中搜索文本。

#### Scenario: 搜索历史输出

- **WHEN** 用户在终端中搜索一个先前出现过的字符串
- **THEN** 系统定位到匹配处并高亮

#### Scenario: 滚动缓冲超出上限时按策略裁剪

- **WHEN** 会话输出超过滚动缓冲上限
- **THEN** 系统按已配置策略裁剪最早的内容，且不阻塞终端输入

### Requirement: 会话恢复

系统 SHALL 在应用重启后恢复终端布局，并 SHALL 尽力恢复各会话的滚动缓冲。

#### Scenario: 重启后布局恢复

- **WHEN** 应用在存在多个终端标签与分屏时退出并重新启动
- **THEN** 终端标签与分屏布局被恢复

#### Scenario: 无法恢复的会话被明确标注

- **WHEN** 某个会话在重启后无法继续
- **THEN** 系统以可见方式标注该标签为已结束，而不是静默丢弃

### Requirement: 终端外观

系统 SHALL 支持配置终端主题与字体，并 SHALL 支持导入外部主题。

#### Scenario: 切换主题

- **WHEN** 用户选择另一个终端主题
- **THEN** 已打开终端立即按新主题渲染

### Requirement: 不提供远程终端

系统 SHALL NOT 提供 SSH 或配对 runtime 主机上的终端会话。

#### Scenario: 无远程终端入口

- **WHEN** 用户新建终端
- **THEN** 可选的执行位置仅为本地与 WSL 发行版
