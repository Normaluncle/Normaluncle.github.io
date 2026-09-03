import media from './art-media.json'

export const artGroups = [
  {id:'gym',no:'01',title:'体育馆',en:'MOVE IN COLOR',tag:'墙绘 · 运动与角色',intro:'把球场上的动作，留在墙上。大色块、夸张的角色和字形，是这组画面的共同语言。',cover:'gym-2',featured:['gym-2','gym-4','gym-1']},
  {id:'street',no:'02',title:'校园文化街',en:'WALLS WITH A VOICE',tag:'墙绘 · 公共空间',intro:'墙会被路过的人看见，也会和门、窗、灯光一起进入画面。这里保留完成后的现场，而不只是一张干净的设计稿。',cover:'street-1',featured:['street-1','street-2','street-4']},
  {id:'bar',no:'03',title:'酒吧',en:'AFTER HOURS',tag:'墙绘 · 室内空间',intro:'有的画面跟着灯光变暗，有的靠颜色把房间撑起来。从转角到整面墙，画是空间的一部分。',cover:'bar-8',featured:['bar-8','bar-1','bar-3']},
  {id:'illustration',no:'04',title:'二次元插画',en:'BETWEEN THE LINES',tag:'角色同人 · 线稿练习',intro:'换回纸面，节奏会慢下来。人物、花枝、装饰边框，一笔一笔把空白填满。这一组保留线稿的样子。',cover:'illustration-2',featured:['illustration-2','illustration-1','illustration-5']},
  {id:'model',no:'05',title:'3D 建模',en:'SMALL WORLDS',tag:'空间练习 · 渲染',intro:'几次把平面想象放进三维空间的尝试。比起完整的世界，我先从一间店、一段街景和它们的光开始。',cover:'model-3',featured:['model-3','model-1','model-2']},
  {id:'live',no:'06',title:'现场的几秒',en:'STILL, MOVING',tag:'Live 实况 · 影像记录',intro:'照片以外，还留下一点走动、转身和光线。点开播放，看看这些墙真正待着的地方。',cover:'live-5',featured:['live-3','live-5','live-7']},
]
const captions: Record<string,string> = {
 'gym-1':'运动主题角色与字形','gym-2':'室内长墙全景','gym-3':'砖墙角色与现场留影','gym-4':'连续墙面与角色组合','gym-5':'亮色角色墙绘','gym-6':'砖墙人物细节',
 'street-1':'校园长墙 · 字形与角色','street-2':'立面上的人物','street-3':'字形墙绘 · 现场留影','street-4':'夜间灯光下的墙面','street-5':'入口转角的角色',
 'bar-1':'转角墙面的几何色块','bar-2':'室内星球主题墙面','bar-3':'空间与连续画面','bar-4':'楼梯间角色局部','bar-5':'灯光下的角色与龙','bar-6':'角色墙绘近景','bar-7':'立柱上的图案','bar-8':'粉色与青色 · 完成现场',
 'illustration-1':'角色与植物 · 线稿','illustration-2':'人物与装饰框 · 横幅线稿','illustration-3':'人物与骷髅 · 线稿','illustration-4':'角色与龙 · 线稿','illustration-5':'人物与花枝 · 线稿',
 'model-1':'小型商店 · 场景渲染','model-2':'霓虹室内 · 视角练习','model-3':'夜间街景 · 场景练习',
 'live-1':'室内墙绘 · 色块局部','live-2':'室内墙绘 · 镜头转向','live-3':'室内墙绘 · 空间全景','live-4':'楼梯间墙绘 · 现场','live-5':'运动主题长墙 · 现场','live-6':'砖墙 · 字形与角色','live-7':'砖墙 · 人物近景','live-8':'街头墙绘 · 车辆局部','live-9':'街头墙绘 · 连续画面','live-10':'街头墙绘 · 转角',
}
export const artMedia = media.map(m=>({...m,caption:captions[m.id]||m.id}))
export type ArtMedia = (typeof artMedia)[number]
