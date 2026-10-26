import { useRef, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { IMG, works, type ImgKey } from '../content'
import { caseStudies } from '../case-studies'

type Work = (typeof works)[number]

export default function Case() {
  const { slug } = useParams()
  const w = works.find((x) => x.slug === slug)
  if (!w) {
    return (
      <main className="wrap page">
        <h1>没有这个项目</h1>
        <Link className="pill" to="/work"><span className="pill-face">回项目</span></Link>
      </main>
    )
  }
  return <CaseView w={w} />
}

function CaseView({ w }: { w: Work }) {
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const study = caseStudies[w.slug]
  const heroScroll = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(heroScroll.scrollYProgress, [0, 1], [1.12, 1])
  const heroY = useTransform(heroScroll.scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <main className="page case">
      <div className="wrap case-intro">
        <p className="kicker">(项目介绍)</p>
        <h1>{w.title}</h1>
        <div className="case-meta">
          <span>项目年份 {w.year}</span>
          <span>{w.tag}</span>
        </div>
      </div>

      <section className="case-hero-pin" ref={heroRef}>
        <div className="case-hero-sticky">
          <motion.div
            className="case-hero ph"
            data-ph={`P-work-${w.slug}`}
            style={{ scale: reduced ? 1 : heroScale, y: reduced ? 0 : heroY }}
          >
            <img src={IMG[w.heroImg]} alt="" decoding="async" />
          </motion.div>
        </div>
      </section>

      <Copy>
        <p className="kicker">(为什么做)</p>
        <p>{w.lead}</p>
      </Copy>
      <section className="case-context wrap">
        <div><p className="kicker">起点 / CONTEXT</p><h2>先看当时的问题</h2><p>{study.origin}</p></div>
        <div><p className="kicker">我的角色 / ROLE</p><h2>从想法到实现</h2><p>{study.role}</p></div>
      </section>
      <section className="case-walkthrough wrap"><div><p className="kicker">不只看界面</p><h2>沿着流程，走一遍</h2><p>随着阅读逐步看清输入、处理与结果；也可以直接切换步骤。</p></div><div className="case-maps">{w.maps.map(m=><Link className="pill" key={m.href} to={m.href}><span className="pill-face">{m.label} ↗</span></Link>)}</div></section>
      <p className="case-image-note wrap">以下为 AI 辅助制作的产品展示图，用于说明界面方向；流程页展示完整版产品架构与业务关系。</p>
      {w.shots.map((k, i) => <section className="case-chapter" key={k}>
        {study.approach[i] && <div className="case-decision wrap"><span>0{i+1}</span><h2>{study.approach[i].title}</h2><p>{study.approach[i].body}</p></div>}
        <figure>{i < 2 ? <Bleed id={`P-case-${w.slug}-${i+1}`} src={k}/> : <Frame id={`P-case-${w.slug}-${i+1}`} src={k}/>}
        <figcaption className="wrap">{study.captions[i]}</figcaption></figure>
      </section>)}

      <Copy>
        <p className="kicker">(实现与边界)</p>
        <p>{w.end}</p>
        <blockquote className="case-takeaway">{study.takeaway}</blockquote>
      </Copy>

      <div className="wrap case-related-wrap">
        <p className="kicker">(继续探索)</p>
        <h2 className="case-related-title">其他项目</h2>
        <div className="case-related">
          {works.filter((o) => o.slug !== w.slug).map((o) => (
            <Link className="work-shot" key={o.slug} to={`/work/${o.slug}`}>
              <div className="ph" data-ph={`P-work-${o.slug}`} style={{ height: '100%' }}>
                <img src={IMG[o.img]} alt={o.title} style={{ objectPosition: o.coverPosition }} />
              </div>
              <span className="cap">{o.title} ({o.year})</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

function Copy({ children }: { children: ReactNode }) {
  return (
    <div className="wrap case-copy reveal">{children}</div>
  )
}

function Bleed({ id, src }: { id: string; src: ImgKey }) {
  return (
    <div className="case-bleed ph" data-ph={id}>
      <img src={IMG[src]} alt="" loading="lazy" decoding="async" />
    </div>
  )
}

function Frame({ id, src }: { id: string; src: ImgKey }) {
  return (
    <div className="case-frame ph" data-ph={id}>
      <img src={IMG[src]} alt="" loading="lazy" decoding="async" />
    </div>
  )
}
