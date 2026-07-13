# Share Lottery Prize Calculation Rules

## Status

Accepted

The tool-box prize calculator and betting ledger settlement both need the same 快乐8玩法、组合数和奖金口径. We decided to keep prize amounts, play sizes, combination counting, and compound/dantuo prize-count expansion in `src/utils/lottery-rules.js`, with UI modules only adapting those results for display. This prevents calculator-only prize tables from drifting away from ledger settlement, especially for floating prizes that must be shown as unconfirmed rather than counted as confirmed winnings.
