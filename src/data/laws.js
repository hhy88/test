export const lawsData = {
  author: "Dr. Milan Milanović",
  count: 56,
  description: "写代码时值得记住的一些道理",
  laws: [
  {
    "slug": "conways-law",
    "title": "康威定律",
    "shortTitle": "团队怎么分，代码就怎么分",
    "description": "组织设计的系统反映了其自身的沟通结构。",
    "group": "Teams",
    "experience": "senior",
    "metaphor": "你们公司前端后端分两个组？那代码肯定也是前后端分离的。你们按业务线分团队？那代码肯定也是按业务模块划分的。团队结构决定了代码结构。",
    "example": "亚马逊的'两个披萨团队'，每个团队负责一个服务。结果亚马逊就成了微服务架构。反过来看，如果一个公司前端后端测试分三个部门，那代码肯定也是三层架构。",
    "takeaways": [
      "代码架构 = 团队架构的映射",
      "想要微服务？先把团队拆成小团队",
      "改架构前，先想想要不要改团队结构"
    ],
    "commonMistakes": [
      "想搞微服务，团队还是按职能划分",
      "只改代码架构，不改团队结构",
      "频繁重组团队，代码跟着乱"
    ],
    "practiceTips": [
      "根据想要的架构来组织团队",
      "让负责某个模块的人坐在一起",
      "跨职能团队比职能团队更好用"
    ],
    "related": [
      "brooks-law",
      "galls-law",
      "law-of-leaky-abstractions",
      "hyrums-law"
    ]
  },
  {
    "slug": "premature-optimization",
    "title": "过早优化",
    "shortTitle": "先跑起来，再跑得快",
    "description": "过早优化是万恶之源。",
    "group": "Planning",
    "experience": "junior",
    "metaphor": "房子还没盖好，就开始纠结插座位置要精确到毫米。结果房子盖完了发现插座位置根本不对。",
    "example": "有个哥们花两天优化了一个函数，让它快了10倍。结果发现这个函数只在启动时调用一次，占总时间的0.001%。真正的瓶颈在另一个排序函数。",
    "takeaways": [
      "先把代码写对，再写快",
      "97%的优化都是浪费时间",
      "优化会让代码变复杂，别轻易做"
    ],
    "commonMistakes": [
      "没做性能测试就开始优化",
      "优化了不重要的地方",
      "为了快牺牲可读性"
    ],
    "practiceTips": [
      "先用性能分析工具找到真正的瓶颈",
      "写清晰的代码，不要过度优化",
      "有性能指标要求时再优化"
    ],
    "related": [
      "yagni",
      "hofstadters-law",
      "galls-law",
      "kernighans-law",
      "amdahls-law"
    ]
  },
  {
    "slug": "hyrums-law",
    "title": "海勒姆定律",
    "shortTitle": "用户会依赖你所有行为",
    "description": "当API用户足够多时，你系统的所有可观察行为都会被依赖。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "你开了家餐厅，菜单上没写周二打折。但顾客发现你每周二都打折，于是周二都来。有天你不打折了，顾客就炸了。",
    "example": "Windows有些未文档化的bug行为，很多第三方软件依赖这些bug。微软修复这些bug时，那些软件就崩了。",
    "takeaways": [
      "所有可观察的行为都会被依赖",
      "改任何东西都可能破坏用户的代码",
      "真正的契约不只是文档，是实际行为"
    ],
    "commonMistakes": [
      "以为未文档化的行为可以随便改",
      "没区分'公共API'和'内部实现'",
      "改了看似无害的细节，结果炸了"
    ],
    "practiceTips": [
      "明确哪些是稳定的API，哪些可能变化",
      "对公共API做版本控制",
      "假设所有行为都会被依赖"
    ],
    "related": [
      "law-of-leaky-abstractions"
    ]
  },
  {
    "slug": "boy-scout-rule",
    "title": "童子军法则",
    "shortTitle": "让代码比你发现时更好",
    "description": "离开代码时，让它比你到达时更好。",
    "group": "Quality",
    "experience": "junior",
    "metaphor": "露营时，童子军的原则是'离开营地时，让它比你到达时更干净'。写代码也一样，每次改代码，都让它比之前好一点。",
    "example": "你修一个bug，发现旁边的函数命名不清楚，还有重复代码。顺手改了命名，提取了重复代码。虽然不是你原本要做的，但代码库变好了。",
    "takeaways": [
      "每次改代码，至少做一个小改进",
      "小步改进，不要一次改太多",
      "我碰过的代码，我就要负责"
    ],
    "commonMistakes": [
      "觉得'不是我的代码，不改'",
      "一次改太多，review困难",
      "改了代码没改测试"
    ],
    "practiceTips": [
      "改代码时顺手做点改进",
      "每次提交只做一件事",
      "改代码也要更新测试"
    ],
    "related": [
      "broken-windows-theory",
      "yagni",
      "technical-debt"
    ]
  },
  {
    "slug": "yagni",
    "title": "YAGNI原则",
    "shortTitle": "用不着就别写",
    "description": "你不会需要它——不要实现你目前不需要的功能。",
    "group": "Design",
    "experience": "junior",
    "metaphor": "买工具时，不要因为'可能以后会用到'就买一堆。等真正需要时再买，省钱又省空间。",
    "example": "你做导出功能，目前只需要导出JSON。你想'可能以后还要导出XML、CSV、PDF'，就设计了个通用框架。半年后，产品说'不需要其他格式了'。你的通用框架反而让简单改动变复杂了。",
    "takeaways": [
      "不要写'将来可能需要'的功能",
      "真正需要时再加，来得及",
      "提前写的代码都是浪费"
    ],
    "commonMistakes": [
      "过度设计'将来可能需要'的功能",
      "觉得'加这个很简单，顺手做了'",
      "把YAGNI当借口，不写必要的抽象"
    ],
    "practiceTips": [
      "只实现当前明确需要的功能",
      "相信重构能力，不要提前设计",
      "区分'YAGNI'和'必要的抽象'"
    ],
    "related": [
      "kiss-principle",
      "dry-principle",
      "premature-optimization"
    ]
  },
  {
    "slug": "brooks-law",
    "title": "布鲁克斯定律",
    "shortTitle": "加人反而更慢",
    "description": "向落后的软件项目增加人力会使其更落后。",
    "group": "Teams",
    "experience": "mid",
    "metaphor": "厨房里做饭，已经落后了，再加几个厨师进来帮忙，只会更乱：新人不知道菜谱，老人要花时间教新人，厨房更挤了。",
    "example": "10个人的项目延期2个月。经理加5个人。结果：前两周老人都在教新人，更慢了；新人开始工作后，沟通成本增加；3个月后，项目延期了3个月。",
    "takeaways": [
      "加人不等于加生产力",
      "沟通成本随人数二次方增长",
      "项目后期加人只会更慢"
    ],
    "commonMistakes": [
      "以为加人就能加快进度",
      "项目后期大量加人",
      "没考虑培训和协调成本"
    ],
    "practiceTips": [
      "项目初期就配够人",
      "必须加人就尽早加",
      "用工具和自动化代替加人"
    ],
    "related": [
      "conways-law",
      "second-system-effect",
      "law-of-unintended-consequences"
    ]
  },
  {
    "slug": "galls-law",
    "title": "加尔定律",
    "shortTitle": "复杂系统从简单系统演化来",
    "description": "一个可工作的复杂系统必定是从一个可工作的简单系统演化而来的。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "搭积木，你不能一开始就搭复杂的城堡。先搭个简单的房子，确认稳固，再一点点加高、加装饰，最后变成城堡。",
    "example": "淘宝最早就是个简单的PHP网站：发商品、看商品、联系卖家。用户多了，才慢慢变成今天的复杂平台。如果一开始就想设计成现在这样，肯定做不出来。",
    "takeaways": [
      "从简单开始，确保能用，再逐步变复杂",
      "不要从头设计复杂系统",
      "复杂系统是演化来的，不是设计出来的"
    ],
    "commonMistakes": [
      "一开始就设计过度复杂的架构",
      "追求'完美'设计，迟迟不能交付",
      "觉得简单就是简陋"
    ],
    "practiceTips": [
      "从最小可用的系统开始",
      "每次只加一个功能，确保系统始终能用",
      "拥抱'简单但能用'"
    ],
    "related": [
      "conways-law",
      "brooks-law",
      "law-of-leaky-abstractions",
      "hofstadters-law"
    ]
  },
  {
    "slug": "law-of-leaky-abstractions",
    "title": "抽象泄漏定律",
    "shortTitle": "所有抽象都会泄漏",
    "description": "所有非平凡的抽象，在某种程度上都有泄漏。",
    "group": "Architecture",
    "experience": "mid",
    "metaphor": "你买了台'全自动洗衣机'，以为按个按钮就行。结果还是要懂水位、转速、洗涤模式。抽象简化了操作，但没完全隐藏细节。",
    "example": "你用ORM操作数据库，以为不用懂SQL。结果遇到N+1查询问题，性能很差。要解决这个问题，你得懂SQL，看ORM生成的查询语句。",
    "takeaways": [
      "所有抽象都会泄漏",
      "不能完全忽略底层",
      "抽象出问题要懂底层才能修"
    ],
    "commonMistakes": [
      "以为用了抽象就不用懂底层",
      "遇到问题不会看底层",
      "过度依赖抽象"
    ],
    "practiceTips": [
      "用抽象，但也要懂底层",
      "遇到问题往下看一层",
      "选择合适的抽象层次"
    ],
    "related": [
      "hyrums-law",
      "galls-law"
    ]
  },
  {
    "slug": "teslers-law",
    "title": "泰斯勒定律",
    "shortTitle": "复杂度守恒",
    "description": "任何系统都有一定的复杂度，无法减少，只能转移。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "你买了台傻瓜相机，按一下就能拍。但相机内部其实很复杂，只是厂家帮你处理了。复杂度没有消失，只是转移了。",
    "example": "iPhone很简单，但iOS内部很复杂。苹果把复杂度都吸收了，用户只需要点图标。如果想让用户简单，开发者就要更努力。",
    "takeaways": [
      "复杂度不会消失，只会转移",
      "让用户简单，开发者就要复杂",
      "把复杂度藏在合适的地方"
    ],
    "commonMistakes": [
      "以为简单就是没有复杂度",
      "把复杂度推给用户",
      "忽视隐藏的复杂度"
    ],
    "practiceTips": [
      "决定复杂度由谁承担",
      "让用户简单，自己多干活",
      "把复杂度封装好"
    ],
    "related": [
      "hyrums-law",
      "occams-razor"
    ]
  },
  {
    "slug": "cap-theorem",
    "title": "CAP定理",
    "shortTitle": "一致性、可用性、分区容错只能选俩",
    "description": "分布式系统最多只能同时满足一致性、可用性、分区容错性中的两项。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "你想开一家24小时营业的连锁店。要保证所有分店价格一致（一致性），又要保证随时能买到（可用性），还要允许分店之间网络断了还能卖（分区容错）。这三样只能选两样。",
    "example": "双十一淘宝，如果保证所有商品库存实时一致，那用户下单时可能要等很久。如果保证随时能下单，可能出现超卖。淘宝选择了可用性，允许超卖后退款。",
    "takeaways": [
      "C、A、P三选二",
      "网络分区是常态，P必须选",
      "实际是在C和A之间选"
    ],
    "commonMistakes": [
      "想三个都要",
      "忽视网络分区的必然性",
      "不理解最终一致性"
    ],
    "practiceTips": [
      "接受网络分区是常态",
      "根据业务选择C还是A",
      "用最终一致性代替强一致性"
    ],
    "related": [
      "fallacies-of-distributed-computing"
    ]
  },
  {
    "slug": "second-system-effect",
    "title": "第二系统效应",
    "shortTitle": "第二个版本最容易过度设计",
    "description": "第二个系统是设计师设计的最危险的系统。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "第一个房子盖得简单实用。盖第二个房子时，你想'这次我要把所有想要的都加上'，结果盖了个四不像。",
    "example": "第一个版本很简单，用户喜欢。做第二个版本时，团队想'这次我们要做一个完美的系统'，加了各种高级功能、复杂架构。结果开发时间超预期，系统复杂难用。",
    "takeaways": [
      "第二个版本最容易过度设计",
      "不要把所有想法都塞进第二个版本",
      "保持简单，逐步迭代"
    ],
    "commonMistakes": [
      "第二个版本想做得'完美'",
      "把所有想法都塞进去",
      "过度设计复杂架构"
    ],
    "practiceTips": [
      "第二个版本也要保持简单",
      "分批添加功能，不要一次全上",
      "用户要什么做什么"
    ],
    "related": [
      "yagni",
      "galls-law",
      "brooks-law"
    ]
  },
  {
    "slug": "fallacies-of-distributed-computing",
    "title": "分布式计算的谬误",
    "shortTitle": "网络不可靠，延迟不是零",
    "description": "开发者对分布式系统常有的八个错误假设。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "你以为打电话对方一定能接到，但实际可能占线、没信号、关机。分布式系统也一样，网络不是你想的那样可靠。",
    "example": "你调用一个远程服务，以为会立即返回。结果网络延迟了5秒，你的程序卡住了。正确做法是设置超时，做降级处理。",
    "takeaways": [
      "网络不可靠",
      "延迟不是零",
      "带宽有限",
      "网络不安全"
    ],
    "commonMistakes": [
      "假设网络永远可用",
      "不设超时",
      "不考虑网络故障"
    ],
    "practiceTips": [
      "所有网络调用都设超时",
      "做重试和降级",
      "假设网络随时会断"
    ],
    "related": [
      "cap-theorem",
      "murphys-law"
    ]
  },
  {
    "slug": "law-of-unintended-consequences",
    "title": "意外后果定律",
    "shortTitle": "改一个地方，别的地方可能出问题",
    "description": "任何有意的行为都会产生意外的后果。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "你为了省电把路灯关了，结果犯罪率上升了。每个改变都可能带来意想不到的后果。",
    "example": "你优化了一个查询，让它快了10倍。结果数据库CPU飙升，因为查询太频繁了。原本慢是因为有自然限流，现在快了反而把数据库打挂了。",
    "takeaways": [
      "每个改变都可能有意外的后果",
      "改动前想想会影响什么",
      "小步快跑，快速发现问题"
    ],
    "commonMistakes": [
      "只看眼前的问题",
      "不考虑副作用",
      "一次改太多"
    ],
    "practiceTips": [
      "改动前列出可能的影响",
      "小步迭代",
      "改完观察一段时间"
    ],
    "related": [
      "hyrums-law",
      "galls-law"
    ]
  },
  {
    "slug": "zawinskis-law",
    "title": "扎温斯基定律",
    "shortTitle": "每个程序都会扩展到能读邮件",
    "description": "每个程序都会扩展到能读邮件。",
    "group": "Architecture",
    "experience": "senior",
    "metaphor": "你开发一个简单的工具，用户说'能不能加个通知功能'，然后'能不能发邮件'，最后你的工具变成了一个邮件客户端。",
    "example": "你开发一个任务管理工具。用户要通知功能，你加了。用户要邮件通知，你加了。用户要能回复邮件更新任务，你加了。最后你的任务管理工具变成了邮件客户端。",
    "takeaways": [
      "功能会不断蔓延",
      "要有意识地控制范围",
      "做一件事并做好"
    ],
    "commonMistakes": [
      "无节制地加功能",
      "什么都想做",
      "失去产品定位"
    ],
    "practiceTips": [
      "明确产品边界",
      "学会说'不'",
      "专注核心功能"
    ],
    "related": [
      "second-system-effect",
      "yagni"
    ]
  },
  {
    "slug": "dunbars-number",
    "title": "邓巴数",
    "shortTitle": "一个人最多维护150人的关系",
    "description": "一个人能维持稳定社交关系的人数上限约为150人。",
    "group": "Teams",
    "experience": "senior",
    "metaphor": "你微信好友可能有几百个，但真正经常联系的就那么几十个。人的社交能力有上限。",
    "example": "一个团队超过150人，你就叫不出所有人的名字了。沟通开始出问题，因为人太多了。所以大公司要分部门，每个部门不超过150人。",
    "takeaways": [
      "人的社交能力有限",
      "团队太大沟通成本高",
      "150人是个分界线"
    ],
    "commonMistakes": [
      "团队太大",
      "沟通渠道太多",
      "忽视社交上限"
    ],
    "practiceTips": [
      "团队控制在150人以内",
      "大团队要分小组",
      "建立清晰的沟通机制"
    ],
    "related": [
      "conways-law",
      "brooks-law"
    ]
  },
  {
    "slug": "ringelmann-effect",
    "title": "林格尔曼效应",
    "shortTitle": "人越多，每个人越不努力",
    "description": "随着群体规模增加，个体成员的贡献会减少。",
    "group": "Teams",
    "experience": "mid",
    "metaphor": "拔河比赛，一个人拔很用力，八个人拔，每个人只用了不到一半的力气。人多了，责任分散了。",
    "example": "一个bug，一个人负责时很快修好。八个人负责时，每个人都觉得'别人会修'，结果没人修。",
    "takeaways": [
      "人越多，个人努力越少",
      "责任要明确到人",
      "小团队更高效"
    ],
    "commonMistakes": [
      "以为人多力量大",
      "责任不明确",
      "团队太大"
    ],
    "practiceTips": [
      "明确每个人的责任",
      "团队保持小规模",
      "让每个人有主人翁感"
    ],
    "related": [
      "brooks-law",
      "dunbars-number",
      "conways-law"
    ]
  },
  {
    "slug": "prices-law",
    "title": "普赖斯定律",
    "shortTitle": "一半的工作由少数人完成",
    "description": "50%的工作由人数平方根的人完成。",
    "group": "Teams",
    "experience": "senior",
    "metaphor": "在一个团队里，总有一两个人特别能干。他们产出的代码，可能比其他所有人加起来还多。",
    "example": "一个10人团队，可能50%的代码是2-3个人写的。这不是其他人偷懒，而是能力分布本来就不均匀。",
    "takeaways": [
      "生产力分布不均匀",
      "少数人贡献大部分价值",
      "要重视核心开发者"
    ],
    "commonMistakes": [
      "以为大家产出差不多",
      "忽视核心开发者",
      "平均分配任务"
    ],
    "practiceTips": [
      "识别核心贡献者",
      "给他们更多资源和支持",
      "不要平均主义"
    ],
    "related": [
      "ringelmann-effect",
      "brooks-law",
      "dunbars-number"
    ]
  },
  {
    "slug": "putts-law",
    "title": "帕特定律",
    "shortTitle": "技术越专业，越难被理解",
    "description": "技术由那些对其一无所知的人管理。",
    "group": "Teams",
    "experience": "senior",
    "metaphor": "你越懂一个领域，越难跟外行解释。专家和普通人说的不是一种语言。",
    "example": "一个技术专家说'我们要用微服务架构，采用事件溯源和CQRS模式'。产品经理听不懂，只听到一堆术语。",
    "takeaways": [
      "专家容易陷入术语陷阱",
      "要学习用简单语言沟通",
      "技术要为业务服务"
    ],
    "commonMistakes": [
      "用术语吓唬人",
      "不解释为什么",
      "忽视沟通成本"
    ],
    "practiceTips": [
      "用简单的语言解释技术",
      "关注业务价值",
      "建立技术翻译机制"
    ],
    "related": [
      "peter-principle",
      "dilbert-principle"
    ]
  },
  {
    "slug": "peter-principle",
    "title": "彼得原理",
    "shortTitle": "人会被提升到不胜任的位置",
    "description": "在层级组织中，每个员工都会被提升到他不胜任的职位。",
    "group": "Teams",
    "experience": "mid",
    "metaphor": "一个优秀的程序员被提拔成经理，结果他不会管理，团队一团糟。他被提拔到了他不胜任的位置。",
    "example": "一个技术大牛，代码写得很好。公司提拔他做技术总监，结果他不会带团队，不会做规划，技术也荒废了。",
    "takeaways": [
      "晋升不一定是好事",
      "技术好不等于管理好",
      "要有合适的发展路径"
    ],
    "commonMistakes": [
      "把技术好的都提拔成管理",
      "没有技术专家的发展路径",
      "忽视管理技能培养"
    ],
    "practiceTips": [
      "提供技术专家的发展路径",
      "管理要培训",
      "不要强迫技术人做管理"
    ],
    "related": [
      "dilbert-principle",
      "putts-law"
    ]
  },
  {
    "slug": "bus-factor",
    "title": "巴士系数",
    "shortTitle": "核心成员被车撞了，项目还能继续吗？",
    "description": "项目因关键成员离开而陷入困境的风险指标。",
    "group": "Teams",
    "experience": "mid",
    "metaphor": "如果你们团队只有一个人懂某个模块，那这个人被车撞了（或者离职了），这个模块就没人能维护了。",
    "example": "你们团队只有老王懂支付模块。老王离职了，没人知道支付怎么工作的。新来的接手，花了三个月才搞懂。",
    "takeaways": [
      "知识要分散",
      "关键模块至少两人懂",
      "文档很重要"
    ],
    "commonMistakes": [
      "知识集中在一个人身上",
      "不写文档",
      "不分享知识"
    ],
    "practiceTips": [
      "关键模块结对编程",
      "写文档",
      "定期知识分享"
    ],
    "related": [
      "conways-law",
      "brooks-law",
      "dunbars-number"
    ]
  },
  {
    "slug": "dilbert-principle",
    "title": "呆伯特法则",
    "shortTitle": "最无能的人被提拔到管理层",
    "description": "最无能的员工会被有系统地提拔到管理层。",
    "group": "Teams",
    "experience": "senior",
    "metaphor": "一个团队里干不了活的人，为了不让他碍事，就提拔成经理。结果管理层的无能程度比基层还高。",
    "example": "一个程序员代码写不好，bug多。经理觉得他干不了活，就让他做项目管理。结果他项目也管不好，但已经没法降回去了。",
    "takeaways": [
      "提拔要看能力",
      "管理需要技能",
      "不要把无能的人提拔走"
    ],
    "commonMistakes": [
      "把干不了活的人提拔走",
      "忽视管理技能",
      "没有淘汰机制"
    ],
    "practiceTips": [
      "提拔要看管理能力",
      "提供培训",
      "有淘汰机制"
    ],
    "related": [
      "peter-principle",
      "putts-law",
      "brooks-law"
    ]
  },
  {
    "slug": "parkinsons-law",
    "title": "帕金森定律",
    "shortTitle": "给多少时间就用多少时间",
    "description": "工作会自动膨胀，占满所有可用的时间。",
    "group": "Planning",
    "experience": "junior",
    "metaphor": "给学生一周写论文，他花6天拖延，最后1天写完。给3天时间，他也能在3天内完成。工作会自动膨胀填满时间。",
    "example": "一个功能评估要2周。给4周时间，他们会：第1周研究各种方案，第2周讨论哪个更好，第3周实现并反复优化，第4周测试和文档。",
    "takeaways": [
      "给多少时间，就用多少时间",
      "设定合理的截止日期",
      "时间太多反而效率低"
    ],
    "commonMistakes": [
      "给任务分配过多时间",
      "没有明确截止日期",
      "过度压缩时间，影响质量"
    ],
    "practiceTips": [
      "设定略紧张的时间限制",
      "用时间盒技术",
      "区分'必须完成'和'锦上添花'"
    ],
    "related": [
      "hofstadters-law",
      "brooks-law"
    ]
  },
  {
    "slug": "ninety-ninety-rule",
    "title": "九十九十法则",
    "shortTitle": "最后10%要花90%时间",
    "description": "前90%的代码占用了前90%的开发时间，剩下的10%代码占用了另外90%的时间。",
    "group": "Planning",
    "experience": "mid",
    "metaphor": "装修房子，前90%的工作（刷墙、铺地）很快完成。剩下10%（收边、细节）要花一样多的时间。",
    "example": "你开发一个功能，一周完成了90%。心想'明天就能上线'。结果：发现几个边界情况没处理，花了2天；性能不达标，优化了3天。",
    "takeaways": [
      "进度90%不是快完成了",
      "最后10%要花90%的时间",
      "不要在90%时承诺上线时间"
    ],
    "commonMistakes": [
      "以为90%就是快完成了",
      "在90%时承诺上线时间",
      "低估收尾工作"
    ],
    "practiceTips": [
      "估算时把最后10%当作独立项目",
      "提前处理边界情况",
      "留足收尾时间"
    ],
    "related": [
      "hofstadters-law",
      "parkinsons-law",
      "pareto-principle"
    ]
  },
  {
    "slug": "hofstadters-law",
    "title": "侯世达定律",
    "shortTitle": "永远比你想象的慢",
    "description": "事情总是比你预期的要花时间，即使你考虑了侯世达定律。",
    "group": "Planning",
    "experience": "junior",
    "metaphor": "你觉得要2天，实际要4天。你觉得考虑了缓冲，给了4天，实际要8天。无论你怎么估算，都会低估。",
    "example": "你估一个功能要3天。考虑了侯世达定律，给了5天。结果：第1天发现依赖的API有问题，花了1天解决；第3天发现边界情况没考虑。",
    "takeaways": [
      "事情总是比想的要花时间",
      "即使考虑了缓冲，还是会超",
      "接受不确定性，留足余量"
    ],
    "commonMistakes": [
      "估算太乐观",
      "没考虑意外情况",
      "以为加了缓冲就够了"
    ],
    "practiceTips": [
      "估算后乘以1.5到2倍",
      "记录实际时间，改进估算",
      "把大任务拆成小任务再估算"
    ],
    "related": [
      "parkinsons-law"
    ]
  },
  {
    "slug": "goodharts-law",
    "title": "古德哈特定律",
    "shortTitle": "指标变成目标，就不再是好指标",
    "description": "当一个指标成为目标时，它就不再是一个好指标。",
    "group": "Planning",
    "experience": "senior",
    "metaphor": "学校用升学率考核老师，老师就开始只教考试内容。升学率上去了，但学生能力下降了。",
    "example": "公司用代码行数考核程序员，程序员就开始写冗长的代码。代码行数上去了，但代码质量下降了。",
    "takeaways": [
      "指标是工具，不是目的",
      "单一指标容易被钻空子",
      "要用多个指标综合评估"
    ],
    "commonMistakes": [
      "把指标当目标",
      "单一指标考核",
      "忽视指标副作用"
    ],
    "practiceTips": [
      "用多个指标",
      "定期调整指标",
      "关注指标背后的真实目标"
    ],
    "related": [
      "dilbert-principle",
      "parkinsons-law"
    ]
  },
  {
    "slug": "gilbs-law",
    "title": "吉尔伯定律",
    "shortTitle": "能测量就能改进",
    "description": "任何需要量化的东西都可以用某种方式测量。",
    "group": "Planning",
    "experience": "mid",
    "metaphor": "你想减肥，但从来不称体重。怎么知道自己瘦没瘦？测量是改进的第一步。",
    "example": "你想提高代码质量，但从来不测代码覆盖率、bug数量。那就不知道有没有改进。开始测量后，你发现覆盖率只有30%。",
    "takeaways": [
      "测量是改进的基础",
      "不测量就不知道现状",
      "测量要有意义"
    ],
    "commonMistakes": [
      "不测量",
      "测量太多没用的",
      "测量了不改"
    ],
    "practiceTips": [
      "选择关键指标",
      "定期测量",
      "根据数据改进"
    ],
    "related": [
      "goodharts-law",
      "parkinsons-law"
    ]
  },
  {
    "slug": "murphys-law",
    "title": "墨菲定律",
    "shortTitle": "可能出错的事一定会出错",
    "description": "凡是可能出错的事，就一定会出错。",
    "group": "Quality",
    "experience": "junior",
    "metaphor": "你带伞的那天不下雨，不带伞的那天肯定下雨。代码也一样，你觉得'应该不会出问题'的地方，最后肯定出问题。",
    "example": "你觉得'这个输入框用户只会输入数字'，没做校验。结果有用户粘贴了一段带空格的数字，系统崩了。",
    "takeaways": [
      "可能出错的事一定会出错",
      "做防御性编程",
      "为失败做设计"
    ],
    "commonMistakes": [
      "觉得'应该不会出问题'",
      "没做防御性编程",
      "没有容错设计"
    ],
    "practiceTips": [
      "假设所有输入都是恶意的",
      "假设所有依赖都会挂",
      "为每种失败情况设计处理方案"
    ],
    "related": [
      "confirmation-bias"
    ]
  },
  {
    "slug": "postels-law",
    "title": "Postel's Law",
    "shortTitle": "Postel's Law",
    "description": "Be conservative in what you do, be liberal in what you accept from others.",
    "group": "Quality",
    "experience": "mid",
    "metaphor": "",
    "example": "In **web browsers**, HTML on websites is often malformed. Browsers, following Postel's spirit, perform extensive error correction and forgiving parsing. They'll still render the page even if a tag isn't closed correctly. If browsers were strict, half the web pages might not display.\n\nIn **APIs**, say your service expects a timestamp. If it receives a timestamp without a time zone, instead of rejecting, maybe you assume UTC or try to parse it anyway, being liberal in acceptance. But when your service returns data, you always include the time zone to be conservative and precise in output. \n\nAn **email client** that receives a slightly non-conforming email (missing a MIME boundary or incorrect newline encodings) will still attempt to show the email rather than throwing an error.\n",
    "takeaways": [
      "When your system emits data or interacts with the outside world, adhere closely to protocols and standards.",
      "When receiving data, handle variations, minor errors, or deviations where possible. Don't crash or reject communication over minor issues.",
      "In modern times, overly liberal acceptance can sometimes mask errors, so this law is occasionally tempered with security considerations."
    ],
    "commonMistakes": [],
    "practiceTips": [],
    "related": [
      "hyrums-law",
      "law-of-leaky-abstractions",
      "fallacies-of-distributed-computing"
    ]
  },
  {
    "slug": "broken-windows-theory",
    "title": "破窗理论",
    "shortTitle": "小问题不修成大问题",
    "description": "明显的混乱迹象会引发更多的混乱。",
    "group": "Quality",
    "experience": "mid",
    "metaphor": "一栋建筑有一扇窗户破了没修，很快其他窗户也会被打破。破窗传递的信息是：这里没人管，可以随便破坏。",
    "example": "项目开始时代码质量很好。后来赶进度，有人写了段乱代码。其他人看到，心想'这里可以写乱点'，也开始写乱代码。",
    "takeaways": [
      "及时修复代码问题",
      "传递质量重要的信号",
      "小问题不修会变成大问题"
    ],
    "commonMistakes": [
      "觉得'小问题没关系'",
      "看到烂代码就跟着写烂代码",
      "没有代码审查机制"
    ],
    "practiceTips": [
      "看到问题立即修，别等'以后'",
      "建立代码审查制度",
      "培养团队质量意识"
    ],
    "related": [
      "technical-debt",
      "boy-scout-rule",
      "galls-law"
    ]
  },
  {
    "slug": "technical-debt",
    "title": "技术债务",
    "shortTitle": "借的时间要还",
    "description": "技术债务是软件开发中一切会减慢开发速度的东西。",
    "group": "Quality",
    "experience": "junior",
    "metaphor": "像借钱买房，技术债务让你现在能快速交付，但以后要'还利息'——维护成本更高、修改更难。",
    "example": "赶上线，团队决定先不写单元测试。上线后，每次改代码都可能引入bug，因为没有测试保护。修这些bug的时间就是'利息'。",
    "takeaways": [
      "技术债务要付利息——额外的维护成本",
      "有时技术债务是合理的",
      "要及时还债，别让利息积累"
    ],
    "commonMistakes": [
      "不知道自己在积累技术债",
      "只借不还",
      "过度追求完美，不敢借任何债"
    ],
    "practiceTips": [
      "记录技术债务，让团队知道哪里有债",
      "定期安排时间还债",
      "对新功能坚持质量标准"
    ],
    "related": [
      "broken-windows-theory",
      "hofstadters-law",
      "boy-scout-rule"
    ]
  },
  {
    "slug": "linuss-law",
    "title": "林纳斯定律",
    "shortTitle": "眼球足够多，bug无处藏",
    "description": "只要有足够多的眼球，所有的bug都是浅显的。",
    "group": "Quality",
    "experience": "mid",
    "metaphor": "一个人找东西可能找不到，一百个人一起找，肯定能找到。开源软件bug少，因为全世界的人都在看代码。",
    "example": "Linux内核有几千个贡献者，任何bug都会被很快发现。闭源软件bug多，因为看代码的人少。",
    "takeaways": [
      "代码审查很重要",
      "开源有利于发现bug",
      "让更多人看代码"
    ],
    "commonMistakes": [
      "代码不让人看",
      "没有代码审查",
      "闭门造车"
    ],
    "practiceTips": [
      "做代码审查",
      "开源非核心代码",
      "鼓励团队互相看代码"
    ],
    "related": [
      "brooks-law",
      "sturgeons-law",
      "bus-factor"
    ]
  },
  {
    "slug": "kernighans-law",
    "title": "克尼汉定律",
    "shortTitle": "调试比写代码难两倍",
    "description": "调试比写代码难两倍。所以如果你写代码时用尽了聪明才智，从定义上讲，你就没有足够的智慧去调试它。",
    "group": "Quality",
    "experience": "junior",
    "metaphor": "写代码时你觉得很聪明，调试时你就知道自己有多蠢了。调试的难度是写代码的两倍。",
    "example": "你写了一个复杂的算法，觉得没问题。运行时出bug了，你花了两倍的时间才找到问题。如果你一开始写简单点，调试就容易多了。",
    "takeaways": [
      "调试比写代码难",
      "写代码时要考虑调试",
      "简单代码更容易调试"
    ],
    "commonMistakes": [
      "写太复杂的代码",
      "不考虑调试",
      "没有日志"
    ],
    "practiceTips": [
      "写简单的代码",
      "加日志",
      "写测试"
    ],
    "related": [
      "kiss-principle",
      "premature-optimization"
    ]
  },
  {
    "slug": "testing-pyramid",
    "title": "测试金字塔",
    "shortTitle": "单元测试多，集成测试中，端到端少",
    "description": "项目应该有大量的快速单元测试，较少的集成测试，以及少量的端到端测试。",
    "group": "Quality",
    "experience": "junior",
    "metaphor": "金字塔底部大顶部小。单元测试是底座，数量最多；端到端测试是顶，数量最少。这样才稳固。",
    "example": "你写了100个端到端测试，运行要2小时。改一行代码，所有测试都要跑。正确的做法是：1000个单元测试，100个集成测试，10个端到端测试。",
    "takeaways": [
      "单元测试最多",
      "集成测试适中",
      "端到端测试最少"
    ],
    "commonMistakes": [
      "端到端测试太多",
      "单元测试太少",
      "测试结构倒金字塔"
    ],
    "practiceTips": [
      "多写单元测试",
      "适度写集成测试",
      "少量端到端测试"
    ],
    "related": [
      "lehmans-laws"
    ]
  },
  {
    "slug": "pesticide-paradox",
    "title": "杀虫剂悖论",
    "shortTitle": "同样的测试，发现不了新bug",
    "description": "重复运行相同的测试会随时间变得不那么有效。",
    "group": "Quality",
    "experience": "mid",
    "metaphor": "你用同一种农药杀虫，虫子会产生抗药性。你用同样的测试用例，发现不了新bug。",
    "example": "你的测试用例覆盖了所有已知场景。但新bug还是出现了，因为你的测试用例没有覆盖新场景。",
    "takeaways": [
      "测试用例要更新",
      "同样的测试发现不了新bug",
      "要测试新场景"
    ],
    "commonMistakes": [
      "测试用例不更新",
      "只测已知场景",
      "忽视新bug"
    ],
    "practiceTips": [
      "定期更新测试用例",
      "测试新发现的bug场景",
      "探索性测试"
    ],
    "related": [
      "lehmans-laws",
      "testing-pyramid"
    ]
  },
  {
    "slug": "lehmans-laws",
    "title": "雷曼定律",
    "shortTitle": "软件会持续变化",
    "description": "反映现实世界的软件必须持续演化，这种演化有可预测的限制。",
    "group": "Quality",
    "experience": "senior",
    "metaphor": "房子住久了要修修补补，软件也一样。不维护的软件会腐烂。",
    "example": "一个系统运行了5年，没人维护。新操作系统不兼容，新浏览器显示有问题。用户开始流失，系统最终被废弃。",
    "takeaways": [
      "软件需要持续维护",
      "不维护就会腐烂",
      "变化是常态"
    ],
    "commonMistakes": [
      "以为软件做完了就不用管",
      "不维护",
      "拒绝变化"
    ],
    "practiceTips": [
      "持续维护",
      "定期重构",
      "拥抱变化"
    ],
    "related": [
      "brooks-law",
      "conways-law",
      "technical-debt"
    ]
  },
  {
    "slug": "sturgeons-law",
    "title": "斯特金定律",
    "shortTitle": "90%的东西都是垃圾",
    "description": "90%的东西都是垃圾。",
    "group": "Quality",
    "experience": "junior",
    "metaphor": "书店里90%的书都不值得读，只有10%是好书。代码库也一样，90%的代码可能都是凑数的。",
    "example": "你接手一个老项目，发现大部分代码都是复制粘贴的，只有10%是真正有价值的。你要识别出那10%，重点维护。",
    "takeaways": [
      "大部分东西质量不高",
      "要识别出有价值的那部分",
      "不要平均用力"
    ],
    "commonMistakes": [
      "以为所有代码都重要",
      "平均分配精力",
      "不知道什么是核心"
    ],
    "practiceTips": [
      "识别核心代码",
      "重点维护核心",
      "敢于删除垃圾代码"
    ],
    "related": [
      "goodharts-law",
      "galls-law"
    ]
  },
  {
    "slug": "amdahls-law",
    "title": "阿姆达尔定律",
    "shortTitle": "并行加速有限制",
    "description": "并行计算的加速效果受限于程序中必须串行执行的部分。",
    "group": "Scale",
    "experience": "senior",
    "metaphor": "做饭时，切菜可以多人并行，但炒菜只能一个人做。不管你请多少人帮忙，炒菜的时间省不掉。",
    "example": "你的程序有20%必须串行执行。你用10个处理器并行，加速比 = 3.57倍。用100个处理器，加速比 = 4.81倍。再多的处理器，加速效果也有限。",
    "takeaways": [
      "并行加速有限制",
      "串行部分决定最大加速比",
      "优化串行部分比加处理器更有效"
    ],
    "commonMistakes": [
      "以为加处理器就能无限加速",
      "忽视串行部分的优化",
      "过度依赖并行"
    ],
    "practiceTips": [
      "找到并优化串行部分",
      "合理设计并行度",
      "不要过度追求并行"
    ],
    "related": [
      "gustafsons-law",
      "metcalfes-law"
    ]
  },
  {
    "slug": "gustafsons-law",
    "title": "古斯塔夫森定律",
    "shortTitle": "问题越大，并行效率越高",
    "description": "问题规模增大时，并行计算的效率会提高。",
    "group": "Scale",
    "experience": "senior",
    "metaphor": "搬砖，搬100块砖，10个人一起搬比1个人快10倍。问题规模大了，并行效率就高了。",
    "example": "处理1GB数据，单线程要10分钟，10个线程可能只要1分钟。处理1TB数据，单线程要10000分钟，10个线程只要1000分钟。",
    "takeaways": [
      "问题规模影响并行效率",
      "大问题适合并行",
      "要考虑问题规模"
    ],
    "commonMistakes": [
      "小问题也搞并行",
      "忽视问题规模",
      "过度并行"
    ],
    "practiceTips": [
      "评估问题规模",
      "大问题才并行",
      "选择合适的并行度"
    ],
    "related": [
      "amdahls-law",
      "metcalfes-law"
    ]
  },
  {
    "slug": "metcalfes-law",
    "title": "梅特卡夫定律",
    "shortTitle": "网络价值随用户数平方增长",
    "description": "网络的价值与用户数量的平方成正比。",
    "group": "Scale",
    "experience": "senior",
    "metaphor": "电话刚发明时，只有一个人有电话，没价值。两个人有电话，可以互相打。一百个人有电话，可以打给99个人。",
    "example": "微信用户越多，价值越大。因为你可以联系更多的人。一个社交平台只有100个用户，没价值。有1亿用户，价值巨大。",
    "takeaways": [
      "用户越多，价值越大",
      "网络效应很重要",
      "要突破临界点"
    ],
    "commonMistakes": [
      "忽视网络效应",
      "不重视用户增长",
      "过早收费"
    ],
    "practiceTips": [
      "重视用户增长",
      "先做大再变现",
      "利用网络效应"
    ],
    "related": [
      "amdahls-law",
      "gustafsons-law"
    ]
  },
  {
    "slug": "dry-principle",
    "title": "DRY原则",
    "shortTitle": "不要重复自己",
    "description": "每一块知识在系统内必须有单一、明确、权威的表示。",
    "group": "Design",
    "experience": "junior",
    "metaphor": "像法律条文，同一条法律在十个地方重复写，修改时要改十个地方，漏掉一个就矛盾。代码也一样，重复代码改起来容易出错。",
    "example": "你在三个地方写了相同的验证邮箱的正则。后来发现正则有bug，要改。如果你记得三个地方都改了，没问题。但如果你只改了两个，第三个地方继续有bug。",
    "takeaways": [
      "避免代码重复，提取共同逻辑",
      "提高可维护性，只改一处",
      "但也要避免过度抽象"
    ],
    "commonMistakes": [
      "复制粘贴代码",
      "过度抽象，把不相关的强行合并",
      "为了DRY而DRY，反而更复杂"
    ],
    "practiceTips": [
      "看到重复代码就提取成函数",
      "只在真正重复时才提取",
      "保持函数单一职责"
    ],
    "related": [
      "solid-principles",
      "law-of-demeter"
    ]
  },
  {
    "slug": "kiss-principle",
    "title": "KISS原则",
    "shortTitle": "保持简单",
    "description": "保持简单，傻瓜。",
    "group": "Design",
    "experience": "junior",
    "metaphor": "能用勺子解决的问题，不要设计一套复杂的机械臂系统。简单往往是最优解。",
    "example": "要存储用户设置。方案A：设计通用配置系统，支持多种存储后端、版本控制、加密等。方案B：用JSON文件存储。如果当前只是存几个简单设置，方案B就是KISS。",
    "takeaways": [
      "避免不必要的复杂性",
      "写简单的代码，不要过度设计",
      "简单的方案更容易理解、维护和扩展"
    ],
    "commonMistakes": [
      "为了炫技设计复杂方案",
      "过度抽象，创建太多层次",
      "把'简单'理解为'不假思索'"
    ],
    "practiceTips": [
      "先找最简单的方案",
      "问自己：'有更简单的方法吗？'",
      "避免过早抽象"
    ],
    "related": [
      "yagni",
      "principle-of-least-astonishment",
      "galls-law"
    ]
  },
  {
    "slug": "solid-principles",
    "title": "SOLID原则",
    "shortTitle": "面向对象设计五大原则",
    "description": "面向对象设计的五个基本原则。",
    "group": "Design",
    "experience": "mid",
    "metaphor": "建房子的五大原则：地基要稳、结构要合理、材料要统一、房间要独立、管道要分离。SOLID就是写代码的五大原则。",
    "example": "你写一个User类，既处理用户数据，又发邮件，还记录日志。这违反了单一职责原则。应该拆成三个类：UserRepository处理数据，EmailService发邮件，Logger记录日志。",
    "takeaways": [
      "单一职责：一个类只做一件事",
      "开闭原则：对扩展开放，对修改关闭",
      "里氏替换：子类可以替换父类",
      "接口隔离：接口要小而专一",
      "依赖倒置：依赖抽象，不依赖具体"
    ],
    "commonMistakes": [
      "一个类做太多事",
      "改功能就改现有代码",
      "继承关系不合理"
    ],
    "practiceTips": [
      "每个类只做一件事",
      "用扩展代替修改",
      "合理使用继承和组合"
    ],
    "related": [
      "law-of-demeter",
      "hyrums-law",
      "law-of-leaky-abstractions",
      "dry-principle",
      "kiss-principle",
      "yagni"
    ]
  },
  {
    "slug": "law-of-demeter",
    "title": "迪米特法则",
    "shortTitle": "不要和陌生人说话",
    "description": "一个对象应该对其他对象有尽可能少的了解。",
    "group": "Design",
    "experience": "mid",
    "metaphor": "你不会让朋友的朋友帮你做事，而是让朋友帮你转达。对象之间也一样，不要跨越多层调用。",
    "example": "你有一个Order对象，里面有Customer对象，Customer对象有Address对象。不要写order.getCustomer().getAddress().getCity()。而是在Order里加getCity()方法。",
    "takeaways": [
      "不要和陌生人说话",
      "只调用直接朋友的方法",
      "减少对象之间的耦合"
    ],
    "commonMistakes": [
      "链式调用太长",
      "跨越多层调用",
      "对象之间耦合太紧"
    ],
    "practiceTips": [
      "链式调用不要超过一层",
      "在中间层加方法",
      "减少对象之间的了解"
    ],
    "related": [
      "solid-principles",
      "law-of-leaky-abstractions",
      "hyrums-law",
      "kiss-principle"
    ]
  },
  {
    "slug": "principle-of-least-astonishment",
    "title": "最小惊讶原则",
    "shortTitle": "别让用户感到意外",
    "description": "设计应该符合用户的预期。",
    "group": "Design",
    "experience": "mid",
    "metaphor": "你按门铃，门铃响了，这是正常的。你按门铃，马桶冲水了，这是惊讶的。设计要让用户感到自然。",
    "example": "你设计一个删除按钮，点击后直接删除，没有确认。用户误点，数据没了，很惊讶。正确做法是弹出确认框，或者有撤销功能。",
    "takeaways": [
      "设计要符合预期",
      "不要让用户感到意外",
      "常见功能要符合惯例"
    ],
    "commonMistakes": [
      "设计反直觉",
      "不遵循惯例",
      "没有确认危险操作"
    ],
    "practiceTips": [
      "遵循平台惯例",
      "危险操作要确认",
      "提供撤销功能"
    ],
    "related": [
      "hyrums-law",
      "kiss-principle",
      "postels-law",
      "law-of-demeter"
    ]
  },
  {
    "slug": "dunning-kruger-effect",
    "title": "达克效应",
    "shortTitle": "越无知越自信",
    "description": "你知道得越少，就越自信。",
    "group": "Decisions",
    "experience": "junior",
    "metaphor": "刚学开车的人觉得自己车技很好，开久了才知道自己不行。越是不懂的人，越觉得自己懂。",
    "example": "一个刚学编程的新人，觉得自己什么都会。等他学多了，才发现自己懂的只是冰山一角。真正的专家反而更谦虚。",
    "takeaways": [
      "无知者无畏",
      "学习越多越谦虚",
      "要认识到自己的局限"
    ],
    "commonMistakes": [
      "过度自信",
      "不学习",
      "不听别人的意见"
    ],
    "practiceTips": [
      "保持谦虚",
      "持续学习",
      "多听别人的意见"
    ],
    "related": [
      "brooks-law",
      "hanlons-razor"
    ]
  },
  {
    "slug": "hanlons-razor",
    "title": "汉隆剃刀",
    "shortTitle": "能用愚蠢解释的，别用恶意",
    "description": "永远不要把可以用愚蠢或疏忽解释的事情归咎于恶意。",
    "group": "Decisions",
    "experience": "junior",
    "metaphor": "同事发了一封让你不爽的邮件，你觉得他是故意的。其实他可能只是没过脑子。别把别人的愚蠢当成恶意。",
    "example": "你的代码被同事改坏了，你觉得他是故意的。其实他可能只是不懂这段代码。问清楚，可能只是个误会。",
    "takeaways": [
      "别把愚蠢当恶意",
      "先假设对方是无心的",
      "沟通很重要"
    ],
    "commonMistakes": [
      "把无心当有意",
      "不沟通就下结论",
      "记仇"
    ],
    "practiceTips": [
      "先沟通再下结论",
      "假设对方是好意",
      "不要记仇"
    ],
    "related": [
      "occams-razor",
      "goodharts-law",
      "postels-law"
    ]
  },
  {
    "slug": "occams-razor",
    "title": "奥卡姆剃刀",
    "shortTitle": "最简单的解释往往是正确的",
    "description": "最简单的解释往往是最准确的。",
    "group": "Decisions",
    "experience": "junior",
    "metaphor": "你听到马蹄声，先想是马，别想是斑马。最简单的解释往往是对的。",
    "example": "系统出bug了，你怀疑是黑客攻击、硬件故障、操作系统bug。其实可能只是一个空指针。先检查最简单的原因。",
    "takeaways": [
      "简单解释优先",
      "不要过度复杂化",
      "先排除简单原因"
    ],
    "commonMistakes": [
      "想得太复杂",
      "忽视简单原因",
      "过度分析"
    ],
    "practiceTips": [
      "先检查简单原因",
      "不要过度设计",
      "保持简单"
    ],
    "related": [
      "kiss-principle",
      "yagni",
      "galls-law"
    ]
  },
  {
    "slug": "sunk-cost-fallacy",
    "title": "沉没成本谬误",
    "shortTitle": "已经花的钱不算数",
    "description": "因为已经投入了时间或精力而坚持一个选择，即使放弃会更好。",
    "group": "Decisions",
    "experience": "mid",
    "metaphor": "你买了一张电影票，看了10分钟发现很难看。但你还是坚持看完，因为票都买了。其实票钱已经花了，看完只会浪费更多时间。",
    "example": "你花了一个月写了一个功能，但发现方向错了。你舍不得删，继续投入。其实这一个月已经沉没了，继续投入只会浪费更多。",
    "takeaways": [
      "沉没成本不是成本",
      "该放弃就放弃",
      "不要因为投入多就舍不得"
    ],
    "commonMistakes": [
      "舍不得放弃",
      "继续投入错误的方向",
      "被过去的投入绑架"
    ],
    "practiceTips": [
      "评估当前价值",
      "该放弃就放弃",
      "不要被过去绑架"
    ],
    "related": [
      "occams-razor",
      "technical-debt",
      "second-system-effect"
    ]
  },
  {
    "slug": "map-is-not-the-territory",
    "title": "地图不是疆域",
    "shortTitle": "模型不等于现实",
    "description": "地图不是它所代表的疆域。",
    "group": "Decisions",
    "experience": "mid",
    "metaphor": "地图只是地图，不是真实的地形。你按地图走，可能掉沟里。模型只是近似，不是真实。",
    "example": "你设计了一个系统架构图，觉得完美。但实际部署时发现网络延迟、硬件限制等问题。设计只是模型，实现才是真实。",
    "takeaways": [
      "模型不等于现实",
      "设计要考虑实际情况",
      "不要过度相信模型"
    ],
    "commonMistakes": [
      "把模型当现实",
      "不考虑实际情况",
      "过度设计"
    ],
    "practiceTips": [
      "设计要验证",
      "考虑实际情况",
      "模型要迭代"
    ],
    "related": [
      "goodharts-law",
      "galls-law",
      "law-of-leaky-abstractions"
    ]
  },
  {
    "slug": "confirmation-bias",
    "title": "确认偏误",
    "shortTitle": "只看支持自己的证据",
    "description": "倾向于寻找支持自己现有信念的信息。",
    "group": "Decisions",
    "experience": "mid",
    "metaphor": "你觉得某人不好，他做的每件事你都往坏处想。你觉得某人好，他做的每件事你都往好处想。人只看自己想看的。",
    "example": "你觉得某个框架不好，只看它的缺点，不看优点。你觉得某个框架好，只看它的优点，不看缺点。这样无法做出正确判断。",
    "takeaways": [
      "人会有偏见",
      "要看两面",
      "不要只找支持自己的证据"
    ],
    "commonMistakes": [
      "只看一面",
      "不听取反对意见",
      "先入为主"
    ],
    "practiceTips": [
      "看两面",
      "听取反对意见",
      "保持开放心态"
    ],
    "related": [
      "dunning-kruger-effect",
      "hanlons-razor",
      "goodharts-law"
    ]
  },
  {
    "slug": "hype-cycle-amaras-law",
    "title": "炒作周期与阿马拉定律",
    "shortTitle": "短期高估，长期低估",
    "description": "我们倾向于高估技术在短期内的效果，而低估其长期影响。",
    "group": "Decisions",
    "experience": "mid",
    "metaphor": "新技术刚出来，大家都说会改变世界。过一阵发现没那么厉害，就没人提了。但十年后，它真的改变了世界。",
    "example": "AI在60年代就被炒得很热，后来进入冬天。现在AI真的改变了世界。区块链也是，刚出来被炒上天，后来冷了，但长期可能真的有用。",
    "takeaways": [
      "短期高估新技术",
      "长期低估新技术",
      "不要被炒作影响"
    ],
    "commonMistakes": [
      "追热点",
      "忽视长期价值",
      "被炒作影响判断"
    ],
    "practiceTips": [
      "冷静看待新技术",
      "关注长期价值",
      "不要追热点"
    ],
    "related": [
      "goodharts-law",
      "galls-law",
      "second-system-effect"
    ]
  },
  {
    "slug": "lindy-effect",
    "title": "林迪效应",
    "shortTitle": "存在越久，越可能继续存在",
    "description": "某物使用的时间越长，它继续被使用的可能性就越大。",
    "group": "Decisions",
    "experience": "mid",
    "metaphor": "一本书出版了100年还在卖，它很可能再卖100年。一个技术用了20年还在用，它很可能再用20年。",
    "example": "COBOL语言60年了，还在用。它很可能再用60年。而一个刚出来的框架，可能3年就没人用了。选择技术时，优先选存在时间长的。",
    "takeaways": [
      "存在时间预测未来",
      "老技术更可靠",
      "不要追新"
    ],
    "commonMistakes": [
      "追新技术",
      "忽视老技术",
      "以为新的就是好的"
    ],
    "practiceTips": [
      "优先选择老技术",
      "不要追新",
      "关注长期价值"
    ],
    "related": [
      "hyrums-law",
      "postels-law",
      "hype-cycle-amaras-law"
    ]
  },
  {
    "slug": "first-principles-thinking",
    "title": "第一性原理",
    "shortTitle": "从根本出发思考",
    "description": "把复杂问题分解为最基本的组成部分，然后从那里开始构建。",
    "group": "Decisions",
    "experience": "mid",
    "metaphor": "别人说火箭很贵，你问火箭是什么做的？铝、钛、碳纤维。这些材料多少钱？只有火箭价格的2%。那我自己造不就行了？",
    "example": "大家都说做电商要建仓库、买物流。你问电商的本质是什么？连接买家和卖家。那我用平台模式，让商家自己发货不就行了？淘宝就是这么想出来的。",
    "takeaways": [
      "从根本出发",
      "质疑假设",
      "不要照搬别人的方法"
    ],
    "commonMistakes": [
      "照搬别人的方法",
      "不质疑假设",
      "想当然"
    ],
    "practiceTips": [
      "问为什么",
      "找到根本原因",
      "从零开始思考"
    ],
    "related": [
      "occams-razor",
      "kiss-principle",
      "galls-law"
    ]
  },
  {
    "slug": "inversion",
    "title": "逆向思维",
    "shortTitle": "反过来想问题",
    "description": "通过考虑相反的结果并从中倒推来解决问题。",
    "group": "Decisions",
    "experience": "mid",
    "metaphor": "你想成功，先想怎么失败。避免失败，就是成功。查理·芒格说：告诉我我会死在哪里，我就不去那里。",
    "example": "你想写出好代码，先想想什么样的代码是烂代码。避免写烂代码，就是写好代码。你想让系统稳定，先想想什么会让系统崩溃。",
    "takeaways": [
      "反过来想问题",
      "避免失败就是成功",
      "想想什么会出错"
    ],
    "commonMistakes": [
      "只想着成功",
      "不考虑失败",
      "不预防问题"
    ],
    "practiceTips": [
      "想想什么会出错",
      "避免失败的因素",
      "做最坏的打算"
    ],
    "related": [
      "first-principles-thinking",
      "murphys-law",
      "premature-optimization"
    ]
  },
  {
    "slug": "pareto-principle",
    "title": "帕累托法则",
    "shortTitle": "80%的结果来自20%的原因",
    "description": "大约80%的效果来自20%的原因。",
    "group": "Decisions",
    "experience": "junior",
    "metaphor": "你80%的收入来自20%的客户。你80%的bug来自20%的代码。找到那关键的20%，重点投入。",
    "example": "你分析bug，发现80%的bug来自20%的模块。那就重点测试这20%的模块。你分析用户，发现80%的投诉来自20%的用户。",
    "takeaways": [
      "关键少数很重要",
      "找到关键的20%",
      "重点投入"
    ],
    "commonMistakes": [
      "平均用力",
      "不知道什么是关键",
      "忽视少数"
    ],
    "practiceTips": [
      "找到关键的20%",
      "重点投入",
      "不要平均主义"
    ],
    "related": [
      "premature-optimization",
      "kiss-principle",
      "teslers-law"
    ]
  },
  {
    "slug": "cunninghams-law",
    "title": "坎宁安定律",
    "shortTitle": "想得到正确答案，先说错的",
    "description": "在网络上获得正确答案的最好方法不是提问，而是发布一个错误的答案。",
    "group": "Decisions",
    "experience": "junior",
    "metaphor": "你想知道怎么做某事，别问'怎么做'。直接说'我觉得应该这样做'，马上就会有人跳出来纠正你。",
    "example": "你在论坛问'这个bug怎么修'，没人回。你发帖说'这个bug肯定是框架的问题'，马上就有人告诉你其实是你的代码写错了。",
    "takeaways": [
      "人们喜欢纠正错误",
      "说错的比问对的更有效",
      "利用人的心理"
    ],
    "commonMistakes": [
      "不好意思说错",
      "怕被笑话",
      "不利用这个心理"
    ],
    "practiceTips": [
      "大胆说出你的想法",
      "不怕被纠正",
      "利用纠正获取知识"
    ],
    "related": [
      "linuss-law",
      "broken-windows-theory"
    ]
  }
]
}

export const categories = [
  { id: 'all', name: '全部', icon: '📚' },
  { id: 'Architecture', name: '架构', icon: '🏗️' },
  { id: 'Teams', name: '团队', icon: '👥' },
  { id: 'Planning', name: '规划', icon: '📋' },
  { id: 'Quality', name: '质量', icon: '✨' },
  { id: 'Scale', name: '规模', icon: '📈' },
  { id: 'Design', name: '设计', icon: '🎨' },
  { id: 'Decisions', name: '决策', icon: '🤔' }
]

export const experienceLevels = [
  { id: 'all', name: '全部', icon: '🌟' },
  { id: 'junior', name: '初级', icon: '🌱' },
  { id: 'mid', name: '中级', icon: '🌿' },
  { id: 'senior', name: '高级', icon: '🌳' }
]
