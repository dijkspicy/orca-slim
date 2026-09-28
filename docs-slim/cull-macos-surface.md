# macOS 剥离面（任务 10.1–10.5 的执行图）

由 `/tmp/opencode/macos-surface.mjs` 于裁剪中段实测。macOS 不在 `scc-plan.mjs` 的 DELETE 表内
（表只覆盖功能域），所以它是一个**独立的删除工作流**：先把下列模式并入 DELETE，再按同一套
「切边 → 可达性剥离 → 删除 → `pnpm tc`」流程走。

## 1. 待并入 DELETE 的模式

```
src/main/macos-*                     src/main/macos-keychain/
src/main/dock/                       src/main/network/macos-*
src/main/providers/macos-*           src/main/window/macos-*
src/main/daemon/macos-*              src/main/daemon/daemon-tcc-attribution*
src/main/ipc/macos-*                 src/preload/api/macos-*
src/shared/macos-*                   src/renderer/src/lib/passive-macos-*
src/renderer/src/hooks/{useMac*,useMacosTcc*,MacosTcc*}
src/renderer/src/components/settings/TerminalTccAttributionNotice*
```

## 2. 实测规模

| 指标 | 值 |
| --- | --- |
| 命中上述模式的源文件 | 51 |
| 立即可剥离（不被任何幸存文件可达） | 25 |
| 卡在核心（被幸存文件可达） | 26 |
| 需要切断的直接边所在文件 | 62 |
| 其中有 darwin 条件分支的文件（任务 10.2/10.3） | 261 |

## 3. 62 个阻挡文件的归属（决定谁来切）

**8 个本身属 `agent-stack` 删除域**——随该波一起消失，macOS 波不必处理：

`src/main/claude-accounts/keychain.ts`、`src/main/rate-limits/{claude-active-usage-fetch,claude-oauth-recovery,claude-pty,codex-fetcher,codex-pty-rate-limit-probe,codex-rpc-rate-limit-probe,cursor-auth}.ts`

**54 个必须由 macOS 波自己切**。分布集中在两个**保留域**：

- **`src/main/daemon/`（17）** — 终端守护进程是保留域。这里的依赖**不是删除，是去 darwin 分支**
  （任务 10.2）：`daemon-entry`、`daemon-request-router`、`daemon-provider-{init,state}`、
  `pty-subprocess/native-pty-spawn`、6 个 `daemon-pty-adapter*.test.ts` 等。
- **`src/main/providers/local-pty-*`（11）** — 本地 PTY 是保留域，同样按 10.2 去分支；
  其中 9 个是 `.test.ts`，删掉 mac 专用用例即可。

其余分布在装配层（`src/main/index.ts`、`startup/main-process-{preflight,quit}`、
`window/attach-main-window-services.ts`、`preload/{index,api/app-*}`）与 renderer
（`app-shell/AppBackgroundServices.tsx`、`settings/{DeveloperPermissionsPane,ManageSessionsSection,shortcut-definition-catalog,use-mac-captured-digit-chords}`、
`right-sidebar/{git-status-file-watch-refresh,useGitStatusPolling}`、`sidebar/use-worktree-card-lifecycle-effects`）。
这些是 10.1 与 10.3 的交界：桥接层与设置页去掉 TCC / mac 键位入口，保留其余行为。

⚠️ `src/renderer/src/store/github/worktree-refresh.ts` 与
`src/renderer/src/lib/serve-desktop-promotion-session-continuity.test.ts` 同时命中
`renderer-mirror` 删除域与 macOS 面——先让 `renderer-mirror` 波处理，macOS 波只需复查。

## 4. 顺序建议

1. 先走完 `agent-stack` 波（消化那 8 个阻挡文件）。
2. 再把 macOS 模式并入 DELETE，跑一次 peel：预期 25 个叶子自动释放。
3. 对余下 26 个卡核心文件切边（多数是 10.2 的去 darwin 分支，而非删除调用点）。
4. `pnpm tc` 绿后提交；随后做 10.4（`electron-builder.config.cjs` 的 mac 块、
   `resources/darwin/`、`icon.icns`、entitlements、5 个 mac workflow）与 10.6（D6/D7 决策）。

## 5. 任务 10.4 的固定清单（不随域删除变化）

`config/electron-builder.config.cjs`：`mac:` 块（L429）、`icon: resources/build/icon.icns`、
`entitlements*.mac.plist`、`createPackagedRuntimeNodeModuleResources('darwin')`、
`extraResources` 里的 `resources/darwin/bin/orca` 与 `agent-browser-darwin-*`、
`artifactName: 'orca-macos-${arch}.${ext}'`、以及 `electronPlatformName === 'darwin'` 的三个分支。
另需删 `resources/darwin/`、`resources/build/icon.icns`、`entitlements.mac.plist` 与 5 个 mac workflow。
