import type { ImgKey } from './media'
export { IMG, mosaic, showreelImages, type ImgKey } from './media'

export const contact = { phone: '13107300786', email: 'normalmcamiu@gmail.com', domesticEmail: '2980869622@qq.com', location: '湖南 · 岳阳 · 临湘', qr: '/contact/wechat-qr.jpg' }

export type MapLink = { href: string; label: string }

export const works = [
  {
    slug: 'shengsuan',
    title: '胜算',
    year: '©26',
    tag: '陪伴式教育 AI',
    img: 'shengsuanCover' as ImgKey,
    heroImg: 'shengsuanHero' as ImgKey,
    coverPosition: '100% 50%',
    lead: '我想做的，不是一个等人提问的题库。学生会问题，也会说“今天好累”。胜算从企业微信进入这些日常：记得之前聊过什么，知道现在面对的是学生还是家长，在适合的时候回应。它是我持续投入最多的个人项目。',
    challenge: '最先要理清的是“谁在说话”。访客激活、学生登记、家长绑定，各走各的路径；正式聊天再读取话题、关系和人格。即时回复由 System 1 处理，耗时的检索交给 System 2，避免所有事情挤在一次回复里。',
    end: '做得越深，我越在意那些不显眼的状态：登记中能否退出、检索失败怎么办、同一个提醒会不会发两遍。现在的工作重点，是把这些状态串稳，再继续打磨陪伴感。下方按完整产品愿景，把对话、记忆、Soul、学习规划与家校协作接起来讲。',
    maps: [
      { href: '/systems/shengsuan', label: '滚动看系统如何运行' },
      { href: '/systems/shengsuan-chat', label: '一次对话' },
      { href: '/systems/shengsuan-soul', label: '心跳与日常' },
      { href: '/systems/shengsuan-daily', label: '学习规划' },
    ] as MapLink[],
    shots: ['shengsuanShot1', 'shengsuanShot2', 'shengsuanShot3', 'shengsuanShot4', 'shengsuanShot5'] as ImgKey[],
  },
  {
    slug: 'yingxiao',
    title: '营销助手',
    year: '©26',
    tag: '商业项目 · 线索采集与评估',
    img: 'marketingCover' as ImgKey,
    heroImg: 'marketingHero' as ImgKey,
    coverPosition: '50% 48%',
    lead: '这是我接的第一个商业 AI 项目。客户需要的不是更多链接，而是从公开内容里找到值得继续了解的人。我把搜索、详情、评论和用户资料整理进同一条任务链，再让 AI 给出判断理由，供团队筛选。',
    challenge: '一条评论看起来像需求，不代表发评论的人就是目标客户。因此评估分成两路：一路看需求，另一路看身份与上下文。有分歧再交给仲裁，不让一个分数把所有判断藏起来。采集和评估都记录进度，中途停下也知道从哪里接着做。',
    end: '这个项目让我真正碰到交付里的复杂度：规则会变、页面会变、客户对“合格”的理解也会变。我把规则、评估理由、经验记忆和执行日志留在系统里。这里展示采集与评估这部分，不把线索数量等同于成交，也不把外联算作已完成的能力。',
    maps: [
      { href: '/systems/yingxiao', label: '滚动看采集与评估' },
    ] as MapLink[],
    shots: ['marketingShot1', 'marketingShot2', 'marketingShot3'] as ImgKey[],
  },
  {
    slug: 'agent',
    title: '任务 Agent',
    year: '©26',
    tag: '自用项目 · 求职任务助手',
    img: 'agentCover' as ImgKey,
    heroImg: 'agentHero' as ImgKey,
    coverPosition: '86% 50%',
    lead: '做完给团队用的信息筛选，我把同样的思路用回自己身上：找工作。岗位很多，但方向、城市、薪资和真正能做的事情经常对不上。这个助手从我的偏好出发，把值得认真看的岗位挑出来，再准备沟通草稿。',
    challenge: '筛选不只问“匹不匹配”。它还要看岗位内容、企业信息和到手收入，把明确的红线放进规则，而不是交给模型猜。文案先经过我的确认；确认和否掉的理由会留下来，逐渐修正下一次的表达。',
    end: '它是自用项目，不是一个已经服务很多人的平台。当前代码包含批次调度、分层筛选、薪资规则和确认流程，也保留模拟适配器用于验证。实际平台接入仍依赖登录状态和环境检查；页面中的流程演示不会替我执行投递。',
    maps: [
      { href: '/systems/agent', label: '滚动看任务如何执行' },
    ] as MapLink[],
    shots: ['agentShot1', 'agentShot2', 'agentShot3'] as ImgKey[],
  },
  {
    slug: 'stall',
    title: '摆摊点单',
    year: '©25',
    tag: '小程序',
    img: 'stallCover' as ImgKey,
    heroImg: 'stallHero' as ImgKey,
    coverPosition: '0% 50%',
    lead: '和家人摆摊的时候，我做了这个点单小程序。同样的食材，可以拿串吃、拌碗吃，也可以卷进饼里。人一多，光靠口头重复很容易混。我想把“吃什么、怎么吃、轮到哪一单”都放在眼前。',
    challenge: '顾客侧按食材和吃法确认，商家侧按订单安排制作。两个界面面对的是不同的人：一个要选得明白，一个要忙的时候也能看懂。我没有把它做成复杂的经营后台，先把最常发生的几步排顺。',
    end: '这个项目不大，但它让我重新理解“简单”。不是把按钮删到最少，而是在顾客点完、我转身去做东西的时候，信息还在那里。做完这件事，我开始更认真地看待现场里那些看似微小的交接。',
    maps: [{ href: '/systems/stall', label: '滚动看双端点单流程' }] as MapLink[],
    shots: ['stallShot1', 'stallShot2', 'stallShot3'] as ImgKey[],
  },
] as const


export const heroSkills = ['产品逻辑', '界面设计', '小程序', 'AI 应用', '工作流']
export const partners = [
  { t: '视觉', s: '工作室', b: '从海报、物料到现场布置，把视觉方案变成实际交付。' },
  { t: '运营', s: '门店现场', b: '带客、排场与交接，理解流程如何在忙碌时保持清楚。' },
  { t: '游戏', s: '交互原型', b: '通过场景、氛围与可玩原型，探索画面背后的体验。' },
  { t: '点单', s: '小程序', b: '连接顾客选择、订单确认与厨房出餐。' },
  { t: '胜算', s: '学习陪伴', b: '从身份与对话开始，逐步接上记忆和日常提醒。' },
  { t: '营销', s: '信息评估', b: '规则先行、来源可查，为人的判断准备材料。' },
  { t: '任务', s: '对话 Agent', b: '先确认目标与范围，再执行并汇总结果。' },
  { t: '整合', s: '从设计到实现', b: '把产品逻辑、界面与工作流接成一个完整体验。' },
]
export const awards = [
  { title: '涂鸦工作室', meta: '物料与现场视觉', year: '2020' },
  { title: '独立游戏原型', meta: '场景 · 氛围 · 策划', year: '2022–24' },
  { title: '剧本杀门店', meta: '接待 · 排场 · SOP', year: '2023' },
  { title: '摆摊点单', meta: '顾客点单与出餐流程', year: '2025' },
  { title: '胜算', meta: '企业微信学习陪伴', year: '2026' },
  { title: '营销与任务 Agent', meta: '信息筛选与人审流程', year: '2026' },
]
export const timeline = [
  { year: '2020', title: '从一面墙开始', body: '大学里做涂鸦工作室，接墙绘、做教练，也参加下乡公益涂鸦。尺寸、材料、灯光和现场条件，都是画面的一部分。' },
  { year: '2023', title: '从画面，走进人的现场', body: '做剧本杀店长，负责接待、排场、控场和带新人。流程写得再好，忙起来用不了，就还得改。' },
  { year: '2025', title: '开始把想法做成工具', body: '从 n8n 工作流接触 AI 应用。和家人摆摊时，做了顾客与商家双端的点单小程序；需求就在眼前，不需要想象。' },
  { year: '2026 初', title: '胜算：想做一个能陪伴的 AI', body: '从聊天入口做起，逐渐加入身份、记忆、关系和自己的日常节奏。比起答得更快，我更在意它能不能接住前后发生的事情。' },
  { year: '2026 春', title: '第一次商业 AI 交付', body: '做小红书线索采集与评估系统，把浏览、清洗、双路评估和结果复核串起来。也开始认真处理需求变化、交付节奏和验收。' },
  { year: '2026 夏', title: '把同一套思路用回自己', body: '做自用求职助手：按照偏好筛岗位、解释为什么留下、准备沟通草稿。与此同时，继续整理作品和胜算的下一步。' },
]
export const services = [
  { n: '001', t: '对话产品', d: '先理清使用者、关系与场景，再设计身份、回复和记忆的连接方式。', img: 'serviceWecom' as ImgKey },
  { n: '002', t: '任务编排', d: '把周期任务与即时交互分开组织，让状态、触发条件和执行边界清晰可查。', img: 'serviceHeartbeat' as ImgKey },
  { n: '003', t: '信息评估', d: '从规则配置到来源回溯，为自动筛选保留解释与人工复核的位置。', img: 'serviceReview' as ImgKey },
  { n: '004', t: 'Agent 交互', d: '把复杂操作整理成可确认的步骤，让人知道系统准备做什么、已经做了什么。', img: 'serviceAgent' as ImgKey },
  { n: '005', t: '设计与实现', d: '从草图、界面到可运行版本，让视觉细节和业务流程一起落地。', img: 'serviceVisual' as ImgKey },
]
export const faqs = [
  { q: '目前关注什么机会？', a: '关注 AI 应用落地与产品相关机会，希望参与传统业务的 AI 改造，或与初创团队一起把需求做成可用产品。' },
  { q: '可以进一步了解项目吗？', a: '可以。作品页包含产品界面、问题拆解与系统图。沟通时也可以围绕具体流程，说明设计选择、实现边界和仍需验证的地方。' },
  { q: '你通常负责哪一部分？', a: '我主要负责需求梳理、产品逻辑、界面与交互，并借助 AI 编程工具推进实现和验证。具体项目会先讲清楚由谁负责什么、做到哪里算完成。' },
  { q: '怎样开始沟通？', a: '可以通过联系页的邮箱、电话或微信二维码找到我。简要说说你的业务场景、当前问题与期望时间，我们再一起判断下一步。' },
]
export const quotes = [
  { role: '摆摊点单 / 现场笔记', who: "忙起来，没有时间研究界面", text: '一边收钱、一边做吃的，还要记谁点了什么。给自己做工具后，我才更在意：一个人转过身再回来，能不能一眼接上刚才的事情。', img: 'quote3' as ImgKey, avatar: 'quoteAvatar3' as ImgKey, dark: false },
  { role: '营销助手 / 项目复盘', who: "留下链接，也得留下理由", text: '只有分数，下一次还是得重新看。为什么留下这个人，哪里像需求，哪里还不确定——这些说清楚，结果才真的能交到别人手里。', img: 'quote2' as ImgKey, avatar: 'quoteAvatar2' as ImgKey, dark: true },
  { role: '胜算 / 产品判断', who: "能说很多，不等于会陪伴", text: '学生说累了，不一定是在等学习建议。我想让胜算先明白这句话，再决定要不要继续问、要不要提醒，有时候也该少说一点。', img: 'quote1' as ImgKey, avatar: 'quoteAvatar1' as ImgKey, dark: false },
  { role: '门店经历 / 留下的习惯', who: "流程要在人忙的时候也管用", text: '带场、排班、交接，最怕的是事情只在一个人脑子里。这段经历后来一直跟着我：先把状态摆出来，再谈能不能自动化。', img: 'quote4' as ImgKey, avatar: 'quoteAvatar4' as ImgKey, dark: false },
]
export const stats = [
  { n: '1', l: '条贯穿交付的思路', s: '把需求、界面与实现接起来。', tag: '方法', no: '001', bline: '不把设计与功能割裂：先确认问题，再做原型、实现和使用验证。' },
  { n: '2020', l: '从视觉实践出发', s: '从物料与现场，走向交互与系统。', tag: '起点', no: '002', bline: '早期的视觉交付和现场经验，逐渐成为我理解产品需求的基础。' },
  { n: '3', l: '个 AI 应用方向', s: '学习陪伴、团队评估、个人任务。', tag: '探索', no: '003', bline: '不同入口，共同原则：身份清楚、执行有边界、结果能复核。' },
  { n: '4', l: '个精选项目', s: '在作品页展开问题、界面与流程。', tag: '项目', no: '004', bline: '胜算、营销助手、任务 Agent 与摆摊点单，分别回应不同的使用场景。' },
]
export { notes } from './articles'
export const visionWords = ['先理解问题', '把流程理清', '让交互自然', '让系统可用', '再持续迭代']
export const chat = [
  { who: '学生', avatar: 'chatAvatar1' as ImgKey, t: '这题我卡住了，不知道从哪一步开始。', me: true },
  { who: '胜算', avatar: 'chatAvatar2' as ImgKey, t: '先别急着算。把已知条件和问题分开写给我。', me: false },
  { who: '学生', avatar: 'chatAvatar1' as ImgKey, t: '已知抛物线过这两个点，要求对称轴。', me: true },
  { who: '胜算', avatar: 'chatAvatar2' as ImgKey, t: '先看看题目是否还有其他条件。两点未必能确定一条抛物线，我们一起把信息补齐。', me: false },
]


const sceneMessages = (lines: string[]) => lines.map((t, i) => ({
  who: i % 2 ? '胜算' : '学生', avatar: (i % 2 ? 'chatAvatar2' : 'chatAvatar1') as ImgKey, t, me: i % 2 === 0,
}))
export const chatScenes = [
  { label: '一起做题', messages: chat },
  { label: '聊聊压力', messages: sceneMessages([
    '今天好累，明明一直在学，还是觉得自己什么都没做好。',
    '听起来你今天绷了很久。先不用急着证明自己，想和我说说最累的是哪一件事吗？',
    '就是一看到别人都写完了，我就更着急。',
    '嗯，那种被落下的感觉不好受。先歇一小会儿，再只看你自己的下一小步，好不好？',
  ]) },
  { label: '安排今天', messages: sceneMessages([
    '今天只剩半小时了，我还想把所有错题都做完。',
    '先别把这半小时塞满。挑一道最想弄懂的题，剩下的留给明天怎么样？',
    '那就先看今天一直错的那道函数题。',
    '好，先找出卡住的那一步。今天能把这一点讲清楚，就已经有收获了。',
  ]) },
]
