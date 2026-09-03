import { Link } from 'react-router-dom'
import { IMG, works } from '../content'

export default function Work() {
  return (
    <main className="page">
      <div className="wrap page-hero">
        <h1>精选项目 <em style={{ color: '#bdbdbd', fontStyle: 'normal', fontSize: '0.35em' }}>({works.length})</em></h1>
        <div className="side">
          <p className="kicker">(作品 2025–26)</p>
          <p>四个不同场景，一条共同思路：先明确问题，再把界面、流程与实现连接起来。</p>
        </div>
      </div>
      <div className="wrap" style={{ display: 'grid', gap: 16, paddingBottom: 80 }}>
        {works.map((w) => (
          <Link className="work-shot" key={w.slug} to={`/work/${w.slug}`} style={{ aspectRatio: '16/8' }}>
            <div className="ph" data-ph={`P-work-${w.slug}`} style={{ height: '100%' }}>
              <img src={IMG[w.img]} alt={w.title} style={{ objectPosition: w.coverPosition }} />
            </div>
            <span className="cap">{w.title} ({w.year})</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
