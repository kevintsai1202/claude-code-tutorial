[![](https://img-home.csdnimg.cn/images/20201124032511.png)](https://www.csdn.net/)

- [博客](https://blog.csdn.net/)
- [下载](https://download.csdn.net/)
- [社区](https://devpress.csdn.net/)
- [![](https://img-home.csdnimg.cn/images/20240829093757.png)AtomGit](https://link.csdn.net/?target=https%3A%2F%2Fgitcode.com%3Futm_source%3Dcsdn_toolbar)
- [![](https://i-operation.csdnimg.cn/images/3c66245675ae423e9cc897dc790b8ac9.png)GPU算力\\
![](https://i-operation.csdnimg.cn/images/b4db3100c53e4a7c9fd6a3d647156191.png)](https://ai.csdn.net/)
- 更多


[会议](https://www.bagevent.com/event/9117243 "会议") [学习](https://edu.csdn.net/?utm_source=zhuzhantoolbar "高质量课程·大会云会员") [![](https://i-operation.csdnimg.cn/images/77c4dd7a760a493498bee1d336b064c0.png)InsCode](https://inscode.net/?utm_source=csdn_blog_top_bar "InsCode")


搜索

AI 搜索

登录

登录后您可以：

- 复制代码和一键运行
- 与博主大V深度互动
- 解锁海量精选资源
- 获取前沿技术资讯

立即登录

[会员·新人礼包 ![](https://i-operation.csdnimg.cn/images/105eda9d414f4250a7c3fe45be3cd15f.png)](https://mall.csdn.net/vip?utm_source=vip_toolbarhyzx_hy)

[消息](https://i.csdn.net/#/msg/index)

[创作中心](https://mp.csdn.net/ "创作中心")

[创作](https://mp.csdn.net/edit)

[![](https://i-operation.csdnimg.cn/images/6e41bd372d1f4ec39b3cd36ab95046c4.png)](https://mp.csdn.net/edit)![](https://i-operation.csdnimg.cn/images/43349e98a45341699652b0b6fa4ea541.png)![](https://i-operation.csdnimg.cn/images/0f13ec529b6b4195ad99894f76653e56.png)

# AI圈突然都在说Harness，它到底是什么？一篇给你讲透

最新推荐文章于 2026-04-01 14:13:13 发布

原创于 2026-03-30 20:52:08 发布·2.5k 阅读

·![](https://csdnimg.cn/release/blogv2/dist/pc/img/newHeart2023Active.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/newHeart2023Black.png)
15


·![](https://csdnimg.cn/release/blogv2/dist/pc/img/tobarCollect2.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/tobarCollectionActive2.png)
13
·

CC 4.0 BY-SA版权

版权声明：本文为博主原创文章，遵循 [CC 4.0 BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) 版权协议，转载请附上原文出处链接和本声明。


文章标签：

[#人工智能](https://so.csdn.net/so/search/s.do?q=%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [#服务器](https://so.csdn.net/so/search/s.do?q=%E6%9C%8D%E5%8A%A1%E5%99%A8&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [#运维](https://so.csdn.net/so/search/s.do?q=%E8%BF%90%E7%BB%B4&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [#大数据](https://so.csdn.net/so/search/s.do?q=%E5%A4%A7%E6%95%B0%E6%8D%AE&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [#java](https://so.csdn.net/so/search/s.do?q=java&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [#算法](https://so.csdn.net/so/search/s.do?q=%E7%AE%97%E6%B3%95&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art) [#面试](https://so.csdn.net/so/search/s.do?q=%E9%9D%A2%E8%AF%95&t=all&o=vip&s=&l=&f=&viparticle=&from_tracking_code=tag_word&from_code=app_blog_art)

![](https://devpress.csdnimg.cn/8bc8dd1a2bc24184a16a142654c4a49e.png)AtomGit开源社区文章已被社区收录

加入社区

最近在AI圈子里频繁看到Harness这个词，翻译成中文就是“驾驭/利用”，这让我联想到了马，恰好今年又是马年，也许它的“火”就是冥冥注定。

今天这篇文章跟大家拆解一下Harness到底是什么。

一、为什么Harness突然火了

这个词在2025年末到2026年初明显升温。

Anthropic在2025年11月就已经公开讨论“long-running agents”的effective harnesses，核心问题是：agent 做长任务会跨多个上下文窗口，而每次新会话都像“一个新工程师接班”， **没有之前发生过什么的记忆**。

到2026年2月，Mitchell Hashimoto在自己的文章里直接把一个阶段命名为 **“Engineer the Harness”**；几天后，OpenAI又发布了 **“Harness engineering”**，把这个概念进一步推到台前。

也就是说，行业开始意识到：2025年大家比的是模型和prompt；2026年开始，真正拉开差距的是模型外面的系统设计。 这就是harness变热的根本原因。这个判断能从OpenAI 和Anthropic的工程文章里直接看出来。

总之，它是大佬们提出的概念，大家伙自然会追捧，然后大佬说的好像还是蛮有道理的，关键是觉得它“牛逼”，所以它就火了！

### 二、Harness到底是什么

一个更工程化的定义是：

**Harness = 围绕LLM/agent的执行与治理层。**

Salesforce的定义很直白：agent harness是一层operational software layer，负责管理AI的 **tools、memory、safety**，从而让autonomous task execution更可靠。

OpenAI的表述更偏工程实现：

在Codex体系里，harness包含 **core agent loop + execution logic + client/runtime integration**；它不是单次对话，而是一个能驱动工具调用、状态流转、事件流、客户端交互的长期运行系统。

所以，harness不是一个具体模型，也不是一句prompt，更不是某个单独框架。

它更像这几个东西的合体：

- agent runtime
- tool orchestrator
- memory/state manager
- permission/safety wrapper
- failure recovery system
- human approval/workflow layer

这些拼在一起，才叫harness。

### 三、和prompt、workflow、agent、framework的关系

最容易混淆的是这四个：

#### 1) 它不是prompt

Prompt只是给模型的文字说明。

Harness则负责：什么时候给什么prompt、何时压缩上下文、何时调用工具、失败后怎么恢复、哪些动作需要审批。

#### 2) 它不等于agent

Aent 通常指“会规划、会调用工具、会迭代执行”的智能体行为。

Harness则是 **agent背后的基础设施**。OpenAI把agent loop视为harness的核心逻辑之一，但完整harness还包括更多supporting features和runtime结构。

#### 3) 它不等于framework

框架更像“开发工具箱”；

Harness 更像“真正跑在线上的运行环境”。

Salesforce 明确区分了：framework提供构建agent的库，而harness是现实世界里约束、管理和运行agent的实际runtime system。

#### 4) 它也不只是workflow

Workflow 是流程；

Harness不仅管流程，还管 **状态、记忆、权限、恢复、验证、日志、审批、客户端协议**。

### 四、一个harness里通常包含什么

![](https://i-blog.csdnimg.cn/img_convert/f22821c1a8c15f3074c86407bdea7dc6.jpeg)

结合OpenAI、Anthropic、Salesforce的公开工程文章，一个成熟harness 大致会有这几层：

#### 1) Agent loop

就是“用户输入 → 模型思考 → 请求工具 → 执行工具 → 观察结果 → 再思考 → 输出”的循环。OpenAI把这称作Codex的核心逻辑。

#### 2) Tool layer

给模型接上shell、代码编辑、浏览器、数据库、API、文件系统等能力，并校验工具调用是否合法、参数是否正确。没有这层，模型只能聊天。

#### 3) Memory / state

保存中间状态、任务进度、摘要、待办、检查点。这是解决长任务“做着做着就忘了”的关键。Anthropic讲得很清楚：跨context window工作的agent必须弥补“新会话没有前情记忆”的问题。

#### 4) Safety / permissions

限制模型能访问什么、能改什么、什么动作必须审批、怎么过滤输入输出。Salesforce直接把harness描述成model的security wrapper。

#### 5) Lifecycle / recovery

任务崩了能不能续跑，重启后能不能接着干，长任务能不能跨小时甚至跨天继续。Salesforce把这叫lifecycle and state management。

#### 6) Client/runtime integration

尤其在产品化场景里，harness还要对接CLI、IDE、Web、后台容器。OpenAI的Codex App Server就是在做这件事：把harness以稳定协议暴露给不同客户端。

五、Harness Engineering又是什么

既然harness是那层运行系统，Harness Engineering 就是专门设计和迭代这层系统的工程实践。

OpenAI在2026年2月把它明确写成主题，核心思想不是“怎么把prompt写得更花”，而是：

- 怎么让仓库对agen 更可读
- 怎么把知识沉淀到repo里
- 怎么通过反馈回路让agent持续纠错
- 怎么控制“熵增”和系统漂移
- 怎么让humans steer, agents execute

所以你可以把Harness Engineering 理解成：从“提示工程”升级到“智能体运行系统工程”。

### Harness Engineering和过去的“Prompt Engineering / Context Engineering”有什么区别呢？

- **Prompt engineering**：教模型这一轮怎么答
- **Context engineering**：给模型这一轮喂什么上下文
- **Harness engineering**：设计整个系统，让模型在很多轮、很多工具、很长时间里都能稳定完成任务

![](https://i-blog.csdnimg.cn/img_convert/ca5d5bb964a44a1a66be1c922f073985.jpeg)

也就是说，harness关心的是 **连续执行能力**，而不只是单轮输出质量。这个区别在OpenAI对agent loop/app server的描述，以及Anthropic对long-running agents的描述里都提到了。

最后再总结一下： Harness不是新模型，也不是新框架，而是“大模型外面的那层执行与治理系统”。它负责把会推理的LLM变成能长期、稳定、安全完成任务的agent。

### 学AI大模型的正确顺序，千万不要搞错了

🤔2026年AI风口已来！各行各业的AI渗透肉眼可见，超多公司要么转型做AI相关产品，要么高薪挖AI技术人才，机遇直接摆在眼前！

有往AI方向发展，或者本身有后端编程基础的朋友，直接冲AI大模型应用开发转岗超合适！

就算暂时不打算转岗，了解大模型、RAG、Prompt、Agent这些热门概念，能上手做简单项目，也绝对是求职加分王🔋

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a054fe6919ee4825a3c94c23807d8b86.png)

**📝给大家整理了超全最新的AI大模型应用开发学习清单和资料，手把手帮你快速入门！👇👇**

**学习路线:**

✅大模型基础认知—大模型核心原理、发展历程、主流模型（GPT、文心一言等）特点解析

✅核心技术模块—RAG检索增强生成、Prompt工程实战、Agent智能体开发逻辑

✅开发基础能力—Python进阶、API接口调用、大模型开发框架（LangChain等）实操

✅应用场景开发—智能问答系统、企业知识库、AIGC内容生成工具、行业定制化大模型应用

✅项目落地流程—需求拆解、技术选型、模型调优、测试上线、运维迭代

✅面试求职冲刺—岗位JD解析、简历AI项目包装、高频面试题汇总、模拟面经

以上6大模块，看似清晰好上手，实则每个部分都有扎实的核心内容需要吃透！

我把大模型的学习全流程已经整理📚好了！抓住AI时代风口，轻松解锁职业新可能，希望大家都能把握机遇，实现薪资/职业跃迁～

###### 这份完整版的大模型 AI 学习资料已经上传CSDN，朋友们如果需要可以微信扫描下方CSDN官方认证二维码免费领取【`保证100%免费`】

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/00d50d26803d72e8d5d75a1905815354.png#pic_center)

![](https://csdnimg.cn/release/blogv2/dist/pc/img/vip-limited-close-newWhite.png)

确定要放弃本次机会？


福利倒计时

_:_ _:_

![](https://csdnimg.cn/release/blogv2/dist/pc/img/vip-limited-close-roup.png)立减 ¥

普通VIP年卡可用

[立即使用](https://mall.csdn.net/vip)

[![](https://profile-avatar.csdnimg.cn/2ce5441f3a134bc2af98ecacf6e79696_m0_59235945.jpg!1)\\
程序猿李巡天](https://blog.csdn.net/m0_59235945)

关注关注

- ![](https://csdnimg.cn/release/blogv2/dist/pc/img/tobarThumbUpactive.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/like-active.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/like.png)
15

点赞

- ![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/unlike-active.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/unlike.png)
踩

- ![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/collect-active.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/collect.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/newCollectActive.png)
13




收藏







觉得还不错?

一键收藏
![](https://csdnimg.cn/release/blogv2/dist/pc/img/collectionCloseWhite.png)

- [![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/comment.png)\\
0](https://blog.csdn.net/m0_59235945/article/details/159655249#commentBox)
评论

- ![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/share.png)分享




复制链接



分享到 QQ



分享到新浪微博









![](https://csdnimg.cn/release/blogv2/dist/pc/img/share/icon-wechat.png)扫一扫


- ![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/more.png)


![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/report.png)举报



![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/report.png)举报


[讯飞星辰 Agent 开发平台，解锁 AI 应用新范式\\
\\
从学习到工程化全链路支持，深度定制工具链，轻松打造企业级智能应用](https://kunyu.csdn.net/?p=58&a=1093330&c=3942996&k=AI%E5%9C%88%E7%AA%81%E7%84%B6%E9%83%BD%E5%9C%A8%E8%AF%B4Harness%EF%BC%8C%E5%AE%83%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%E4%B8%80%E7%AF%87%E7%BB%99%E4%BD%A0%E8%AE%B2%E9%80%8F&d=1&t=3&dest=https%3A%2F%2Fagent.xfyun.cn%2Fhome%3Fch%3DCSDN2&timestamp=1773729232520&signature=c4f3e755d7e11711300728bea79da80cb4d1fdef&hk=&articleId=159655249)

广告

![](https://kunyu.csdn.net/1.png?p=58&adBlockFlag=0&adId=1093330&a=1093330&c=3942996&k=AI%E5%9C%88%E7%AA%81%E7%84%B6%E9%83%BD%E5%9C%A8%E8%AF%B4Harness%EF%BC%8C%E5%AE%83%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%E4%B8%80%E7%AF%87%E7%BB%99%E4%BD%A0%E8%AE%B2%E9%80%8F&spm=1001.2101.3001.5002&articleId=159655249&d=1&t=3&u=2a6b2d46bd304e4796ce11e050ca26fb)

[_Harness_ Engineering 让vibe coding 24小时给你干活](https://kingcall.blog.csdn.net/article/details/159670035)

03-31![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
158


[最后 _说_ 几点感受： _Harness_ 并不难，但它却极大程度把开发者从陪伴式编程中解放了出来。是高ROI的投资 _Harness_ 背后的驱动是skills的自我迭代，持续优化，使用合适的skills是前提。Harnnss也并非一劳永逸，要经常维护。当模型能力的发展开始变缓，我们会发现工程能力又开始以新的速度蜕变：从提示词工程，到上下文工程， _harness_ 工程，每一次进化都让 _AI_ 这项技术离应用越来越近。](https://kingcall.blog.csdn.net/article/details/159670035)

参与评论您还未登录，请先登录后发表或查看评论

[_AI_ 工程进入 _Harness_ 时代 _:_ 新范式核心技术深度解析(非常详细),从入门到精 ...](https://blog.csdn.net/Python_cocola/article/details/159287182)

3-20

[前面 _说_ 了 _Harness_ 是驾具。这个比喻最早是Mitchell Hashimoto用在 _AI_ coding语境中的,Martin Fowler在他的Exploring Generative _AI_ 系列文章中讨论并推广了这个概念。 三个角色 _:_ •马= _AI_ 模型。强大、快速、精力充沛,但不知道该往哪跑 •驾具= 基础设施。约束、护栏、反馈循环,引导力量往正确方向走 •骑手= 人类工...](https://blog.csdn.net/Python_cocola/article/details/159287182)

[_AI_ 工程化基于 _Harness_ 的Agent可控系统构建 _:_ 实现代码生成与自动修复...](https://download.csdn.net/download/liukun4491973/92773410)

3-30

[内容概要 _:_ 本文介绍了 _Harness_ 系统的基本概念、核心架构及其在 _AI_ Agent开发中的应用,旨在帮助开发者将 _AI_ 从“黑盒”变为“可控”的工程化工具。文章通过类比方式解释 _Harness_ 的作用,即如同为 _AI_ 引擎配备方向盘与控制系统,使其能够在规则约束下稳定执行任务。 _Harness_ 包含六大核心组件 _:_ 上下文管理、工具集成、执行引擎、状态持久化...](https://download.csdn.net/download/liukun4491973/92773410)

[Agent _Harness_：2026年 _AI_ 应用开发的新基石](https://blog.csdn.net/DK_Allen/article/details/159385622)

[技术引领业务创新](https://blog.csdn.net/DK_Allen)

03-23![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
524


[Agent _Harness_ 是包裹在 _AI_ 模型外层的基础设施层，负责管理长时间运行的任务。它本身不是Agent，而是决定Agent如何运作的软件系统——确保Agent在执行过程中保持可靠、高效、可控。从“选最强的模型”到“构建最可靠的系统”。当模型能力成为通用商品，真正拉开差距的，是那个围绕模型、管理上下文、保证长期执行可靠性的基础设施。对于中文开发者而言，这既是挑战也是机遇。](https://blog.csdn.net/DK_Allen/article/details/159385622)

[长流程 _AI_ 的终极答案：为什么 2026 年必须死磕 Agent _Harness_](https://devpress.csdn.net/v1/article/detail/158495559)

[小程故事多的博客](https://blog.csdn.net/u013970991)

02-28![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
845


[摘要： 2026年 _AI_ 竞争焦点转向长流程任务稳定性，Agent _Harness_ 成为关键基础设施。传统评测体系仅关注单轮对话能力，而实际场景中 _AI_ 需处理多步骤、长时间任务，模型耐久性差距凸显。Agent _Harness_ 作为智能体管理系统，提供上下文压缩、任务拆分、状态监控等能力，确保复杂任务可靠执行。其轻量化、模块化设计适配快速迭代的模型技术，并通过真实运行数据优化模型。未来，Agent _Harness_ 将推动 _AI_ 从实验室走向产业化，成为长流程稳定性的核心解决方案。（150字）](https://devpress.csdn.net/v1/article/detail/158495559)

[以天为单位革新的 _AI_ _圈_, _Harness_ 早已不算什么 _新词_](https://blog.csdn.net/sD7O95O/article/details/159699087)

4-1

[2026年2月,Open _AI_ 在官方博客发表了 _一篇_ 名为《 _Harness_ Engineering _:_ Leveraging Codex in an Agent-First World》的文章。核心内容只有一件事 _:_ 一个三人工程师小组,用五个月时间,完全依靠 _AI_ Agent 交付了约 100 万行代码、1500 个 Pull Request,全程没有任何人手动写过一行代码。](https://blog.csdn.net/sD7O95O/article/details/159699087)

[2026年独立开发者的“核武器” _:_ _Harness_ Engineering 概念介绍](https://blog.csdn.net/xx_nm98/article/details/159287498)

3-27

[在2026 年的 _AI_ 开发 _圈_,一个 _新词_ 正在被Anthropic、Open _AI_ 和 LangCh _ai_ n 的大佬们反复提及 _:_ _Harness_ Engineering(基座工程)。 这不仅仅是一个技术名词,它是让 _AI_ 从“只会聊天的机器人”进化为“能自主交付项目的工程师”的关键。 一、什么是 _Harness_ _?_ 为什么你需要它 _?_](https://blog.csdn.net/xx_nm98/article/details/159287498)

[_一篇_ 文章 _讲_ 清楚什么是 _Harness_ Engineering](https://blog.csdn.net/weixin_42856210/article/details/159586229)

[weixin\_42856210的博客](https://blog.csdn.net/weixin_42856210)

03-28![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
162


[所以到最后你会发现， _Harness_ Engineering 并不是什么新玩意儿。它只是各个公司在探索 agent 的过程中，总结出来的一些让 agent 更好完成工作的原则，或者 _说_ 设计思路。这些原则和思路，需要一个统一的词去描述，于是最后就有了 _harness_ engineering 这个 _说_ 法。但事实上，这个词也确实挺贴切的。因为 _harness_ 本意就是“马具”，是用来约束马的行为的。一匹马如果你不做任何约束，它可能会随便乱跑。](https://blog.csdn.net/weixin_42856210/article/details/159586229)

[_Harness_ Engineering 是什么？从上下文工程到驾驭工程](https://blog.csdn.net/shadowcz007/article/details/159111359)

[shadowcz007的博客](https://blog.csdn.net/shadowcz007)

03-15![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
1179


[_Harness_ Engineering 是什么？ _AI_ 时代的新杠杆 _Harness_ Engineering 驾驭工程：通过构建受控环境，让 _AI_ 在约束下高效可靠地工作。想象 _AI_ 是一匹拥有神力的独角兽，它力量强大但难以预测。驾驭工程不是去拔掉它的角，而是为它打造一套“黄金缰绳”和“水晶马车”。（架构约束）引导它走正确的路，（上下文工程）提供舒适的承载空间，（反馈循环）随时照出它的状态，而（熵管理）则负责清理它奔跑时留下的杂乱痕迹。这样，独角兽既保留了神力，又变得温顺可控。](https://blog.csdn.net/shadowcz007/article/details/159111359)

[模型能力 vs 工程优化：为什么 _说_ _Harness_ 才是 _AI_ 落地的关键？](https://guopei.blog.csdn.net/article/details/159435426)

[guopeiAI](https://blog.csdn.net/Guo_Python)

03-24![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
596


[摘要： _AI_ 落地面临"最后一公里"难题，核心在于\*\* _Harness_（工程优化体系）\*\*的建设，而非单纯追求模型能力。 _Harness_ 包含Prompt工程、Agent编排、工具调用等组件，决定了 _AI_ 的实际利用率。实践表明，优秀 _Harness_ 可带来3-5倍效率提升，使现有模型发挥最大价值。当前行业趋势正从"炼模型"转向"建 _Harness_"，工程能力成为差异化关键。未来 _AI_ 成功落地的核心公式是：强大模型+优秀 _Harness_，建议从业者优先掌握工程化能力，以](https://guopei.blog.csdn.net/article/details/159435426)

[程序员不写代码了？Open _AI_ _Harness_ Engineering从入门到精通，这 _一篇_ _讲_ _透_ 了！](https://devpress.csdn.net/v1/article/detail/159507818)

[weixin\_58753619的博客](https://blog.csdn.net/weixin_58753619)

03-26![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
331


[2026 年 2 月，Open _AI_ 在工程博客发布的《 _Harness_ engineering _:_ leveraging Codex in an agent-first world》，抛出了一个颠覆软件工程 _界_ 的实验结果：一支\*\*初始 3 人的工程师团队\*\*，从\*\*空 Git 仓库\*\*起步，仅用 5 个月时间，依靠 Codex+GPT-5 构建出一款拥有\*\*约 100 万行代码\*\*的真实软件产品，全程\*\*人类工程师未手写任何一行代码\*\*，后期团队扩容至 7 人后，人均吞吐量还进一步提升。](https://devpress.csdn.net/v1/article/detail/159507818)

[_Harness_ Engineering 是什么？一场新的 _AI_ 范式已经开始](https://devpress.csdn.net/v1/article/detail/159393361)

[uzong](https://blog.csdn.net/qq_31156277)

03-23![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
1509


[_AI_ 编程范式革新：从Prompt到 _Harness_ Engineering 随着 _AI_ 编程的普及，传统Prompt Engineering暴露了上下文脱节、架构失控等技术债务问题。 _Harness_ Engineering应运而生，提出"人类掌舵，代理执行"的新范式。Open _AI_ 实验证明，通过架构约束、熵管理和反馈系统， _AI_ 可自主完成百万行代码开发。工程师角色从编码者转变为系统设计者，专注于构建 _AI_ 高效工作的环境。这一演进标志着软件开发进入人类定战略、 _AI_ 管执行的双循环时代，为 _AI_ 规模化应用提供](https://devpress.csdn.net/v1/article/detail/159393361)

[_AI_ Coding：浅谈 _Harness_ Engineering](https://devpress.csdn.net/v1/article/detail/159493355)

[qq\_39685066的博客](https://blog.csdn.net/qq_39685066)

03-26![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
368


[前面零零碎碎聊了不少，汇总成一张图看得更清楚： _说_ 实话，看完这张图有点不好意思。我大概处在Level 2（团队级）的位置——Rules 和 Skills 把核心场景覆盖了，MCP 打通了外部数据源，PEV 建了验证闭环。但离 Open _AI_ 那种 Level 3——自定义 Linter 硬卡、Per-Task 成本预算、Agent 行为全程追踪、定期垃圾回收——还差得不少。前两篇文章攒下来一个赛车的比喻，这里把它写完整。第 _一篇_ _说_：赛车不是只靠引擎马力大就能赢，还得有刹车、悬挂和空力套件。](https://devpress.csdn.net/v1/article/detail/159493355)

[Agent _Harness_， _一篇_ 就够了](https://devpress.csdn.net/v1/article/detail/159502248)

[weixin\_58753619的博客](https://blog.csdn.net/weixin_58753619)

03-26![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
378


[Agent _Harness_ 已经在 2026 年初迅速成为 _AI_ 工程领域的核心架构概念。](https://devpress.csdn.net/v1/article/detail/159502248)

[大家都在 _讲_ _Harness_，但它到底该怎么理解](https://devpress.csdn.net/v1/article/detail/159638365)

[m0\_50180963的博客](https://blog.csdn.net/m0_50180963)

03-30![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
334


[本文真正想做的事情其实很简单。就是把 _Harness_ 从一个容易越 _讲_ 越糊的热词，重新拆回一个有层次的工程对象。三层：知识层、约束与流程层、反馈与运行时层。每一层解决的问题不一样，补法也不一样。Open _AI_ 在文中提醒我们：当 Agent 成为主要生产力，仓库就是大脑，架构边 _界_ 就是护栏，文档和规则要版本化进仓库，而不是散在聊天记录和脑子里。](https://devpress.csdn.net/v1/article/detail/159638365)

[_AI_ _Harness_ 工程：Agent 能跑起来的那一层到底是什么？](https://devpress.csdn.net/v1/article/detail/159052352)

[yanqianglifei的专栏](https://blog.csdn.net/yanqianglifei)

03-14![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
1005


[值得单独提一下的是，比如 Anthropic 的 CLAUDE.md 技能文件，它把编排指令直接嵌进系统提示或结构化的 Markdown 文件里。这种方式下，LLM 本身就成了循环控制器——它读取 _Harness_ 规则，然后照着执行。当模型足够强、能做到自我引导，而且你需要快速迭代、不想每次都改代码的时候，这是个相当好用的选择。](https://devpress.csdn.net/v1/article/detail/159052352)

[_AI_ _Harness_ 工程的崛起](https://devpress.csdn.net/v1/article/detail/159052938)

[新缸中之脑](https://blog.csdn.net/shebao3333)

03-14![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
823


[我写过关于构建 _AI_ Agents 的三种架构方法：SDK、Frameworks 和 Scaffolding。每一种都处于灵活性 vs 结构性光谱的不同位置。2026年出现了第四种模式，位于这三种方法之上。它被称为 _Harness_。和现在都正式使用了这个术语。写过相关文章。 _一篇_ 对其进行了形式化定义。这不是一个，它是决定 _AI_ Agents 是否能在生产环境中真正工作的缺失架构层。 _Harness_ 工程是决定 _AI_ Agents 是否能在生产环境中真正工作的缺失架构层。](https://devpress.csdn.net/v1/article/detail/159052938)

[从 OpenClaw 到 ToClaw： _AI_ 代理网关的产品化之路\\
\\
热门推荐](https://devpress.csdn.net/v1/article/detail/159675829)

[倔强的石头的博客](https://blog.csdn.net/2302_78391795)

03-31![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
1万+


[OpenClaw 的优势在自由度与可扩展；代价是上手成本、维护成本，以及体验一致性更依赖个人配置。](https://devpress.csdn.net/v1/article/detail/159675829)

[YOLO+ByteTrack 纯轨迹驱动方案：无快照盲区场景下的无人售货柜结算落地指南](https://blog.csdn.net/alspd_zhangpan/article/details/159652707)

[技术分析](https://blog.csdn.net/alspd_zhangpan)

03-30![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
888


[本文提出了一种针对无快照无人售货柜场景的商品跟踪与结算方案。针对摄像头存在盲区、无法获取完整快照的问题，采用YOLO+ByteTrack技术实现纯轨迹驱动的结算系统。方案通过检测框分级、卡尔曼滤波预测、两阶段匹配和轨迹状态管理等优化，确保商品ID全程稳定和轨迹连续。系统定义货道陈列区和取货过渡区，基于商品轨迹状态流转实现精准的动作判定，无需依赖前后快照比对。配套提供了完整的代码实现、参数配置和调优指南，经商用验证可达到99.9%的结算准确率。该方案有效解决了盲区遮挡、商品移出视野等核心痛点，为无快照场景提供](https://blog.csdn.net/alspd_zhangpan/article/details/159652707)

[全新跨平台 _AI_ 桌面 轻量高性能， _AI_ 聊天客户端源码\\
\\
最新发布](https://devpress.csdn.net/v1/article/detail/159727593)

[bailukeji的博客](https://blog.csdn.net/bailukeji)

04-01![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
438


[在当今 _AI_ 技术飞速发展的时代，用户往往需要在多个 _AI_ 模型和服务之间切换，过程繁琐且效率低下。我们推出的全新轻量级高性能跨平台桌面应用，正是为了解决这一核心痛点而生。它将直观易用的 _AI_ 聊天 _界_ 面与强大的 _AI_ 网关管理功能深度融合，为用户提供了一个前所未有的、统一且高效的智能交互工作站。所谓“一体化”，意味着您无需再为不同的 _AI_ 服务分别打开多个网页或应用。在本应用中，您可以在一个简洁的聊天窗口内，自由切换或同时调用来自Open _AI_、Claude、Gemini以及众多开源模型的智能能力。](https://devpress.csdn.net/v1/article/detail/159727593)

[高性能计算综述： _AI_ 融合、能效优化与量子计算的挑战](https://cslab.blog.csdn.net/article/details/159606805)

[CS实验室](https://blog.csdn.net/qiwsir)

03-29![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
930


[高性能计算（HPC）研究综述： _AI_ 融合、能效优化与量子计算协同 摘要：本文系统综述了2023-2026年HPC领域的研究进展，揭示三大核心趋势：1） _AI_ 与HPC深度融合，混合架构（CPU+GPU/FPGA）占比达89%，容器化技术实现近原生性能；2）能效优化成为关键，液冷技术渗 _透_ 率超40%，异构计算能效提升3倍；3）量子计算与HPC协同探索，混合架构在量子化学模拟等场景展现潜力。研究同时指出当前挑战：边缘HPC实时调度、量子-HPC边 _界_ _界_ 定及绿色计算标准统一。本文为把握HPC技术发展方向提供了系统性参考。](https://cslab.blog.csdn.net/article/details/159606805)

[【论文复现】Applied Intelligence 2025：Auto-PU正例无标签学习的自动化实现与GPT-5.4辅助编程实战](https://zhisuanpusa.blog.csdn.net/article/details/159672790)

[nmdbbzcl的博客](https://blog.csdn.net/nmdbbzcl)

03-31![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
641


[正例-无标签学习（Positive-Unlabelled Learning, PU Learning）是机器学习领域处理"只有正例标签，负例完全未知"场景的重要技术。本文基于2025年发表于Applied Intelligence的最新研究成果，详细阐述如何从零复现Auto-PU框架（包含GA-Auto-PU、BO-Auto-PU、EBO-Auto-PU三种优化器）。](https://zhisuanpusa.blog.csdn.net/article/details/159672790)

[基于Q-Learning强化学习的小车倒立摆平衡控制系统matlab性能仿真](https://devpress.csdn.net/v1/article/detail/159590380)

[MATLAB,verilog,python,opencv,tensorflow,caffe,C,C++](https://blog.csdn.net/aycd1234)

03-29![](https://csdnimg.cn/release/blogv2/dist/pc/img/readCountWhite.png)
218


[本文研究了基于Q-Learning强化学习的环形轨道小车倒立摆控制问题。通过建立三维环形运动模型，将小车位置参数化为极坐标形式，摆杆动力学采用拉格朗日方程描述。 _算法_ 采用ε-贪婪策略进行动作选择，设计了包含角度偏差惩罚和控制力成本的奖励函数。MATLAB仿真实现了三维可视化，展示了摆杆平衡控制过程，包括小车沿环形轨道的运动轨迹和摆杆姿态变化。实验结果表明，该Q-Learning控制器能有效维持摆杆竖直平衡，同时完成指定环形运动。研究为复杂轨迹下的倒立摆控制提供了强化学习解决方案，验证了Q-Learning在连](https://devpress.csdn.net/v1/article/detail/159590380)

- [关于我们](https://www.csdn.net/company/index.html#about)
- [招贤纳士](https://www.csdn.net/company/index.html#recruit)
- [商务合作](https://fsc-p05.txscrm.com/T8PN8SFII7W)
- [寻求报道](https://marketing.csdn.net/questions/Q2202181748074189855)
- ![](https://g.csdnimg.cn/common/csdn-footer/images/tel.png)400-660-0108
- ![](https://g.csdnimg.cn/common/csdn-footer/images/email.png)[kefu@csdn.net](mailto:webmaster@csdn.net)
- ![](https://g.csdnimg.cn/common/csdn-footer/images/cs.png)[在线客服](https://csdn.s2.udesk.cn/im_client/?web_plugin_id=29181)
- 工作时间 8:30-22:00


- ![](https://g.csdnimg.cn/common/csdn-footer/images/badge.png)[公安备案号11010502030143](http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502030143)
- [京ICP备19004658号](http://beian.miit.gov.cn/publish/query/indexFirst.action)
- [京网文〔2020〕1039-165号](https://csdnimg.cn/release/live_fe/culture_license.png)
- [经营性网站备案信息](https://csdnimg.cn/cdn/content-toolbar/csdn-ICP.png)
- [北京互联网违法和不良信息举报中心](http://www.bjjubao.org/)
- [家长监护](https://download.csdn.net/tutelage/home)
- [网络110报警服务](https://cyberpolice.mps.gov.cn/)
- [中国互联网举报中心](http://www.12377.cn/)
- [Chrome商店下载](https://chrome.google.com/webstore/detail/csdn%E5%BC%80%E5%8F%91%E8%80%85%E5%8A%A9%E6%89%8B/kfkdboecolemdjodhmhmcibjocfopejo?hl=zh-CN)
- [账号管理规范](https://blog.csdn.net/blogdevteam/article/details/126135357)
- [版权与免责声明](https://www.csdn.net/company/index.html#statement)
- [版权申诉](https://blog.csdn.net/blogdevteam/article/details/90369522)
- [出版物许可证](https://img-home.csdnimg.cn/images/20250103023206.png)
- [营业执照](https://img-home.csdnimg.cn/images/20250103023201.png)
- ©1999-2026北京创新乐知网络技术有限公司

登录后您可以享受以下权益：

- ![](<Base64-Image-Removed>)免费复制代码
- ![](<Base64-Image-Removed>)和博主大V互动
- ![](<Base64-Image-Removed>)下载海量资源
- ![](<Base64-Image-Removed>)发动态/写文章/加入社区

×立即登录

评论![](https://csdnimg.cn/release/blogv2/dist/pc/img/closeBt.png)

![](https://csdnimg.cn/release/blogv2/dist/pc/img/commentArrowLeftWhite.png)被折叠的  条评论
[为什么被折叠?](https://blogdev.blog.csdn.net/article/details/122245662) [![](https://csdnimg.cn/release/blogv2/dist/pc/img/iconPark.png)到【灌水乐园】发言](https://bbs.csdn.net/forums/FreeZone)

查看更多评论![](https://csdnimg.cn/release/blogv2/dist/pc/img/commentArrowDownWhite.png)

添加红包


祝福语

请填写红包祝福语或标题

红包数量

个

红包个数最小为10个

红包总金额

元

红包金额最低5元

余额支付

当前余额3.43元
[前往充值 >](https://i.csdn.net/#/wallet/balance/recharge)

需支付：10.00元


取消确定

实付元

使用余额支付

![](https://csdnimg.cn/release/blogv2/dist/pc/img/pay-time-out.png)点击重新获取

![](https://csdnimg.cn/release/blogv2/dist/pc/img/weixin.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/zhifubao.png)![](https://csdnimg.cn/release/blogv2/dist/pc/img/jingdong.png)扫码支付

钱包余额0

![](https://csdnimg.cn/release/blogv2/dist/pc/img/pay-help.png)

抵扣说明：

1.余额是钱包充值的虚拟货币，按照1:1的比例进行支付金额的抵扣。

2.余额无法直接购买下载，可以购买VIP、付费专栏及课程。

[![](https://csdnimg.cn/release/blogv2/dist/pc/img/recharge.png)余额充值](https://i.csdn.net/#/wallet/balance/recharge)

![](https://blog.csdn.net/m0_59235945/article/details/159655249)

确定取消![](https://csdnimg.cn/release/blogv2/dist/pc/img/closeBt.png)

举报

![](https://csdnimg.cn/release/blogv2/dist/pc/img/closeBlack.png)

选择你想要举报的内容（必选）

- 内容涉黄
- 政治相关
- 内容抄袭
- 涉嫌广告
- 内容侵权
- 侮辱谩骂
- 样式问题
- 其他

原文链接（必填）

请选择具体原因（必选）

- 包含不实信息
- 涉及个人隐私

请选择具体原因（必选）

- 侮辱谩骂
- 诽谤

请选择具体原因（必选）

- 搬家样式
- 博文样式

补充说明（选填）

取消

确定

[![](https://csdnimg.cn/release/blogv2/dist/pc/img/toolbar/Group.png)点击体验\\
\\
DeepSeekR1满血版](https://ai.csdn.net/chat?utm_source=cknow_pc_blogdetail&spm=1001.2101.3001.10583)![](https://g.csdnimg.cn/side-toolbar/3.6/images/mobile.png)

下载APP

![程序员都在用的中文IT技术交流社区](https://g.csdnimg.cn/side-toolbar/3.6/images/qr_app.png)

程序员都在用的中文IT技术交流社区

公众号

![专业的中文 IT 技术社区，与千万技术人共成长](https://g.csdnimg.cn/side-toolbar/3.6/images/qr_wechat.png)

专业的中文 IT 技术社区，与千万技术人共成长

视频号

![关注【CSDN】视频号，行业资讯、技术分享精彩不断，直播好礼送不停！](https://g.csdnimg.cn/side-toolbar/3.6/images/qr_video.png)

关注【CSDN】视频号，行业资讯、技术分享精彩不断，直播好礼送不停！

![](https://g.csdnimg.cn/side-toolbar/3.6/images/customer.png)客服

新手引导

![](https://g.csdnimg.cn/side-toolbar/3.6/images/totop.png)返回顶部

![](https://csdnimg.cn/release/blogv2/dist/pc/img/quoteClose1White.png)

![](https://i-blog.csdnimg.cn/img_convert/f22821c1a8c15f3074c86407bdea7dc6.jpeg)

![](https://i-blog.csdnimg.cn/img_convert/ca5d5bb964a44a1a66be1c922f073985.jpeg)

![](https://i-blog.csdnimg.cn/direct/a054fe6919ee4825a3c94c23807d8b86.png)

![](https://i-blog.csdnimg.cn/blog_migrate/00d50d26803d72e8d5d75a1905815354.png#pic_center)

-100%+1:1还原