# Agent Rules

## Skill Routing

- 新增或修改代码前，必须使用 `clean-code` skill，并遵循 `.codex/skills/clean-code/references/rules.md`。
- 用户提到“bug”“debug”“排查”“诊断”“报错”“异常”“性能变慢”等问题定位诉求时，必须使用 `diagnosing-bugs` skill。
- 用户提到“测试驱动”“先写测试”“red-green-refactor”“补测试并驱动实现”等诉求时，必须使用 `tdd` skill。
- 用户提到“模块设计”“接口设计”“边界设计”“提高可测试性”“提炼 seam”等设计诉求时，优先使用 `codebase-design` skill。

## Frontend Style Rules

- 新增或修改前端样式、模板 class 或项目样式规则时，必须遵循 `docs/frontend-style-guide.md`，不要新增纯布局/间距/圆角组合的项目样式类，除非它承载稳定业务语义或交互契约。
