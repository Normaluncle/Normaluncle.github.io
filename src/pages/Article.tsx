import { Link, useParams } from 'react-router-dom'
import { IMG, notes } from '../content'

export default function Article() {
  const { slug } = useParams()
  const note = notes.find(n => n.slug === slug)
  if (!note) return <main className="page wrap"><h1>这篇笔记还不存在</h1><Link className="pill" to="/news">返回笔记</Link></main>
  return <main className="page article-page">
    <header className="wrap article-head">
      <Link className="article-back" to="/news">← 全部笔记</Link>
      <p className="kicker">{note.category} · {note.date}</p>
      <h1>{note.title}</h1><p className="article-deck">{note.excerpt}</p>
      <p className="article-author">王泽斌 / 项目与方法</p>
    </header>
    <figure className="article-cover wrap"><img src={IMG[note.img]} alt={note.title} /></figure>
    <article className="article-body">
      {note.sections.map(section => <section key={section.heading}>
        <h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}
      </section>)}
      <div className="article-next"><p className="kicker">继续阅读</p>{notes.filter(n => n.slug !== slug).map(n => <Link key={n.slug} to={`/news/${n.slug}`}>{n.title} ↗</Link>)}</div>
    </article>
  </main>
}
