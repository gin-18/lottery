# Separate Static Assets from Frontend Source Modules

## Status

Accepted

## Context

当前前端源码把 `src/assets/css` 和 `src/assets/js` 同时当作静态资源目录和源码模块目录来使用。

这已经带来两个问题：

- `assets` 语义被冲淡。图片、样式入口、接口请求、图表初始化、统计工具、投注台账模型都混在一起，读代码时很难判断哪些是静态资源，哪些是可执行源码。
- 目录深度和业务归属都变模糊。像投注台账的规则、迁移和 IndexedDB 访问属于状态层支撑，不应该伪装成静态资源；快乐 8 通用规则和开奖数据工具也不应该继续挂在 `assets/js` 下面。

如果继续沿用这个目录，后续新增模块时只会让 `assets` 变成一个无边界的杂项目录，重构成本会越来越高。

## Decision

调整前端源码目录约定：

- `src/assets` 只保留真正的静态资源，例如图片。
- 全局样式入口放到 `src/styles/`。
- 对外数据访问放到 `src/api/`。
- 通用图表初始化和配色放到 `src/charts/`。
- 跨页面复用的数据处理和快乐 8 通用规则放到 `src/utils/`。
- 投注台账专属的持久化和记录模型逻辑放到 `src/stores/betting-ledger/`，贴近其状态层调用方。

同时把原先混在一个文件里的职责拆开：

- 快乐 8 玩法、奖金规则和标签函数拆到 `src/utils/lottery-rules.js`
- 投注台账记录的创建、校验、迁移和结算保留在 `src/stores/betting-ledger/betting-ledger-model.js`

## Consequences

正面影响：

- `assets` 重新回到“静态资源”这一单一语义。
- 接口访问、图表基础设施、通用工具和投注台账模型的职责边界更清楚。
- 业务专属逻辑不再出现在 `src` 一级目录，也不会伪装成通用静态资源。
- 后续新增代码时，调用方更容易判断应该放在 `api`、`utils`、`charts`、`styles`，还是贴近具体 store。

代价：

- 现有 import 路径需要整体迁移。
- 一部分原本从单文件导出的符号需要按新职责拆分引用。

## Rejected Alternatives

### 只把 `css` 和 `js` 改名，继续留在 `assets`

这只能弱化表面命名问题，不能解决源码模块和静态资源混放的问题。

### 在 `src` 一级新增业务目录承载投注台账代码

这会让一级目录混入具体业务域，不符合当前项目希望把一级目录保留给技术职责和页面骨架的约束。

### 只移动目录，不拆 `betting-rules.js`

`betting-rules.js` 同时承载快乐 8 通用规则和投注台账记录模型，原样迁移会保留职责耦合，目录调整的收益会被削弱。
