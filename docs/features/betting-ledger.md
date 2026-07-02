# 投注记录功能设计

## 目标

投注记录功能为快乐8研究所提供本地个人投注台账。第一版只支持个人手动或模拟投注，不接入真实下单、账户资金、支付交易、多用户或多设备同步。

## 已确认口径

- 一条投注记录只绑定一个投注期次；连续追投多期应创建多条投注记录。
- 一条投注记录内允许存在多个投注项，用于表达同一期下的多种选号结构。
- 一个投注项内允许存在多个号码组，用于表达同一玩法、选号结构、倍数下的多组号码，尤其是单式多组号码。
- 同一期次仍允许存在多条投注记录，但默认工作流优先在同一条投注记录内追加投注项。
- 完全相同的期次、玩法、选号结构、号码和倍数只提示可能重复，不强制禁止保存。
- 投注记录存储在当前浏览器 IndexedDB 中。
- IndexedDB 访问层使用 Dexie.js，避免手写原生 IndexedDB 操作封装。
- 第一版支持导出全部投注记录为带 `schemaVersion` 的 JSON 文件。
- 第一版支持从导出 JSON 文件导入全部投注记录；当导入记录与本地记录 `id` 重复时，以导入内容覆盖本地记录。
- 第一版不保存奖金规则快照。

## 核心概念

- 玩法：任选一到任选十，决定中奖规则。
- 选号结构：单式、复式、胆拖，决定注数展开方式。
- 投注项：一条投注记录中的一个独立投注明细分组，承载统一的玩法、选号结构和倍数。
- 号码组：投注项中的一个具体选号单元，单式多组号码通过多个号码组表达。
- 倍数：投注成本和中奖金额的放大倍数。
- 投注成本：号码组成本按注数乘以每注 2 元再乘以倍数；投注项成本为全部号码组成本之和；投注记录成本为全部投注项成本之和。
- 营收：中奖金额减投注成本。
- 投注期次：决定用哪一期开奖号码结算，从最近开奖记录中选择。
- 投注日期：从选中的投注期次选项中取得，决定月度统计归属。
- 结算时间：只表示计算完成时间，不决定统计归属。

## 数据模型草案

第二版通过 Dexie.js 管理 IndexedDB schema、版本升级和投注记录查询。核心变化是把投注记录建模为期次级聚合，并在内部持有多个投注项。

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

普通选号使用 `numbers`。胆拖使用 `bankerNumbers` 和 `dragNumbers`，此时 `numbers` 可为空。单式多组号码通过同一投注项下的多个号码组表达。投注项汇总注数和汇总成本由全部号码组汇总得到，记录级总注数和总投注成本由全部投注项汇总得到。

## 校验规则

- 一条投注记录至少包含一个投注项。
- 一条投注项至少包含一个号码组。
- 投注号码范围为 1 到 80。
- 同一号码组内号码不得重复。
- 单式号码数量必须等于玩法要求数量。
- 复式号码数量必须大于等于玩法要求数量。
- 胆拖中的胆码数量必须少于玩法要求数量。
- 胆码和拖码不得重复。
- 胆码加拖码数量必须能满足玩法要求数量。
- 每个投注项的倍数必须为正整数。
- 单式投注项允许包含多个号码组；复式和胆拖默认每个投注项维护一个号码组，除非后续明确需要批量录入。
- 投注期次必须从最近开奖记录选项中选择，选项值格式为 `code(date)`；保存时拆分为 `issue` 和 `betDate`。

## 注数和成本

```txt
单个单式号码组注数 = 1
单个复式号码组注数 = C(已选号码数, 玩法要求数量)
单个胆拖号码组注数 = C(拖码数量, 玩法要求数量 - 胆码数量)
号码组成本 = 注数 * 2 * 倍数
投注项总注数 = sum(group.stakeCount)
投注项总成本 = sum(group.stakeAmount)
投注记录总注数 = sum(item.stakeCount)
投注记录总成本 = sum(item.stakeAmount)
```

号码组成本、投注项总成本和投注记录总成本都自动计算，不提供手动覆盖入口。

## 结算规则

- 未结算记录在对应期次已开奖后可以自动或手动结算。
- 已结算记录不被系统自动覆盖。
- 用户可以主动重新结算，覆盖原结算汇总。
- 编辑已结算记录的任一投注项或号码组核心内容时，清空整条记录及全部投注项、号码组的结算汇总并回到未结算状态。
- 结算结果持久化保存记录汇总、投注项汇总和号码组汇总，不保存每一注展开明细。
- 每一注展开明细可在详情查看时即时计算。

## 页面工作流

投注记录作为独立导航页，承载完整台账工作流。

页面主区域只展示投注记录卡片列表，不再通过 tab 切换新增、列表、待结算和统计视图。卡片列表使用前端分页：当前浏览器 IndexedDB 中的记录仍一次性加载，页面只对已加载记录切片展示。

主区域顶部操作按钮：

- 月份汇总：打开 drawer 展示年度月度统计。
- 导出：导出全部投注记录为 JSON。
- 新增：打开 drawer 填写新增投注表单和选号器。

记录卡片支持查看投注信息、结算状态、编辑、删除、结算和重新结算。卡片展示记录级汇总信息，例如总注数、总成本、投注项数量、号码组数量和记录级营收。待结算不再作为独立入口，而是作为记录卡片状态呈现。

新增和编辑复用同一个投注表单 drawer。新增按钮打开空表单；编辑按钮打开已填充当前记录的表单，保存修改后关闭 drawer。表单中的投注期次为下拉选择，选项来自最近开奖记录接口，并以 `code(date)` 形式展示；用户不单独填写投注日期。表单主体改为“投注项列表 + 号码组列表 + 当前编辑器”，支持增删投注项，并支持单式场景下批量维护多组号码。

## 月度统计

统计归属按 `betDate` 所在年月计算。

```txt
月投注成本 = sum(totalStakeAmount)
月投注金额 = sum(totalStakeAmount)
月中奖金额 = sum(settlement.prizeAmount)
月营收 = 月中奖金额 - 月投注成本
```

当前口径中“本金”和“投注金额”都指向投注成本；UI 上应避免同时展示两个含义相同的指标，除非明确命名为“投注成本/投注金额”。

月份汇总 drawer 按年份筛选展示。选中年份固定渲染 1 月到 12 月，没有记录的月份按 0 补齐。图表中投注成本和中奖金额使用柱状图展示，营收使用折线图展示，营收允许为负数。
