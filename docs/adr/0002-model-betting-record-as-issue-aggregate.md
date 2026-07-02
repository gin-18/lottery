# Model Betting Record as Issue Aggregate

## Status

Accepted

## Context

当前投注记录模块把一条投注记录建模为“一期 + 一种玩法/选号结构 + 一组号码 + 一个倍数”。

这个建模已经和真实使用场景冲突：

- 同一期投注时，用户可能会投多组号码。
- 同一期投注时，用户可能会同时使用多种选号结构，例如既投复式，又投胆拖。
- 列表、统计、结算和导出都需要同时表达“同一期的整体投注”和“其中每一组具体投注内容”。

继续把新需求塞进现有单条记录模型，只会让页面、校验、结算和统计都知道越来越多的细节，模块会变浅，调用方复杂度会上升。

## Decision

把投注记录重定义为“面向单一期次的聚合根”，并在记录内部引入“投注项”和“号码组”。

- 一条投注记录只绑定一个投注期次。
- 一条投注记录包含一个或多个投注项。
- 一个投注项表示同一玩法、选号结构、倍数下的一批号码组。
- 一个号码组表示一组具体选号，拥有自己的号码、注数、投注成本和可选结算汇总。
- 投注记录本身保存汇总字段，例如总注数、总投注成本、记录状态和记录级结算汇总。
- 投注项结算由全部号码组结算结果汇总得到。
- 记录级结算由全部投注项结算结果汇总得到。

## Data Shape

```js
{
  id: string,
  schemaVersion: 2,
  issueOption: string,
  issue: string,
  betDate: string,
  items: [
    {
      id: string,
      playType: 'pick1' | 'pick2' | 'pick3' | 'pick4' | 'pick5' | 'pick6' | 'pick7' | 'pick8' | 'pick9' | 'pick10',
      selectionMode: 'single' | 'compound' | 'dantuo',
      multiplier: number,
      numberGroups: [
        {
          id: string,
          numbers: number[],
          bankerNumbers: number[],
          dragNumbers: number[],
          stakeCount: number,
          stakeAmount: number,
          settlement: null | {
            hitNumbers: number[],
            maxHitCount: number,
            winningStakeCount: number,
            prizeAmount: number,
            revenue: number
          }
        }
      ],
      stakeCount: number,
      stakeAmount: number,
      settlement: null | {
        groupCount: number,
        winningGroupCount: number,
        winningStakeCount: number,
        prizeAmount: number,
        revenue: number
      }
    }
  ],
  totalStakeCount: number,
  totalStakeAmount: number,
  status: 'pending' | 'settled',
  settlement: null | {
    drawNumbers: number[],
    itemCount: number,
    winningItemCount: number,
    winningStakeCount: number,
    prizeAmount: number,
    revenue: number,
    settledAt: string
  },
  createdAt: string,
  updatedAt: string
}
```

## Consequences

正面影响：

- 页面卡片可以自然表达“某一期的整体投注”。
- 详情抽屉可以展示同一期下的多个投注项，以及投注项下的多个号码组。
- 录入表单可以支持动态增删投注项，并在单式场景下批量录入多组号码，而不是重复创建多条外表相同的记录。
- 结算逻辑可以稳定地共享同一期开奖号码，再聚合出记录级结果。
- 月度统计只依赖记录总成本和记录总奖金，不需要在 UI 层拆算。

代价：

- IndexedDB schema 需要升级到 v2。
- 旧数据需要迁移：每条 v1 记录迁移为包含单个投注项的 v2 记录。
- 校验、重复提示、导出结构、列表展示和详情展示都要改成“记录 + 投注项 + 号码组”三层模型。

## Rejected Alternatives

### 继续把每个投注项存成独立投注记录

这样最省改动，但会让同一期的整体投注散落在多条记录里。列表展示、统计口径、批量结算和编辑体验都会继续依赖页面层拼装，复杂度只是转移位置，没有消失。

### 给现有记录额外增加第二组、第三组号码字段

这会把模型锁死在少数固定槽位里，无法表达不定数量的投注项，也无法优雅支持同一期内多种选号结构。

### 只保留“记录 + 投注项”两层模型

这能表达复式和胆拖混投，但对单式多组号码不友好。用户会被迫创建大量只有号码不同、其余字段完全相同的投注项，录入和编辑负担过高。

### 分成三张表：记录表、投注项表和号码组表

这是可行方案，但在当前前端单机 IndexedDB 场景下，没有立即需要跨表独立查询号码组的证据。先把“记录聚合 + 内嵌投注项 + 内嵌号码组”作为外部接口，可以保留将来再拆表的空间。
