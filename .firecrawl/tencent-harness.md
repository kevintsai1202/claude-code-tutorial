Loading \[MathJax\]/jax/output/CommonHTML/config.js

[码森林](https://cloud.tencent.com/developer/user/1055266)

作者相关精选

## 别卷模型了！OpenAI 工程师都在偷偷用的"Harness Engineering"，才是 AI 编程的终极杀器

关注作者

[_腾讯云_](https://cloud.tencent.com/?from=20060&from_column=20060)

[_开发者社区_](https://cloud.tencent.com/developer)

[文档](https://cloud.tencent.com/document/product?from=20702&from_column=20702) [建议反馈](https://cloud.tencent.com/voc/?from=20703&from_column=20703) [控制台](https://console.cloud.tencent.com/?from=20063&from_column=20063)

登录/注册

[首页](https://cloud.tencent.com/developer)

学习

活动

专区

圈层

工具

[MCP广场![](https://qccommunity.qcloudimg.com/image/new.png)](https://cloud.tencent.com/developer/mcp)

[![](https://dscache.tencent-cloud.cn/upload//%E7%A4%BE%E5%8C%BA-Header%20%20352-60-1e83863f1fd12056bcf19786d15fa454cd4a5c4d.png)](https://cloud.tencent.com/act/pro/ocr61?ad_trace=fdd91f2e2d6745b4af83fa3a2f9e712e&from=24763&from_column=24763)

文章/答案/技术大牛搜索

搜索关闭

发布

码森林

[社区首页](https://cloud.tencent.com/developer) > [专栏](https://cloud.tencent.com/developer/column) >别卷模型了！OpenAI 工程师都在偷偷用的"Harness Engineering"，才是 AI 编程的终极杀器

# 别卷模型了！OpenAI 工程师都在偷偷用的"Harness Engineering"，才是 AI 编程的终极杀器

发布于 2026-03-31 03:23:14

发布于 2026-03-31 03:23:14

3220

举报

文章被收录于专栏：[用户1055266的专栏（2）](https://cloud.tencent.com/developer/column/107364)用户1055266的专栏（2）

> _当你在纠结选哪个模型时，人家已经用这套方法让 AI 自主开发了 100 万行代码_

* * *

### **01 一个颠覆认知的事实**

2026 年初，OpenAI 内部完成了一个疯狂的项目：

- • **100 万 + 行代码**，全部由 AI 生成
- • **3 个工程师**，5 个月时间
- • **0 行人工编写** 的代码（注意，是故意的）
- • 平均每个工程师每天产出 **3.5 个 PR**
- • 产品现在每天有内部用户，还在持续迭代

![02-OpenAI 案例](https://developer.qcloudimg.com/http-save/yehe-1055266/084eab22c782e2ee6003c33af4208be6.png)

02-OpenAI 案例

最离谱的是什么？这个项目不是 demo，不是玩具，是正儿八经在生产环境跑的系统。

而工程师的工作不再是写代码，而是 **设计一个让 AI 能可靠写代码的系统**。

这个系统，就是今天要讲的 **Harness Engineering（驾驭工程）**。

* * *

### **02 什么是 Harness Engineering？**

#### **一个绝妙的比喻**

想象一下你有一匹千里马（AI 模型）：

- • 它跑得快、力量大、天赋异禀
- • 但它不知道要去哪儿，也不知道怎么拉车

**Harness（马具）** 就是缰绳、马鞍、车辕这一整套装备：

- • 把马的力量引导到正确的方向
- • 让它能拉车、能耕田、能送货
- • 没有马具，马再厉害也只能在草原上瞎跑

![03-马具比喻](https://developer.qcloudimg.com/http-save/yehe-1055266/e80e14ac3ce87187eac2baa53154b20d.png)

03-马具比喻

**Harness Engineering 就是设计和制造这套马具的学问。**

#### **正式定义**

Harness Engineering 是设计和实现以下系统的学科：

1. 1\. **约束系统**：规定 AI 能做什么，不能做什么
2. 2\. **信息系统**：确保 AI 知道该知道的一切
3. 3\. **验证系统**：检查 AI 做得对不对
4. 4\. **修正系统**：当 AI 犯错时能自动纠正

用 Martin Fowler 的话说："这是在 AI 时代保持代码质量的新型工程实践。"

* * *

### **03 为什么现在必须关注 Harness Engineering？**

#### **残酷的现实：模型已经卷不动了**

2025-2026 年，各大模型的编程能力差距越来越小。

GPT-4.5、Claude 3.5、Gemini 2.0...在编程任务上的表现已经趋同。 **模型本身成了大宗商品。**

那什么才是核心竞争力？ **Harness。**

#### **真实案例：LangChain 的逆袭**

LangChain 的编程 Agent 在 Terminal Bench 2.0 排行榜上发生过一次惊天逆袭：

- • **之前**：52.8% 得分，排名 Top 30
- • **之后**：66.5% 得分，排名 Top 5

他们做了什么惊天地泣鬼神的事吗？

**没有。他们连模型都没换。**

只是优化了 Harness：

- • 加了个"完成前检查清单" [中间件](https://cloud.tencent.com/product/message-queue-catalog?from_column=20065&from=20065)
- • 启动时自动映射目录结构
- • 实现了"死循环检测"机制
- • 优化了推理资源的分配策略

**同样的模型，不同的 Harness，天壤之别的结果。**

* * *

### **04 Harness Engineering 的三大支柱（核心干货）**

根据 OpenAI 的官方框架，Harness Engineering 由三大支柱支撑：

![04-三大支柱](https://developer.qcloudimg.com/http-save/yehe-1055266/22743f6bf9337b205f3796972c5e075f.png)

04-三大支柱

#### **支柱一：上下文工程（Context Engineering）**

**核心原则：Agent 应当恰好获得当前任务所需的上下文，不多不少。**

![05-上下文工程](https://developer.qcloudimg.com/http-save/yehe-1055266/bb38991d1c29f585d664488351020e72.png)

05-上下文工程

##### **静态上下文（写进代码库的）**

- • `AGENTS.md` 或 `CLAUDE.md` 文件（类似 README，但专门给 AI 看的）
- • 架构规范文档
- • API 契约
- • 代码风格指南

##### **动态上下文（运行时提供的）**

- • 启动时自动扫描并映射目录结构
- • 实时日志、指标、链路追踪数据
- • CI/CD 流水线状态和测试结果
- • 其他 Agent 的工作进度

##### **关键洞察**

**从 Agent 的视角看：任何它在上下文中访问不到的信息，就等于不存在。**

写在 Confluence 里的文档？不存在。
Slack 里的讨论？不存在。
某个工程师脑子里的知识？不存在。

**代码库必须是唯一的真相源（Single Source of Truth）。**

* * *

#### **支柱二：架构约束（Architectural Constraints）**

**这是 Harness Engineering 最反直觉的部分：**

**限制越多，效率越高。**

##### **典型的分层架构**

代码语言：javascript

AI代码解释

复制

```javascript

```

![06-架构约束](https://developer.qcloudimg.com/http-save/yehe-1055266/67f3637ca7de37ad18b8d19af9be6368.png)

06-架构约束

规则：

- • 每一层只能 import 左边的层
- • 绝对不能跨层调用
- • 不能循环依赖

这不是建议，是 **机械性强制执行**。

##### **怎么执行？**

- • **确定性 Linter**：自定义规则，自动检查违规
- • **LLM** **审计员**：专门有个 Agent 审查其他 Agent 的代码
- • **结构性测试**：类似 ArchUnit，但针对 AI 生成的代码
- • **Pre-commit Hook**：代码提交前自动检查

##### **为什么约束反而提高效率？**

想象一下：

**场景 A（无约束）**：Agent 接到任务"实现一个用户服务"

- • 它要思考：放哪个目录？依赖哪些模块？用什么命名规范？
- • 花了 30% 的 token 在探索可能性上

**场景 B（强约束）**：同样的任务

- • 架构明确规定：Service 层，依赖 Repo 和 Config，遵循 XX 命名规范
- • 100% 的 token 都用在解决问题上

**约束不是限制创造力，是消除决策疲劳。**

* * *

#### **支柱三：熵管理（Entropy Management / Garbage Collection）**

**这是最容易被忽视，但最重要的部分。**

##### **什么是熵？**

AI 生成的代码库会随着时间积累"混乱"：

- • 文档和代码不一致
- • 命名风格越来越不统一
- • 死代码越积越多
- • 架构约束被悄悄打破

这就是熵增。如果不管理，代码库会迅速变成屎山。

##### **怎么管理？**

定期运行专门的"清理 Agent"：

- • **文档一致性 Agent**：每天凌晨 2 点扫描，检查文档是否匹配当前代码
- • **约束违规扫描 Agent**：找出绕过检查的漏网之鱼
- • **模式执行 Agent**：发现并修复不符合设计模式的代码
- • **依赖审计 Agent**：追踪并清理循环依赖和多余依赖

这些 Agent 按调度运行：每天、每周，或在特定事件触发时。

**就像定期做大扫除，保持代码库宜居。**

![07-熵管理](https://developer.qcloudimg.com/http-save/yehe-1055266/73809c18b37d650d3ed6486d429ecba5.png)

07-熵管理

* * *

### **05 大公司都在怎么实践？**

#### **OpenAI：零人工代码模式**

工程师的日常：

| 传统工程师 | Harness 工程师 |
| --- | --- |
| 写代码 | 从不写代码 |
| 偶尔设计架构 | 主要工作就是设计架构 |
| 最后补文档 | 文档是核心基础设施 |
| 审查代码 | 审查 Agent 输出 + 评估 Harness 效果 |
| 调试代码 | 分析 Agent 行为模式 |
| 写测试 | 设计测试策略，Agent 执行 |

**工作重心完全转移。**

#### **Stripe：规模化"小跟班"**

Stripe 内部的编程 Agent 叫 **Minions**，每周产生 **1000+ 合并的 PR**。

工作流程：

1. 1\. 开发者在 Slack 发任务
2. 2\. Minion 写代码
3. 3\. Minion 跑 CI
4. 4\. Minion 开 PR
5. 5\. 人类审查并合并

**第 1 步和第 5 步之间，完全不需要人类参与。**

Harness 处理了一切：测试、CI、代码风格、文档更新。

#### **LangChain：中间件优先**

LangChain 把 Harness 设计成可组合的中间件层：

代码语言：javascript

AI代码解释

复制

```javascript

```

每个中间件层添加特定能力， **不修改核心 Agent 逻辑**。

模块化的好处：Harness 本身可测试、可演进。

* * *

### **06 普通人怎么开始？（实操指南）**

别被大厂案例吓到。Harness Engineering 可以循序渐进。

![08-实操指南](https://developer.qcloudimg.com/http-save/yehe-1055266/361f40c22dfe9c90f1fd64effb1edde1.png)

08-实操指南

#### **Level 1：单人 Harness（1-2 小时搭建）**

适合：个人开发者，用 Cursor、Claude Code 等工具

**最小配置：**

1\. **项目规则文件**（`.cursorrules` 或 `CLAUDE.md`）

代码语言：javascript

AI代码解释

复制

```javascript

```

2\. **Pre-commit Hook**

代码语言：javascript

AI代码解释

复制

```javascript

```

3\. **测试套件**

- • 确保 Agent 能自己跑测试验证

4\. **清晰的目录结构**

- • 一致的命名规范

**效果**：防止最常见的 Agent 错误

* * *

#### **Level 2：团队 Harness（1-2 天搭建）**

适合：3-10 人团队

**在 Level 1 基础上增加：**

1\. **`AGENTS.md` 文件**（团队级约定）

代码语言：javascript

AI代码解释

复制

```javascript

```

2\. **CI 强制执行的架构约束**

- • 用 `madge` 检查循环依赖
- • 用自定义脚本检查分层规则

3\. **共享的 Prompt 模板**

- • "实现一个新 API"
- • "修复一个 bug"
- • "重构一个模块"

4\. **文档即代码**

- • 文档用 Markdown 写进代码库
- • Linter 检查文档是否过期

5\. **Agent 生成 PR 的审查清单**

- • 代码通过 linting
- • 测试覆盖率不下降
- • 文档已更新
- • 符合架构约束

**效果**：团队内 Agent 行为一致

* * *

#### **Level 3：生产级 Harness（1-2 周搭建）**

适合：工程组织，数十个并发 Agent

**在 Level 2 基础上增加：**

1. 1\. **自定义中间件层**
   - • 死循环检测
   - • 推理资源优化
2. 2\. **可观测性集成**
   - • Agent 能读取日志和指标
   - • Dashboard 监控 Agent 性能
3. 3\. **熵管理 Agent 调度**
   - • 每天凌晨运行文档检查
   - • 每周运行架构审计
4. 4\. **Harness 版本化和 A/B 测试**
   - • 不同项目用不同版本的 Harness
   - • 对比效果持续优化
5. 5\. **升级策略**
   - • Agent 卡住时自动通知人类
   - • 定义清晰的 escalation policy

**效果**：Agent 成为自主贡献者

* * *

### **07 血泪教训：这些坑别踩**

#### **坑一：过度设计控制流**

> _"如果你把控制流设计得太复杂，下一个模型更新就会让你的系统报废。"_

2024 年需要复杂 pipeline 实现的功能，2025 年模型一个 prompt 就能搞定。

**建议**：Harness 要设计成"可拆卸"的。当模型变聪明后，能轻松移除不必要的控制逻辑。

* * *

#### **坑二：把 Harness 当成静态系统**

Harness 需要 **持续演进**：

- • 模型能力提升了 → Harness 要简化
- • 团队规模扩大了 → Harness 要加强
- • 代码库变复杂了 → Harness 要增加约束

**建议**：每周回顾 Harness 的效果，持续迭代。

* * *

#### **坑三：忽视文档的"基础设施"属性**

很多人把 `AGENTS.md` 当成普通文档，写完就忘。

**大错特错。**

`AGENTS.md` 是 Harness 的核心组件，是 Agent 的"入职培训手册"。

**建议**：

- • 每次 Agent 犯错，都要更新 `AGENTS.md`
- • 把 `AGENTS.md` 当成代码一样维护
- • 用 Linter 检查文档是否过期

* * *

#### **坑四：约束不足或约束过度**

**约束不足**：Agent 漫无目的，产出混乱
**约束过度**：Agent 束手束脚，无法创新

**建议**：

- • 从最小约束集开始
- • 根据 Agent 的实际表现逐步调整
- • 定期问："这个约束还有必要吗？"

* * *

### **08 Harness Engineering 的底层思维**

#### **思维转变一：从"写代码"到"设计环境"**

![09-思维转变](https://developer.qcloudimg.com/http-save/yehe-1055266/19731d815d31d6d4a9ce47f291343242.png)

09-思维转变

传统工程师：

> _"这个功能我要怎么写？"_

Harness 工程师：

> _"我要设计什么样的环境，才能让 Agent reliably 写出这个功能？"_

**关注点从实现转移到赋能。**

* * *

#### **思维转变二：从"审查代码"到"审查系统"**

传统工程师：

> _"这段代码有没有 bug？"_

Harness 工程师：

> _"为什么 Harness 没有防止这个 bug？需要增加什么约束？"_

**关注点从单点错误转移到系统缺陷。**

* * *

#### **思维转变三：从"人适应工具"到"工具适应人"**

传统模式：

> _工程师学习怎么用 AI 工具_

Harness 模式：

> _AI 工具学习怎么在工程师的环境里工作_

**关注点从学习成本转移到环境设计。**

* * *

### **09 未来已来：工程师会被取代吗？**

回到最初的问题：

**Harness Engineering 会让工程师失业吗？**

答案是： **不会，但会重新定义"工程师"。**

#### **不会被取代的能力**

- • **系统设计能力**：设计 Harness 比写代码更难
- • **问题拆解能力**：把模糊需求变成清晰任务
- • **质量判断能力**：评估 Agent 输出的优劣
- • **架构演进能力**：随着业务发展调整 Harness

#### **会被淘汰的能力**

- • 纯体力型的 CRUD 代码
- • 没有创造力的重复劳动
- • 依赖记忆力的 API 调用

#### **未来的工程师画像**

更像是：

- • **产品经理**（定义要做什么）
- • **架构师**（设计怎么做）
- • **教练**（训练 Agent 做得更好）
- • **质检员**（确保输出质量）

**写代码的手速不重要了，设计系统的眼界变得重要。**

* * *

### **10 行动起来：你的第一个 Harness**

别等了。今天就可以开始。

![10-开始构建](https://developer.qcloudimg.com/http-save/yehe-1055266/637dbe30dcc7bba0c936e861a3c7cebf.png)

10-开始构建

#### **第一步（30 分钟）**

在你的项目根目录创建 `AGENTS.md`：

代码语言：javascript

AI代码解释

复制

```javascript

```

#### **第二步（1 小时）**

设置 Pre-commit Hook：

代码语言：javascript

AI代码解释

复制

```javascript

```

#### **第三步（持续进行）**

每次 Agent 犯错，就更新 `AGENTS.md`。

**一个月后，你会拥有一个越来越聪明的 Harness。**

* * *

### **最后说两句**

Harness Engineering 不是银弹。

但它代表了一个 **范式转移**：

**从"让人适应 AI"到"让 AI 适应人"。**

从"怎么用好工具"到"怎么设计环境"。

从"写代码"到"设计让代码能可靠生成的系统"。

2026 年了，别再只关注哪个模型更强。

**真正拉开差距的，是谁的 Harness 更聪明。**

* * *

**参考资料：**

- • OpenAI: Harness engineering: leveraging Codex in an agent-first world
- • Martin Fowler: Harness Engineering
- • The Emerging "Harness Engineering" Playbook - Artificial Ignorance
- • Harness Engineering: The Complete Guide - NxCode

* * *

**互动话题：**

你开始尝试 Harness Engineering 了吗？
在评论区分享你的实践经验或困惑！

**如果觉得有用，欢迎点赞、在看、转发三连！**

本文参与 [腾讯云自媒体同步曝光计划](https://cloud.tencent.com/developer/support-plan)，分享自微信公众号。

原始发表：2026-03-27，如有侵权请联系 [cloudcommunity@tencent.com](mailto:cloudcommunity@tencent.com) 删除

[openai](https://cloud.tencent.com/developer/tag/15053)

[编程](https://cloud.tencent.com/developer/tag/17183)

[工程师](https://cloud.tencent.com/developer/tag/17275)

[模型](https://cloud.tencent.com/developer/tag/17381)

[设计](https://cloud.tencent.com/developer/tag/17423)

本文分享自 码森林 微信公众号，前往查看

如有侵权，请联系 [cloudcommunity@tencent.com](mailto:cloudcommunity@tencent.com) 删除。

本文参与 [腾讯云自媒体同步曝光计划](https://cloud.tencent.com/developer/support-plan)  ，欢迎热爱写作的你一起参与！

[openai](https://cloud.tencent.com/developer/tag/15053)

[编程](https://cloud.tencent.com/developer/tag/17183)

[工程师](https://cloud.tencent.com/developer/tag/17275)

[模型](https://cloud.tencent.com/developer/tag/17381)

[设计](https://cloud.tencent.com/developer/tag/17423)

评论

登录后参与评论

暂无评论

登录 后参与评论

推荐阅读

编辑精选文章

换一批

[万字详解高可用架构设计\\
13755](https://cloud.tencent.com/developer/article/2485144)

[Go 开发者必备：Protocol Buffers 入门指南\\
9340](https://cloud.tencent.com/developer/article/2490247)

[10分钟带你彻底搞懂分布式链路跟踪\\
8153](https://cloud.tencent.com/developer/article/2493091)

[多租户的 4 种常用方案\\
12987](https://cloud.tencent.com/developer/article/2497507)

[亿级月活的社交 APP，陌陌如何做到 3 分钟定位故障？\\
10488](https://cloud.tencent.com/developer/article/2416967)

[60页PPT全解：DeepSeek系列论文技术要点整理\\
11532](https://cloud.tencent.com/developer/article/2505000)

[Harness Engineering：AI 原生软件开发的未来范式与职业指南](https://cloud.tencent.com/developer/article/2649503?policyId=1003)

[工作](https://cloud.tencent.com/developer/tag/17284) [软件开发](https://cloud.tencent.com/developer/tag/17421) [设计](https://cloud.tencent.com/developer/tag/17423) [产品](https://cloud.tencent.com/developer/tag/17210) [工程师](https://cloud.tencent.com/developer/tag/17275)

[2026年初，OpenAI 发布了一篇名为《Harness Engineering: leveraging Codex in an agent-first world》的技术博客，揭示了一个令人震惊的事实：他们的一个团队用 3 名工程师 + Codex 智能体，在 5 个月内交付了 100 万行代码 的产品，而没有一行代码是人工编写的。](https://cloud.tencent.com/developer/article/2649503?policyId=1003)

帐篷Li-物联网布道师

2026/04/02

5450

[AI 编程质量不够好，问题可能不在模型，在 Harness](https://cloud.tencent.com/developer/article/2649371?policyId=1003)

[工作](https://cloud.tencent.com/developer/tag/17284) [架构](https://cloud.tencent.com/developer/tag/17314) [模型](https://cloud.tencent.com/developer/tag/17381) [编程](https://cloud.tencent.com/developer/tag/17183) [工具](https://cloud.tencent.com/developer/tag/17276)

[用同一个模型，只改外面那层"壳"，编程基准成功率从 42% 跳到 78%。这是国外 Nate B Jones 今年做的研究，变量只有一个：Harness。](https://cloud.tencent.com/developer/article/2649371?policyId=1003)

Immerse

2026/04/02

650

![AI 编程质量不够好，问题可能不在模型，在 Harness](https://developer.qcloudimg.com/http-save/10011/dcb51ac850ff9c2da0bf31ede18ea962.jpg)

[AI 不是在抢我的工作：Harness 正在重构软件工程｜让 Agent 完成任何复杂任务](https://cloud.tencent.com/developer/article/2647499?policyId=1003)

[工作](https://cloud.tencent.com/developer/tag/17284) [模型](https://cloud.tencent.com/developer/tag/17381) [软件工程](https://cloud.tencent.com/developer/tag/17419) [重构](https://cloud.tencent.com/developer/tag/17593) [agent](https://cloud.tencent.com/developer/tag/11736)

[OpenAI 和 Anthropic 不约而同提出了 「Harness Engineering」（基础设施与脚手架），即驭缰工程。](https://cloud.tencent.com/developer/article/2647499?policyId=1003)

技术人生黄勇

2026/03/30

7480

![AI 不是在抢我的工作：Harness 正在重构软件工程｜让 Agent 完成任何复杂任务](https://developer.qcloudimg.com/http-save/10011/5bbb8f8cd8c5fe103ff33141e0dc266c.jpg)

[Harness Engineering 来了，SDD 还有意义吗？](https://cloud.tencent.com/developer/article/2647987?policyId=1003)

[工作](https://cloud.tencent.com/developer/tag/17284) [设计](https://cloud.tencent.com/developer/tag/17423) [系统](https://cloud.tencent.com/developer/tag/17506) [agent](https://cloud.tencent.com/developer/tag/11736) [服务](https://cloud.tencent.com/developer/tag/17264)

[最近，「Harness Engineering」这个概念在 AI 工程圈里热了起来——Mitchell Hashimoto（HashiCorp 联合创始人、Terraform 缔造者）和 OpenAI 工程团队相继发文，描述了一套「让 Agent 可靠工作」的工程方法论。与此同时，笔者也在实践一套规范驱动（SDD）的 AI Coding 工作流，核心投入在于构建一套完整的 Spec 体系——把系统的意图、契约、行为规范结构化地写进仓库，让 Agent 有据可查。](https://cloud.tencent.com/developer/article/2647987?policyId=1003)

腾讯云开发者

2026/03/31

6490

![Harness Engineering 来了，SDD 还有意义吗？](https://developer.qcloudimg.com/http-save/10011/26c14e5709201014c8356ce071c306dd.jpg)

[Harness Engineering 是什么？从上下文工程到驾驭工程](https://cloud.tencent.com/developer/article/2645208?policyId=1003)

[工程师](https://cloud.tencent.com/developer/tag/17275) [模型](https://cloud.tencent.com/developer/tag/17381) [设计](https://cloud.tencent.com/developer/tag/17423) [系统](https://cloud.tencent.com/developer/tag/17506) [优化](https://cloud.tencent.com/developer/tag/17554)

[Harness Engineering 驾驭工程：通过构建受控环境，让AI在约束下高效可靠地工作。](https://cloud.tencent.com/developer/article/2645208?policyId=1003)

mixlab

2026/03/25

6.9K0

![Harness Engineering 是什么？从上下文工程到驾驭工程](https://developer.qcloudimg.com/http-save/10011/0e86ce37397e33ff90a2ae61cd0a06f9.jpg)

[Agent 系列（三）：Harness Engineering](https://cloud.tencent.com/developer/article/2647887?policyId=1003)

[agent](https://cloud.tencent.com/developer/tag/11736) [接口](https://cloud.tencent.com/developer/tag/17329) [模型](https://cloud.tencent.com/developer/tag/17381) [设计](https://cloud.tencent.com/developer/tag/17423) [系统](https://cloud.tencent.com/developer/tag/17506)

[过去两年，AI 行业最热的词几乎一直在变。先是 Prompt Engineering，后来是 RAG、Agent、Context Engineering。每一次新概念出现，大家都会很自然地把注意力放在模型本身：怎么提问、怎么喂数据、怎么让模型更聪明。](https://cloud.tencent.com/developer/article/2647887?policyId=1003)

磊叔的技术博客

2026/03/30

1.1K0

![Agent 系列（三）：Harness Engineering](https://developer.qcloudimg.com/http-save/10011/0d66804a1ca164ab63f0a3a21de67dff.jpg)

[Context Engineering要过时？AI圈新风口「Harness Engineering」，OpenAI/Anthropic齐发力](https://cloud.tencent.com/developer/article/2648760?policyId=1003)

[LLM](https://cloud.tencent.com/developer/tag/17917)

[原文: https://mp.weixin.qq.com/s/O\_K5s6qjI7Kp\_eOU\_we4Fg欢迎关注公zh: AI-Frontiers](https://cloud.tencent.com/developer/article/2648760?policyId=1003)

AI-Frontiers

2026/04/01

2210

![Context Engineering要过时？AI圈新风口「Harness Engineering」，OpenAI/Anthropic齐发力](https://developer.qcloudimg.com/http-save/yehe-11939351/f4cc9ea4c2292f1835cd92c479b5132e.jpg)

[一文讲透如何构建Harness——六大组件全解析](https://cloud.tencent.com/developer/article/2648873?policyId=1003)

[系统](https://cloud.tencent.com/developer/tag/17506) [agent](https://cloud.tencent.com/developer/tag/11736) [工作](https://cloud.tencent.com/developer/tag/17284) [模型](https://cloud.tencent.com/developer/tag/17381) [文件系统](https://cloud.tencent.com/developer/tag/17504)

[裸模型有四大硬伤：无记忆、不能执行代码、知识过时、无工作环境。Harness 六大组件逐一补救——文件系统管存储与版本；沙箱赋予代码自验证；AGENTS.md 无需训练即可注入知识；Web Search+MCP 打破知识截止；上下文工程对抗信息腐烂；编排+Hooks 保障多 Agent 协同质量。System Prompt 贯穿始终，是整套系统的神经中枢。](https://cloud.tencent.com/developer/article/2648873?policyId=1003)

腾讯云开发者

2026/04/01

6160

![一文讲透如何构建Harness——六大组件全解析](https://developer.qcloudimg.com/http-save/10011/eff737a322bcaff73281e30a4dcfef3b.jpg)

[如何构建你自己的 Harness ——六大组件全解析](https://cloud.tencent.com/developer/article/2647559?policyId=1003)

[合肥同盟](https://cloud.tencent.com/developer/tag/18195)

[一句话摘要： 模型提供智能，Harness 让智能变得有用。如果你不是模型本身，那你就是 Harness 的一部分。](https://cloud.tencent.com/developer/article/2647559?policyId=1003)

技术流浪者

2026/03/30

1.2K0

![如何构建你自己的 Harness ——六大组件全解析](https://developer.qcloudimg.com/http-save/yehe-7660620/d88548698d971ba77b63ea479e7987c6.jpg)

[Harness Engineering-驾驭者工程-AI编程进行AI治理和大规模工程化阶段](https://cloud.tencent.com/developer/article/2646443?policyId=1003)

[基础](https://cloud.tencent.com/developer/tag/17302) [架构](https://cloud.tencent.com/developer/tag/17314) [自动化](https://cloud.tencent.com/developer/tag/10669) [编程](https://cloud.tencent.com/developer/tag/17183) [工程化](https://cloud.tencent.com/developer/tag/17274)

[今天准备聊一下 AI 治理和 AI 编程大规模工程化方面的一个话题。起因是前段时间 OpenAI 发表了一个实践案例，谈到由 3 个人经过 5 个月的时间，完全借助 Codex 编程工具，上线了一个上百万行代码的产品级项目。该项目基本上全部采用 Vibe Coding的模式，工程师没有手写一行代码，AI 自己完成了代码的编写、审核审计，包括相关问题的处理并完整上线。](https://cloud.tencent.com/developer/article/2646443?policyId=1003)

人月聊IT

2026/03/26

7390

![Harness Engineering-驾驭者工程-AI编程进行AI治理和大规模工程化阶段](https://developer.qcloudimg.com/http-save/10011/e16f7b8692035ecfcd86b06ee896b54c.jpg)

[Curate VS. Harness engineering](https://cloud.tencent.com/developer/article/2648202?policyId=1003)

[软件工程](https://cloud.tencent.com/developer/tag/17419) [数据](https://cloud.tencent.com/developer/tag/17440) [安全](https://cloud.tencent.com/developer/tag/10799) [工程师](https://cloud.tencent.com/developer/tag/17275) [模型](https://cloud.tencent.com/developer/tag/17381)

[Tips: 亲爱的朋友，微信推送规则一直在变化。如果你仅仅是“关注”，很可能无法收到推送。按照下图操作点击“福强私学”公众号名片，设为星标，就可以不错过文章啦。](https://cloud.tencent.com/developer/article/2648202?policyId=1003)

扶墙老师

2026/03/31

1000

![Curate VS. Harness engineering](https://developer.qcloudimg.com/http-save/10011/15f31999538daff0b4c83920c37ed048.jpg)

[一文读懂Harness Engineering：从14篇工程文章中，寻找那个让AI不再离经叛道的壳](https://cloud.tencent.com/developer/article/2649999?policyId=1003)

[人工智能](https://cloud.tencent.com/developer/tag/10539)

[今年三月，LangChain 发布了一篇题为《The Anatomy of an Agent Harness》的实证文章，彻底点燃了所有人的焦虑与狂热。他们在这份报告里引用了一个实验数据对比。仅仅是给同一个大语言模型换上一套更精巧的 Harness 架构，它在 Terminal Bench 2.0（一个专门衡量 AI 编程能力的权威榜单）上的通过率，直接从 52.8% 拉升到了 66.5%。](https://cloud.tencent.com/developer/article/2649999?policyId=1003)

小腾资讯君

2026/04/03

360

[从Vibe Coding到Harness Engineering的实践与思考](https://cloud.tencent.com/developer/article/2649349?policyId=1003)

[agent](https://cloud.tencent.com/developer/tag/11736) [编程](https://cloud.tencent.com/developer/tag/17183)

[上一篇文章《Multi-Agent系统Harness Engineering架构的思考与实践》我们从 agent 与 MAS 的技术脉络、单 agent 到多 agent 的工程化边界、协调拓扑选择，结合multi-agent项目实践整理，提出了一套针对multi-agent项目场景的harness engineering四层治理架构。这个项目的大部分代码也是用vibe coding实现和搭建的，在持续用 vibe coding 推进项目时，陆续也发现了不少问题，主要问题涉及存在helper、adapter、fallback在逐步膨胀，甚至成为与主路逻辑并列的实现， 还有不同的状态歧义也会从局部症状逐步升级为 ownership、同时还存在authority、contract、handoff等层次界限不清晰的问题，经过深度定位分析后，这些问题背后主要原因不是一开始架构没设计对或者某个模块没有按要求实现，而是使用vibe coding把项目代码实现推进得太快，而代码review和框架治理实际并没有跟上。结合使用vibe coding agent(主要是codex)搭建agent项目(已经有点自复制的意思了)的经验做了对应的思考和复盘，当一个项目开始长期依赖 vibe coding 推进时，最先发生变化的往往不是某一次明显报错的失败，而是没有被review到的隐藏问题逐渐积累叠加，系统开始越来越难回答一些架构层面的基本问题：谁在推进状态，谁在发布边界，谁在定义当前真值，谁又只是历史兼容路径的残留。短期看，这些问题会表现为 helper、adapter 和 fallback 等旁路逻辑的快速无序增长。从而长期看，它们会把问题推向项目运营的工程治理问题：如何为 agent 项目建立能够持续约束边界、契约和演化方向的 harness。到了这个阶段，harness 已经不再只是架构图上的抽象名词，也不是某个 SDK 的外壳，或者作为一个抽象的概念存在。它开始转向更具体的工程治理工作，目标是如何让agent系统在长期演化里仍然守住架构不同层之间的边界、契约和协同，让vibe coding agent交付的工程项目保持在相对受控的范围内进行持续迭代和进化，这也是harness在vibe coding场景应用的价值意义之所在。## 失控不是从代码开始的](https://cloud.tencent.com/developer/article/2649349?policyId=1003)

小陡坡香菜

2026/04/02

2690

![从Vibe Coding到Harness Engineering的实践与思考](https://developer.qcloudimg.com/http-save/yehe-2057355/69c619bef3b10ff6ad3f350d2741d0ff.jpg)

[程序员不许写代码！OpenAI硬核实验：3人指挥AI，5个月造出百万行](https://cloud.tencent.com/developer/article/2649719?policyId=1003)

[程序员](https://cloud.tencent.com/developer/tag/17217) [工作](https://cloud.tencent.com/developer/tag/17284) [架构](https://cloud.tencent.com/developer/tag/17314) [系统](https://cloud.tencent.com/developer/tag/17506) [openai](https://cloud.tencent.com/developer/tag/15053)

[一支最初3人的工程师团队，利用Codex智能体在5个月内从零造出了一个「百万行代码产品」。](https://cloud.tencent.com/developer/article/2649719?policyId=1003)

OpenCV学堂

2026/04/02

430

![程序员不许写代码！OpenAI硬核实验：3人指挥AI，5个月造出百万行](https://developer.qcloudimg.com/http-save/10011/1e5467ec82c029701450ef94cc655438.jpg)

[Codex Windows 客户端来了，深读官方文档后我有 5 个判断](https://cloud.tencent.com/developer/article/2646833?policyId=1003)

[测试](https://cloud.tencent.com/developer/tag/17205) [工作](https://cloud.tencent.com/developer/tag/17284) [客户端](https://cloud.tencent.com/developer/tag/17346) [windows](https://cloud.tencent.com/developer/tag/10806) [官方文档](https://cloud.tencent.com/developer/tag/137)

[OpenAI 一周四连发，没想到大家对Codex Windows 端的兴趣超过了 GPT-5.4-Thinking](https://cloud.tencent.com/developer/article/2646833?policyId=1003)

Ai学习的老章

2026/03/27

7090

![Codex Windows 客户端来了，深读官方文档后我有 5 个判断](https://developer.qcloudimg.com/http-save/10011/40dc0517febbdf62f5e97ead7afd20dc.jpg)

[从 OpenClaw 到 Android：Harness Engineering 是怎么让 Agent 变得可用的](https://cloud.tencent.com/developer/article/2649397?policyId=1003)

[模型](https://cloud.tencent.com/developer/tag/17381) [设计](https://cloud.tencent.com/developer/tag/17423) [android](https://cloud.tencent.com/developer/tag/10216) [agent](https://cloud.tencent.com/developer/tag/11736) [工具](https://cloud.tencent.com/developer/tag/17276)

[• 腾讯持续引进字节 Seed 大模型基础设施骨干，向姚顺雨汇报，混元团队大幅补充研发力量。](https://cloud.tencent.com/developer/article/2649397?policyId=1003)

陆业聪

2026/04/02

780

![从 OpenClaw 到 Android：Harness Engineering 是怎么让 Agent 变得可用的](https://developer.qcloudimg.com/http-save/10011/80f14ccd0f16e38b1f68b1496f003cd0.jpg)

[Harness Engineering 给我的启发：用 AI 做 Android 需求，怎么不翻车](https://cloud.tencent.com/developer/article/2649398?policyId=1003)

[模型](https://cloud.tencent.com/developer/tag/17381) [android](https://cloud.tencent.com/developer/tag/10216) [工具](https://cloud.tencent.com/developer/tag/17276) [工作](https://cloud.tencent.com/developer/tag/17284) [开发](https://cloud.tencent.com/developer/tag/17337)

[• Anthropic 发布多 Agent 协作研究系统，支持并行子任务分发与跨 Agent 结果汇总，适用于长文研究场景，Agent 协同正成为新范式。](https://cloud.tencent.com/developer/article/2649398?policyId=1003)

陆业聪

2026/04/02

930

![Harness Engineering 给我的启发：用 AI 做 Android 需求，怎么不翻车](https://developer.qcloudimg.com/http-save/10011/974ff0b76eee93cde37d7a82e2484d40.jpg)

[AI 工程化落地实践：推翻"完美架构"，回归提示词本质](https://cloud.tencent.com/developer/article/2631822?policyId=1003)

[工作](https://cloud.tencent.com/developer/tag/17284) [架构](https://cloud.tencent.com/developer/tag/17314) [实践](https://cloud.tencent.com/developer/tag/17428) [工程化](https://cloud.tencent.com/developer/tag/17274) [工具](https://cloud.tencent.com/developer/tag/17276)

[那时候，团队刚开始系统性地探索 AI 辅助开发。我们读了大量论文和博客，看到业界在讨论"多智能体协作"、"Agent 编排"、"知识图谱"……我们想：既然要做，就做一套"正经"的架构。](https://cloud.tencent.com/developer/article/2631822?policyId=1003)

腾讯云开发者

2026/02/27

5340

![AI 工程化落地实践：推翻"完美架构"，回归提示词本质](https://developer.qcloudimg.com/http-save/10011/89e9e455d0976c6fdcc6f6c05dfa10bd.jpg)

[编程革命彻底爆发！刚刚，OpenAI最强智能体上线ChatGPT](https://cloud.tencent.com/developer/article/2521079?policyId=1003)

[模型](https://cloud.tencent.com/developer/tag/17381) [chatgpt](https://cloud.tencent.com/developer/tag/12537) [openai](https://cloud.tencent.com/developer/tag/15053) [编程](https://cloud.tencent.com/developer/tag/17183) [测试](https://cloud.tencent.com/developer/tag/17205)

[刚刚，Greg Brockman带队与OpenAI六人团队开启线上直播，震撼发布了一款云端AI编程智能体——Codex。](https://cloud.tencent.com/developer/article/2521079?policyId=1003)

新智元

2025/05/17

5040

![编程革命彻底爆发！刚刚，OpenAI最强智能体上线ChatGPT](https://developer.qcloudimg.com/http-save/10011/f245d88a7f20d6e74bc291dbd1e1f896.jpg)

[Harness Engineering 最佳实践：长运行多智能体的框架设计](https://cloud.tencent.com/developer/article/2647567?policyId=1003)

[agent](https://cloud.tencent.com/developer/tag/11736) [软件架构模式](https://cloud.tencent.com/developer/tag/17884)

[当我们第一次把一个复杂需求丢给单个 Claude 实例时，结果往往令人失望。给它 20 分钟、花费 $9，它也许能生成一个"看起来像那么回事"的骨架。但仔细检查你会发现：游戏逻辑不能运行，API 接口互相矛盾，安全漏洞随处可见。这不是模型能力的问题，而是认知架构的问题。](https://cloud.tencent.com/developer/article/2647567?policyId=1003)

童子龙

2026/03/30

3.4K4

推荐阅读

编辑精选文章

[Java与Go差别在哪，谁要被时代抛弃？](https://cloud.tencent.com/developer/article/2505975) [MCP协议详解：一文读懂跨时代的模型上下文协议](https://cloud.tencent.com/developer/article/2508227) [一文掌握 MCP 上下文协议：从理论到实践](https://cloud.tencent.com/developer/article/2509998)

相关讨论

[cpu 100%,腾讯这服务器有点垃圾，这是什么玩意？杀都杀不死？](https://cloud.tencent.com/developer/ask/129642) [如何注册openai账户？](https://cloud.tencent.com/developer/ask/2103702) [什么工程师服务不好？](https://cloud.tencent.com/developer/ask/25045)

相关课程

[AI代码助手快速上手训练营](https://cloud.tencent.com/developer/learning/camp/22) [AI绘画-StableDiffusion图像生成](https://cloud.tencent.com/developer/learning/camp/19) [前端](https://cloud.tencent.com/developer/learning/graph/8)

[Harness Engineering：AI 原生软件开发的未来范式与职业指南](https://cloud.tencent.com/developer/article/2649503?policyId=1003)

5450

[AI 编程质量不够好，问题可能不在模型，在 Harness](https://cloud.tencent.com/developer/article/2649371?policyId=1003)

650

[AI 不是在抢我的工作：Harness 正在重构软件工程｜让 Agent 完成任何复杂任务](https://cloud.tencent.com/developer/article/2647499?policyId=1003)

7480

[2026采购季 \| AI焕新·智启新局](https://cloud.tencent.com/act/pro/featured-202604?from=21344&from_column=21344)

消息队列

[产品介绍](https://cloud.tencent.com/product/message-queue-catalog?from=21341&from_column=21341)

[2026采购季 \| AI焕新·智启新局](https://cloud.tencent.com/act/pro/featured-202604?from=21344&from_column=21344)

数据库

[产品介绍](https://cloud.tencent.com/product/tencentdb-catalog?from=21341&from_column=21341)

[2026采购季 \| AI焕新·智启新局](https://cloud.tencent.com/act/pro/featured-202604?from=21344&from_column=21344)

云数据库 PostgreSQL

[产品介绍](https://cloud.tencent.com/product/postgres?from=21341&from_column=21341)[产品文档](https://cloud.tencent.com/document/product/409?from=21342&from_column=21342)

[Harness Engineering 来了，SDD 还有意义吗？](https://cloud.tencent.com/developer/article/2647987?policyId=1003)

6490

[Harness Engineering 是什么？从上下文工程到驾驭工程](https://cloud.tencent.com/developer/article/2645208?policyId=1003)

6.9K0

[Agent 系列（三）：Harness Engineering](https://cloud.tencent.com/developer/article/2647887?policyId=1003)

1.1K0

[Context Engineering要过时？AI圈新风口「Harness Engineering」，OpenAI/Anthropic齐发力](https://cloud.tencent.com/developer/article/2648760?policyId=1003)

2210

广告

AIGC及大模型加速场景解决方案

[一文讲透如何构建Harness——六大组件全解析](https://cloud.tencent.com/developer/article/2648873?policyId=1003)

6160

[如何构建你自己的 Harness ——六大组件全解析](https://cloud.tencent.com/developer/article/2647559?policyId=1003)

1.2K0

[Harness Engineering-驾驭者工程-AI编程进行AI治理和大规模工程化阶段](https://cloud.tencent.com/developer/article/2646443?policyId=1003)

7390

[Curate VS. Harness engineering](https://cloud.tencent.com/developer/article/2648202?policyId=1003)

1000

[一文读懂Harness Engineering：从14篇工程文章中，寻找那个让AI不再离经叛道的壳](https://cloud.tencent.com/developer/article/2649999?policyId=1003)

360

[从Vibe Coding到Harness Engineering的实践与思考](https://cloud.tencent.com/developer/article/2649349?policyId=1003)

2690

[程序员不许写代码！OpenAI硬核实验：3人指挥AI，5个月造出百万行](https://cloud.tencent.com/developer/article/2649719?policyId=1003)

430

[Codex Windows 客户端来了，深读官方文档后我有 5 个判断](https://cloud.tencent.com/developer/article/2646833?policyId=1003)

7090

[从 OpenClaw 到 Android：Harness Engineering 是怎么让 Agent 变得可用的](https://cloud.tencent.com/developer/article/2649397?policyId=1003)

780

[Harness Engineering 给我的启发：用 AI 做 Android 需求，怎么不翻车](https://cloud.tencent.com/developer/article/2649398?policyId=1003)

930

[AI 工程化落地实践：推翻"完美架构"，回归提示词本质](https://cloud.tencent.com/developer/article/2631822?policyId=1003)

5340

[编程革命彻底爆发！刚刚，OpenAI最强智能体上线ChatGPT](https://cloud.tencent.com/developer/article/2521079?policyId=1003)

5040

[Harness Engineering 最佳实践：长运行多智能体的框架设计](https://cloud.tencent.com/developer/article/2647567?policyId=1003)

3.4K4

[码森林](https://cloud.tencent.com/developer/user/1055266) 0

LV.1

这个人很懒，什么都没有留下～

关注

[文章\\
\\
48](https://cloud.tencent.com/developer/user/1055266/articles) [获赞\\
\\
129](https://cloud.tencent.com/developer/user/1055266)

专栏

2

作者相关精选

换一批

- [你的龙虾 🦞 居然比你更健忘？OpenClaw 记忆系统完全指南，让它永远记住你](https://cloud.tencent.com/developer/article/2648312)
- [用了一下午浪费¥2.4，我终于跑通了自动化生图](https://cloud.tencent.com/developer/article/2648321)
- [同事问我为什么最近下班这么早？我偷偷用了这个编程神器！](https://cloud.tencent.com/developer/article/2648315)

目录

- 01 一个颠覆认知的事实

- 02 什么是 Harness Engineering？

  - 一个绝妙的比喻

  - 正式定义

- 03 为什么现在必须关注 Harness Engineering？

  - 残酷的现实：模型已经卷不动了

  - 真实案例：LangChain 的逆袭

- 04 Harness Engineering 的三大支柱（核心干货）

  - 支柱一：上下文工程（Context Engineering）

    - 静态上下文（写进代码库的）

    - 动态上下文（运行时提供的）

    - 关键洞察

  - 支柱二：架构约束（Architectural Constraints）

    - 典型的分层架构

    - 怎么执行？

    - 为什么约束反而提高效率？

  - 支柱三：熵管理（Entropy Management / Garbage Collection）

    - 什么是熵？

    - 怎么管理？

- 05 大公司都在怎么实践？

  - OpenAI：零人工代码模式

  - Stripe：规模化"小跟班"

  - LangChain：中间件优先

- 06 普通人怎么开始？（实操指南）

  - Level 1：单人 Harness（1-2 小时搭建）

  - Level 2：团队 Harness（1-2 天搭建）

  - Level 3：生产级 Harness（1-2 周搭建）

- 07 血泪教训：这些坑别踩

  - 坑一：过度设计控制流

  - 坑二：把 Harness 当成静态系统

  - 坑三：忽视文档的"基础设施"属性

  - 坑四：约束不足或约束过度

- 08 Harness Engineering 的底层思维

  - 思维转变一：从"写代码"到"设计环境"

  - 思维转变二：从"审查代码"到"审查系统"

  - 思维转变三：从"人适应工具"到"工具适应人"

- 09 未来已来：工程师会被取代吗？

  - 不会被取代的能力

  - 会被淘汰的能力

  - 未来的工程师画像

- 10 行动起来：你的第一个 Harness

  - 第一步（30 分钟）

  - 第二步（1 小时）

  - 第三步（持续进行）

- 最后说两句

交个朋友


加入腾讯云官网粉丝站


蹲全网底价单品 享第一手活动信息


![](https://cs.cloud.tencent.com/group1/M00/2E/70/C6E9n2gN0X-ACMf9AAAeCb2HQQE475.png)

[![](https://dscache.tencent-cloud.cn/upload/nodir/3%E6%96%87%E7%AB%A0%E8%AF%A6%E6%83%85%E9%A1%B5-%E4%BE%A7%E8%BE%B9%E6%A0%8F686-194-fa3bf5f1f7d426ed3bd6366e80b58ac5c5154313.jpg)广告](https://cloud.tencent.com/act/pro/openclaw-in-adp?ad_trace=fdd91f2e2d6745b4af83fa3a2f9e712e&from=29658&from_column=29658)

相关产品与服务

消息队列

腾讯云消息队列 TDMQ 是腾讯云自主研发的消息中间件产品系列，作为分布式系统中的关键组件，具备稳定可靠、高弹性、低成本的特性，提供异步通信的基础能力，通过应用解耦降低系统复杂度，提升系统可用性和可扩展性。兼容开源主流协议，包含 CKafka、RocketMQ、RabbitMQ、Pulsar、MQTT 五大子产品，覆盖在线（电商交易、社交直播等）、离线场景（大数据、日志监控等）和设备端场景（物联网、车联网等），满足金融、互联网、教育、物流、能源等不同行业和场景的需求。

[产品介绍](https://cloud.tencent.com/product/message-queue-catalog?from=21341&from_column=21341)

[2026采购季 \| AI焕新·智启新局](https://cloud.tencent.com/act/pro/featured-202604?from=21344&from_column=21344)

加入讨论

[的问答专区 >](https://cloud.tencent.com/developer/ask)

[熊猫钓鱼](https://cloud.tencent.com/developer/user/11543487) 0

程序员擅长1个领域

提问

- [cpu 100%,腾讯这服务器有点垃圾，这是什么玩意？杀都杀不死？](https://cloud.tencent.com/developer/ask/129642)
- [如何注册openai账户？](https://cloud.tencent.com/developer/ask/2103702)
- [什么工程师服务不好？](https://cloud.tencent.com/developer/ask/25045)

相关课程

[一站式学习中心 >](https://cloud.tencent.com/developer/learning)

[云开发微搭低代码平台-一人构建企业级应用实战训练营\\
\\
3780人在学](https://cloud.tencent.com/developer/learning/camp/27)

[腾讯云微搭低代码](https://cloud.tencent.com/developer/tag/17874)

[云开发](https://cloud.tencent.com/developer/tag/10923)

[AI代码助手快速上手训练营\\
\\
1986人在学](https://cloud.tencent.com/developer/learning/camp/22)

[腾讯云代码助手](https://cloud.tencent.com/developer/tag/18047)

[AI绘画-StableDiffusion图像生成\\
\\
1763人在学](https://cloud.tencent.com/developer/learning/camp/19)

[腾讯混元生图](https://cloud.tencent.com/developer/tag/17609)

[高性能应用服务](https://cloud.tencent.com/developer/tag/17993)

领券

- ### 社区



  - [技术文章](https://cloud.tencent.com/developer/column)
  - [技术问答](https://cloud.tencent.com/developer/ask)
  - [技术沙龙](https://cloud.tencent.com/developer/salon)
  - [技术视频](https://cloud.tencent.com/developer/video)
  - [学习中心](https://cloud.tencent.com/developer/learning)
  - [技术百科](https://cloud.tencent.com/developer/techpedia)
  - [技术专区](https://cloud.tencent.com/developer/zone/list)

- ### 活动



  - [自媒体同步曝光计划](https://cloud.tencent.com/developer/support-plan)
  - [邀请作者入驻](https://cloud.tencent.com/developer/support-plan-invitation)
  - [自荐上首页](https://cloud.tencent.com/developer/article/1535830)
  - [技术竞赛](https://cloud.tencent.com/developer/competition)

- ### 圈层



  - [腾讯云最具价值专家](https://cloud.tencent.com/tvp)
  - [腾讯云架构师技术同盟](https://cloud.tencent.com/developer/program/tm)
  - [腾讯云创作之星](https://cloud.tencent.com/developer/program/tci)
  - [腾讯云TDP](https://cloud.tencent.com/developer/program/tdp)

- ### 关于



  - [社区规范](https://cloud.tencent.com/developer/article/1006434)
  - [免责声明](https://cloud.tencent.com/developer/article/1006435)
  - [联系我们](mailto:cloudcommunity@tencent.com)
  - [友情链接](https://cloud.tencent.com/developer/friendlink)
  - [MCP广场开源版权声明](https://cloud.tencent.com/developer/article/2537547)

### 腾讯云开发者

![扫码关注腾讯云开发者](https://qcloudimg.tencent-cloud.cn/raw/a8907230cd5be483497c7e90b061b861.png?imageView2/2/w/200)

扫码关注腾讯云开发者

领取腾讯云代金券

### 热门产品

- [域名注册](https://cloud.tencent.com/product/domain?from=20064&from_column=20064)
- [云服务器](https://cloud.tencent.com/product/cvm?from=20064&from_column=20064)
- [区块链服务](https://cloud.tencent.com/product/tbaas?from=20064&from_column=20064)
- [消息队列](https://cloud.tencent.com/product/message-queue-catalog?from=20064&from_column=20064)
- [网络加速](https://cloud.tencent.com/product/ecdn?from=20064&from_column=20064)
- [云数据库](https://cloud.tencent.com/product/tencentdb-catalog?from=20064&from_column=20064)
- [域名解析](https://cloud.tencent.com/product/dns?from=20064&from_column=20064)
- [云存储](https://cloud.tencent.com/product/cos?from=20064&from_column=20064)
- [视频直播](https://cloud.tencent.com/product/css?from=20064&from_column=20064)

### 热门推荐

- [人脸识别](https://cloud.tencent.com/product/facerecognition?from=20064&from_column=20064)
- [腾讯会议](https://cloud.tencent.com/product/tm?from=20064&from_column=20064)
- [企业云](https://cloud.tencent.com/act/pro/enterprise2022?from=20064&from_column=20064)
- [CDN加速](https://cloud.tencent.com/product/cdn?from=20064&from_column=20064)
- [视频通话](https://cloud.tencent.com/product/trtc?from=20064&from_column=20064)
- [图像分析](https://cloud.tencent.com/product/imagerecognition?from=20064&from_column=20064)
- [MySQL 数据库](https://cloud.tencent.com/product/cdb?from=20064&from_column=20064)
- [SSL 证书](https://cloud.tencent.com/product/ssl?from=20064&from_column=20064)
- [语音识别](https://cloud.tencent.com/product/asr?from=20064&from_column=20064)

### 更多推荐

- [数据安全](https://cloud.tencent.com/solution/data_protection?from=20064&from_column=20064)
- [负载均衡](https://cloud.tencent.com/product/clb?from=20064&from_column=20064)
- [短信](https://cloud.tencent.com/product/sms?from=20064&from_column=20064)
- [文字识别](https://cloud.tencent.com/product/ocr?from=20064&from_column=20064)
- [云点播](https://cloud.tencent.com/product/vod?from=20064&from_column=20064)
- [大数据](https://cloud.tencent.com/product/bigdata-class?from=20064&from_column=20064)
- [小程序开发](https://cloud.tencent.com/solution/la?from=20064&from_column=20064)
- [网站监控](https://cloud.tencent.com/product/tcop?from=20064&from_column=20064)
- [数据迁移](https://cloud.tencent.com/product/cdm?from=20064&from_column=20064)

Copyright © 2013 - 2026 Tencent Cloud. All Rights Reserved. 腾讯云 版权所有

[深圳市腾讯计算机系统有限公司](https://qcloudimg.tencent-cloud.cn/raw/986376a919726e0c35e96b311f54184d.jpg) ICP备案/许可证号： [粤B2-20090059](https://beian.miit.gov.cn/#/Integrated/index)![](https://qcloudimg.tencent-cloud.cn/raw/eed02831a0e201b8d794c8282c40cf2e.png) [粤公网安备44030502008569号](https://beian.mps.gov.cn/#/query/webSearch?code=44030502008569)

[腾讯云计算（北京）有限责任公司](https://qcloudimg.tencent-cloud.cn/raw/a2390663ee4a95ceeead8fdc34d4b207.jpg) 京ICP证150476号 \|  [京ICP备11018762号](https://beian.miit.gov.cn/#/Integrated/index)

[问题归档](https://cloud.tencent.com/developer/ask/archives.html) [专栏文章](https://cloud.tencent.com/developer/column/archives.html) [快讯文章归档](https://cloud.tencent.com/developer/news/archives.html) [关键词归档](https://cloud.tencent.com/developer/information/all.html) [开发者手册归档](https://cloud.tencent.com/developer/devdocs/archives.html) [开发者手册 Section 归档](https://cloud.tencent.com/developer/devdocs/sections_p1.html)

Copyright © 2013 - 2026 Tencent Cloud.

All Rights Reserved. 腾讯云 版权所有

登录 后参与评论

1

目录

100

推荐

[首页](https://cloud.tencent.com/developer)

[MCP广场![](https://qccommunity.qcloudimg.com/image/new.png)](https://cloud.tencent.com/developer/mcp)

[返回腾讯云官网](https://cloud.tencent.com/?from=20060&from_column=20060)

[首页](https://cloud.tencent.com/developer)

[MCP广场![](https://qccommunity.qcloudimg.com/image/new.png)](https://cloud.tencent.com/developer/mcp)

[返回腾讯云官网](https://cloud.tencent.com/?from=20060&from_column=20060)