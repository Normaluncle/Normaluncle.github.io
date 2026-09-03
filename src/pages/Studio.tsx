import { Link } from 'react-router-dom'
import { IMG, timeline } from '../content'
import { artMedia } from '../art'

export default function Studio() {
  return (
    <main className="page">
      <div className="wrap page-hero">
        <div>
          <p className="kicker">(关于我)</p>
          <h1>王泽斌。</h1>
        </div>
        <p className="side">美术生出身。画过墙，带过店，也摆过摊。现在，我把更多时间花在 AI 应用和能用起来的小产品上。</p>
      </div>
      <div className="portrait ph" data-ph="P-portrait">
        <img src={IMG.aboutPortrait} alt="王泽斌的个人形象照" decoding="async" />
      </div>
      <section className="about-story wrap"><p className="kicker">(关于这条路)</p><div><h2>看起来绕了一些路，<br/>做事的习惯却连着。</h2><p>画墙时，得考虑尺寸、材料和人从哪里看；带店时，得考虑大家忙起来还能不能照着流程走。后来做小程序和 AI 应用，我还是会先想：这个东西，最后到底是谁在用？</p><p>我不是传统程序员出身。现在主要用 AI 编程工具推进开发，自己负责方向、业务关系、交互和验证。工具帮我把想法做出来，但做什么、哪里不对、能不能交出去，仍然要自己判断。</p><p>我想找的是能把产品往前推的事情：跟着具体问题，把设计和实现接起来，而不只交一张好看的画面。</p></div></section>
      <header className="wrap about-time-head"><p className="kicker">(经历 / 2020—2026)</p><h2>一步一步，走到这里。</h2></header>
      <div className="wrap time">
        {timeline.map((t) => (
          <article key={t.year + t.title}>
            <span>{t.year}</span>
            <div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          </article>
        ))}
      </div>
      <section className="about-art wrap"><Link className="about-art-image" to="/art" aria-label="打开我的另一面，查看涂鸦与艺术作品"><img src={artMedia.find(m=>m.id==='gym-4')!.src} alt="砖墙上的彩色涂鸦与现场合影" loading="lazy"/></Link><div><p className="kicker">(简历之外)</p><h2>我的另一面。</h2><p>墙上的颜色，纸上的线条，屏幕里的小场景。这里放着那些不太适合塞进项目说明、但也很想给你看的东西。</p><Link className="pill" to="/art"><span className="pill-face">翻开这个作品夹 ↗</span></Link></div></section>
      <div className="about-next wrap"><Link to="/work">回到产品项目 ↗</Link><Link to="/contact">聊聊接下来可以做什么 ↗</Link></div>
    </main>
  )
}
