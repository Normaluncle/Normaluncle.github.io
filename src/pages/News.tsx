import { Link } from 'react-router-dom'
import { IMG, notes } from '../content'

export default function News() {
  return (
    <main className="page">
      <div className="wrap page-hero">
        <div>
          <p className="kicker">(Blog)</p>
          <h1>笔记</h1>
        </div>
        <p className="side">记录项目中的设计选择，也整理来自现场的产品经验。</p>
      </div>
      <div className="wrap note-grid" style={{ paddingBottom: 80 }}>
        {notes.map((n, i) => (
          <Link className="note-card" key={n.title} to={`/news/${n.slug}`}>
            <div className="thumb ph" data-ph={`P-blog-${i + 1}`}>
              <img src={IMG[n.img]} alt="" />
              <span className="go">↗</span>
            </div>
            <time>{n.date}</time>
            <h3>{n.title}</h3><p className="note-excerpt">{n.excerpt}</p>
          </Link>
        ))}
      </div>
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <Link className="pill" to="/contact"><span className="pill-face">联系</span></Link>
      </div>
    </main>
  )
}
