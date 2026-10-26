import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'motion/react'
import {
  IMG, faqs, heroSkills, mosaic, showreelImages, notes, partners,
  quotes, services, stats, visionWords, works,
} from '../content'

import ChatDemo from '../ui/ChatDemo'
import ContactPanel from '../ui/ContactPanel'
import { titleUnits } from '../ui/titleUnits'

function Ph({ id, src, alt = '' }: { id: string; src: string; alt?: string }) {
  return (
    <div className="ph" data-ph={id} style={{ height: '100%' }}>
      <img src={src} alt={alt} decoding="async" />
    </div>
  )
}

// unified word/char clip-rise: words (or chars for CJK text without
// spaces) rise out of individual clip boxes, staggered left→right. The
// host keeps .reveal so Shell's IntersectionObserver triggers it once.
function Rise({
  text,
  step = 0.045,
  delay = 0,
  phrases,
}: {
  text: string
  step?: number
  delay?: number
  phrases?: string[]
}) {
  let unitIndex = 0
  return (
    <span className={text.includes('\n') ? 'rvw rvw-multiline' : 'rvw'} aria-label={text}>
      {text.split('\n').map((line, row) => {
        const groups = phrases?.filter(phrase => line.includes(phrase))
        const grouped = !!groups && groups.join('') === line
        return <span className="rv-line" key={row} aria-hidden>
          {(grouped ? groups : [line]).map((phrase, group) => <span className={grouped ? 'rv-phrase' : undefined} key={group}>
            {titleUnits(phrase).map((unit, i) => <span className="rv-w" key={i}>
              <span style={{ transitionDelay: `${(delay + unitIndex++ * step).toFixed(3)}s` }}>{unit}</span>
            </span>)}
          </span>)}
        </span>
      })}
    </span>
  )
}

function Capsule({
  to, children, className = '', style,
}: {
  to: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <Link className={`pill ${className}`} to={to} style={style}>
      <span className="pill-face">{children}</span>
    </Link>
  )
}

export default function Home() {
  const visSecRef = useRef<HTMLElement>(null)
  const visPinRef = useRef<HTMLDivElement>(null)
  const tstRef = useRef<HTMLDivElement>(null)
  const workRef = useRef<HTMLElement>(null)
  const [svc, setSvc] = useState(0)
  const [faq, setFaq] = useState<number | null>(null)
  const [workI, setWorkI] = useState(0)
  const [tstmI, setTstmI] = useState(0)
  const showreelRef = useRef<HTMLElement>(null)
  const talkRef = useRef<HTMLElement>(null)

  // Browser chrome changes height mid-gesture; only a width change should
  // remeasure the mobile pin geometry (including an orientation change).
  const pageRef = useRef<HTMLElement>(null)
  useEffect(() => {
    let width = -1
    const measure = () => {
      if (width === window.innerWidth) return
      width = window.innerWidth
      pageRef.current?.style.setProperty('--home-screen', `${window.innerHeight}px`)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // the hero is a sticky direct child of <main>: it stays pinned at the
  // viewport top and the following sections (z-index 2, opaque) slide over
  // it like a curtain. The shrink runs over the first ~1780px of scroll —
  // mono's badge fill completes at y=1780 ≈ their sticky release
  const { scrollY } = useScroll()
  const hp = useTransform(scrollY, [0, 1780], [0, 1])
  // Mosaic sits fully behind the white card; card holds near-full then eases shut.
  const mosOp = useTransform(hp, [0, 0.02], [1, 1])
  const cardScale = useTransform(hp, [0, 0.2, 0.45, 0.75, 1], [1, 1, 0.82, 0.65, 0.5])
  const cardY = useTransform(hp, [0, 1], ['0%', '-3%'])
  const mosScale = useTransform(hp, [0, 1], [1.04, 1])
  // parallax: the mosaic drifts up behind the shrinking card so the
  // background keeps "traveling" with the scroll instead of only scaling
  const mosY = useTransform(hp, [0.25, 1], ['0%', '-2%'])
  // 向下探索 badge: inner bar wipes left→right with hero progress
  const sdX = useTransform(hp, [0, 1], ['-100%', '0%'])
  const sdOp = useTransform(hp, [0, 0.8, 0.94, 1], [1, 1, 0, 0])
  const sdY = useTransform(hp, [0.8, 1], [0, -12])

  // progress domain = the pin's sticky range (800vh pin − 100vh sticky = 700vh),
  // matching mono's 6300px sampled range so all sampled timings transfer 1:1
  const visScroll = useScroll({ target: visPinRef, offset: ['start start', 'end end'] })
  const visP = visScroll.scrollYProgress
  // light→dark: the dark overlay fades in as the section ENTERS the
  // viewport (curve rides in on the previous section's light gray), so the
  // transition finishes by the time the pin engages — previously the fade
  // was bound to visP (0 until the pin starts), leaving the section a
  // single flat dark from the first pixel
  const visBgColor = useTransform(visP, [0, .35, .72, 1], ['#f2f1ee', '#b9b7b4', '#292b2d', '#05070a'])
  const visTextColor = useTransform(visP, [0, .37, .55, 1], ['#191a1c', '#191a1c', '#ffffff', '#ffffff'])
  const visTextOpacity = useTransform(visP, [.74, .81], [1, 0])
  // mono vision model (sampled): pin = 800vh, sticky range 700vh. Five stacked
  // words; each letter wipes IN (opacity 0→1, translateY +100%→0) then OUT
  // (1→0, 0→-100%), left→right, scroll-linked. Per letter: fade span R,
  // stagger D; word cycle 990px, in starts 208px after previous out.
  // Portrait then scales 0→1.3 centered over the tail and settles at 0.6.
  const photoScale = useTransform(visP, [.76, .94, 1], [.08, 1, 1])
  const photoOp = useTransform(visP, [0, .76, .761, 1], [0, 0, 1, 1])

  const workScroll = useScroll({ target: workRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(workScroll.scrollYProgress, 'change', (v) => {
    const i = Math.min(works.length - 1, Math.max(0, v < .31 ? 0 : v < .57 ? 1 : v < .83 ? 2 : 3))
    setWorkI(i)
  })

  const svcRows = useRef<(HTMLDivElement | null)[]>([])
  // services: center-tracking — whichever row is nearest the viewport middle
  // lights up (mono does this rather than a scroll-range map)
  useEffect(() => {
    let raf = 0
    const pick = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.5
        let best = -1
        let bd = Infinity
        svcRows.current.forEach((el, i) => {
          if (!el) return
          const r = el.getBoundingClientRect()
          if (r.bottom < 0 || r.top > window.innerHeight) return
          const d = Math.abs(r.top + r.height / 2 - mid)
          if (d < bd) {
            bd = d
            best = i
          }
        })
        if (best >= 0) setSvc(best)
      })
    }
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    pick()
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
      cancelAnimationFrame(raf)
    }
  }, [])


  const showScroll = useScroll({ target: showreelRef, offset: ['start start', 'end end'] })
  const showP = showScroll.scrollYProgress
  const talkScroll = useScroll({ target: talkRef, offset: ['start end', 'end start'] })
  const talkBgScale = useTransform(talkScroll.scrollYProgress, [0, 1], [1, 1.15])
  // showreel (round3 model restored): center cell scales DOWN into the grid
  // while the surrounding strips slide in from outside; then the whole grid
  // shrinks with scroll; the title letters roll up in on entry and roll up
  // out after the grid reaches its smallest, then the pin releases
  // mono testimonials (sampled): pin 4500px (sticky range 3600, hold 3800 so
  // the stack releases at rel 2900). All four cards sit stacked at
  // (515, 225, 400x450); scrolling slings them out one by one with a 3D
  // tumble (matrix keyframes sampled every 50px from the original)
  const tstScroll = useScroll({ target: tstRef, offset: ['start start', 'end end'] })
  const tp = tstScroll.scrollYProgress
  // mono testimonial sequence: stage 1 a full-bleed photo (two seamless
  // halves); stage 2 the halves slide apart like doors (rel 400–1100)
  // revealing the sticky-note stack beneath; stage 3 the top card "opens"
  // (settles from a lifted tilt, rel 900–1400); stage 4 the sampled
  // slingshot fly-outs (shifted +800 from the original windows)
  const doorLX = useTransform(tp, (v) =>
    `${(-100 * vRamp(v * T_D, 400, 1100)).toFixed(2)}%`)
  const doorRX = useTransform(tp, (v) =>
    `${(100 * vRamp(v * T_D, 400, 1100)).toFixed(2)}%`)
  // the door photo breathes: slow 1.12 → 1 settle while it holds/opens
  const doorImgScale = useTransform(tp, (v) =>
    1.12 - 0.12 * vRamp(v * T_D, 0, 1100))
  // counter follows the scroll sequence (which card is on top)
  useMotionValueEvent(tp, 'change', (v) => {
    const rel = v * T_D
    setTstmI(rel < 1400 ? 0 : rel < 2200 ? 1 : rel < 3000 ? 2 : 3)
  })

  return (
    <main className="home-page" ref={pageRef}>
      <section className="hero-sticky" data-rail data-theme="light">
        <div className="hero-pin">
          <motion.div
            className="mosaic"
            style={{ opacity: mosOp, scale: mosScale, y: mosY }}
            aria-hidden
          >
            {mosaic.map((k, i) => (
              <HeroMosaicCell
                key={k + i}
                id={`P-mosaic-${i + 1}`}
                src={IMG[k]}
                i={i}
                progress={hp}
              />
            ))}
          </motion.div>
          <motion.div
            className="hero-card"
            data-ph="P-hero"
            style={{ scale: cardScale, y: cardY }}
          >
            <div className="hero-top">
              <div className="hero-skills">
                {heroSkills.map((s) => <div key={s}>{s}</div>)}
              </div>
              <div className="hero-copy">
                <p>美术生出身，后来一头扎进 AI。画过墙，带过店，也给自己和别人做过工具。下面是它们。</p>
                <Capsule to="/contact">聊聊需求</Capsule>
              </div>
            </div>
            <div className="hero-dots" aria-hidden>{[0, 1, 2, 3].map((i) => <i key={i} />)}</div>
            <p className="hero-copyr">© 2026 王泽斌</p>
            <h1 className="hero-word"><span>王泽斌</span><span className="hero-collection">作品集</span></h1>
          </motion.div>
          <motion.span className="scroll-down" style={{ opacity: sdOp, y: sdY }}>
            向下探索
            <i className="sd-track" aria-hidden>
              <motion.b className="sd-fill" style={{ x: sdX }} />
            </i>
          </motion.span>
        </div>
      </section>

      <section className="partners" data-rail data-theme="light">
        <div className="wrap">
          <div className="meta-row reveal">
            <span>(Partners)</span>
            <span>·</span>
            <span>2020–26©</span>
            <span>·</span>
          </div>
          <div className="partner-grid reveal reveal-late reveal-card">
            {partners.map((p, i) => (
              <PartnerFlip key={p.t} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="work-sec" ref={workRef} data-rail data-theme="light">
        <div className="work-pin">
        <div className="work-left">
          <p className="kicker reveal">(Portfolio 26©)</p>
          <h2 className="reveal rvw-host reveal-late">
            <Rise text="Work" step={0.08} /> <em>({works.length})</em>
          </h2>
          <span className="mini-dot reveal reveal-later" />
          <div className="work-pill-wrap reveal reveal-later">
            <Capsule to="/work">查看全部项目</Capsule>
            <span className="work-pill-thumb">
              <img src={IMG[works[workI].img]} alt="" />
            </span>
          </div>
        </div>
        <div className="work-right">
          {works.map((w, i) => <WorkStackCard key={w.slug} w={w} i={i} p={workScroll.scrollYProgress} />)}
        </div>
        </div>
      </section>

      <section className="who wrap" data-rail data-theme="light">
        <div className="who-head">
          <p className="kicker reveal">(关于我)</p>
          <div className="reveal rvw-host reveal-late">
            <p className="kicker">王泽斌</p>
            <h2>
              <Rise text={'画过墙，带过场，也摆过摊\n现在，把那些想法做成能用的产品'} phrases={['画过墙，','带过场，','也摆过摊','现在，','把那些想法','做成能用的产品']} step={0.03} />
            </h2>
          </div>
        </div>
        <div className="who-dots reveal" aria-hidden>{[0, 1, 2, 3].map((i) => <i key={i} />)}</div>
        <div className="who-grid reveal reveal-late reveal-card">
          <div className="card dark">
            <p className="kicker">(Practice)</p>
            <div>
              <div className="big">{works.length}</div>
              <p>个精选项目</p>
            </div>
          </div>
          <ChatDemo />
          <div className="card light">
            <p className="kicker">(Now)</p>
            <p className="morph">胜算（陪伴式教育 AI）</p>
            <p style={{ color: '#777', fontSize: 14 }}>从一道不会的题，到一句“今天好累”。这是我目前持续投入最多的个人项目。</p>
            <Capsule to="/studio" style={{ marginTop: 24 }}>我的经历与时间线</Capsule>
          </div>
        </div>
      </section>

      <section className="vision" ref={visSecRef} data-rail data-theme="dark">
        <Curve />
        <div className="vision-pin" ref={visPinRef}>
          <motion.div className="vision-bg" style={{ backgroundColor: visBgColor }} />
          <div className="vision-sticky">
            <motion.div
              className="vision-inner"
              style={{ color: visTextColor, opacity: visTextOpacity }}
            >
              <p className="vision-lab">(我的设计原则)</p>
              <div className="vision-stage">
                {visionWords.map((w, i) => (
                  <VisLine key={w} w={w} i={i} p={visP} />
                ))}
              </div>

              <p className="vision-more">(继续探索)</p>
            </motion.div>
            <motion.div className="vision-photo ph" data-ph="P-vision" style={{ scale: photoScale, opacity: photoOp }}>
              <img src={IMG.visionPortrait} alt="王泽斌的肖像" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="svc-pin" data-rail data-theme="light">
        <Curve flip />
        <div className="svc-sticky">
        <div className="wrap">
          <div className="svc-head reveal">
            <span className="kicker">(Services)</span>
            <span className="dots" aria-hidden><i /><i /></span>
            <Capsule to="/contact">开始沟通</Capsule>
          </div>
          <div className="svc-body">
            <div>
              {services.map((s, i) => (
                <div
                  className={i === svc ? 'svc-row on' : 'svc-row'}
                  key={s.n}
                  ref={(el) => { svcRows.current[i] = el }}
                >
                  <span className="n reveal">({s.n})</span>
                  <span className="t reveal reveal-late">{s.t}</span>
                </div>
              ))}
            </div>
            <div className="svc-side">
              {services.map((s, i) => (
                <div
                  className={i === svc ? 'svc-pane on' : 'svc-pane'}
                  key={s.n}
                  aria-hidden={i !== svc}
                >
                  <div className="ph" data-ph={`P-svc-${s.n}`}>
                    <img src={IMG[s.img]} alt="" />
                  </div>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="showreel-pin" ref={showreelRef} data-rail data-theme="dark">
        <div className="showreel">
          <motion.div className="reel-grid">
            {REEL_IMGS.map((src, i) => (
              <ReelCell key={src + i} i={i} src={src} p={showP} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="reel-bridge" data-rail data-theme="light">
        <Curve flip />
        <div className="wrap bridge-inner">
          <p className="kicker reveal">(Process)</p>
          <h2 className="reveal rvw-host">
            <Rise text="把下一件做成" step={0.055} />
          </h2>
          <p className="bridge-copy reveal reveal-late">先确认目标和限制，再用原型与可运行版本持续验证。</p>
          <div className="bridge-cards reveal reveal-late reveal-card">
            <article><img className="bridge-image" src={IMG.processStart} alt="" loading="lazy" decoding="async" /><span>01</span><h3>先聊问题</h3><p>目标、限制、真正要交付什么。</p></article>
            <article><img className="bridge-image" src={IMG.processFinish} alt="" loading="lazy" decoding="async" /><span>02</span><h3>做到上线</h3><p>从原型到实现，让每轮反馈都有具体落点。</p></article>
          </div>
        </div>
      </section>

      <section className="tstm" data-rail data-theme="light">
        <div className="tstm-pin" ref={tstRef}>
          <div className="tstm-hold">
            <div className="tstm-sticky">
              <span className="tstm-lab">(做过之后，留下的话)</span>
              <span className="tstm-count">{String(tstmI + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}</span>
              <div className="tstm-stage">
                {quotes.map((q, i) => (
                  <TCard key={q.role} q={q} i={i} p={tp} />
                ))}
              </div>
              <motion.div className="t-door t-door-l" style={{ x: doorLX }} aria-hidden>
                <motion.img src={IMG.testimonialsDoor} alt="" style={{ scale: doorImgScale }} />
              </motion.div>
              <motion.div className="t-door t-door-r" style={{ x: doorRX }} aria-hidden>
                <motion.img src={IMG.testimonialsDoor} alt="" style={{ scale: doorImgScale }} />
              </motion.div>
              <div className="tstm-dots">
                {quotes.map((_, i) => (
                  <span key={i} className={i === tstmI ? 'on' : ''} />
                ))}
              </div>
              <p className="tstm-more">(继续探索)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq wrap" data-rail data-theme="light">
        <div className="meta-row reveal">
          <span>(FAQ)</span>
          <span>·</span>
          <span>·</span>
          <span>·</span>
        </div>
        <div className="faq-grid reveal reveal-late reveal-card">
          {faqs.map((f, i) => (
            <div className="faq-item" key={f.q}>
              <button type="button" aria-expanded={faq === i} aria-controls={`faq-answer-${i}`} onClick={() => setFaq(faq === i ? null : i)}>
                <span><span className="n">0{i + 1}</span>{f.q}</span>
                <span className="faq-plus">{faq === i ? '–' : '+'}</span>
              </button>
              <div id={`faq-answer-${i}`} className={faq === i ? 'faq-ans open' : 'faq-ans'} aria-hidden={faq !== i}>
                <div><p>{f.a}</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="more">
          <p className="kicker">(Looking for more?)</p>
          <h3 className="reveal rvw-host">
            <Rise text="想进一步了解项目的设计与实现？" step={0.03} />
          </h3>
          <Link to="/contact">联系我</Link>
        </div>
      </section>

      <section className="stats-sec" data-rail data-theme="dark">
        <div className="wrap">
          <div className="stats-lead reveal rvw-host">
            <p className="kicker">(Stats)</p>
            <h2>
              <Rise text="经历，落到具体项目" step={0.05} />
            </h2>
            <p>用项目、起点和方法，说明我正在做什么。</p>
            <Capsule className="ghost" to="/contact">聊聊需求</Capsule>
          </div>
        </div>
        <div className="stat-grid reveal reveal-late reveal-card">
          {stats.map((s) => (
            <StatCard key={s.l} s={s} />
          ))}
        </div>
        <div className="wrap">
          <div className="success">
            <div className="pic ph" data-ph="P-success">
              <img src={IMG.successImage} alt="" />
            </div>
            <div className="quote">
              <p className="kicker">(项目思考)</p>
              <p>把 AI 放进真实关系里，比让它说一句漂亮的话更重要。胜算围绕学生与家长的不同需求，连接对话、记忆和任务。</p>
              <footer style={{ marginTop: 24, color: '#aaa' }}>胜算 · 企业微信学习陪伴</footer>
            </div>
          </div>
        </div>
      </section>

      <section className="notes" data-rail data-theme="light">
        <div className="notes-sheet">
          <Curve flip />
          <div className="notes-body">
          <div className="wrap">
          <div className="notes-head reveal rvw-host">
            <span className="kicker">(Blog)</span>
            <h2>
              <Rise text="项目背后的思考" step={0.06} />
            </h2>
            <Capsule to="/news">全部笔记</Capsule>
          </div>
          <div className="note-grid reveal reveal-late reveal-card">
            {notes.map((n, i) => (
              <Link className="note-card" to={`/news/${n.slug}`} key={n.title}>
                <div className="thumb ph" data-ph={`P-blog-${i + 1}`}>
                  <img src={IMG[n.img]} alt="" />
                  <span className="go">↗</span>
                </div>
                <time>{n.date}</time>
                <h3>{n.title}</h3>
              </Link>
            ))}
          </div>
          </div>
          </div>
          <Curve />
        </div>
      </section>

      <section className="talk" ref={talkRef} data-rail data-theme="dark">
        <motion.div className="talk-bg ph" data-ph="P-talk" style={{ scale: talkBgScale }}>
          <img src={IMG.contactBackground} alt="" />
        </motion.div>
        <ContactPanel />
      </section>
    </main>
  )
}

// mono vision letters (sampled): each char is a double-layer span — a static
// placeholder keeps layout while an animated clone wipes IN (opacity 0→1,
// translateY +124.797px→0) then OUT (1→0, 0→−124.797px), linear in scroll.
// Per letter: fade span R = 237px/6300px, stagger D = 27px/6300px; word cycle
// 990px, each word's IN starts 208px after the previous word's OUT.
const V_R = 0.0376
const V_D = 0.00428
const V_TY = 124.797
const V_IN = [-1, 0.0944, 0.2514, 0.4086, 0.5655]
const V_OUT = [0.0614, 0.2187, 0.3757, 0.5325, 0.6903]

function VisLine({ w, i, p }: { w: string; i: number; p: MotionValue<number> }) {
  return (
    // .reveal only matters on mobile, where the pin is disabled and each
    // line fades/rises in on view; on desktop the letters are scroll-driven
    <div className="vision-line" aria-hidden>
      {w.split('').map((ch, j) => {
        const inS = V_IN[i] + j * V_D
        const outS = V_OUT[i] + j * V_D
        return <VisChar key={j} ch={ch} inS={inS} outS={outS} p={p} />
      })}
    </div>
  )
}

// each curve binds its OWN scroll progress: as it travels from the bottom
// of the viewport to the top (['start end' → 'start start']) the arc eases
// from 50% to flat — previously curves were bound to unrelated pin
// progress values (visP/statsP) so they never flattened in view
function Curve({ flip }: { flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  })
  const r = useTransform(p, [0, 1], ['50%', '0%'])
  return (
    <motion.div
      ref={ref}
      className={flip ? 'curve flip' : 'curve'}
      style={{
        borderBottomLeftRadius: flip ? undefined : r,
        borderBottomRightRadius: flip ? undefined : r,
        borderTopLeftRadius: flip ? r : undefined,
        borderTopRightRadius: flip ? r : undefined,
      }}
    />
  )
}

// piecewise-linear ramp clamped to [0, 1]
const vRamp = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)))

function VisChar({
  ch, inS, outS, p,
}: {
  ch: string
  inS: number
  outS: number
  p: MotionValue<number>
}) {
  // function form (not range→range): the range form attaches a WAAPI
  // accelerate config whose native keyframe offsets reject word-0's
  // pre-pin negative start, crashing Element.animate at mount
  const op = useTransform(p, (v) =>
    Math.min(vRamp(v, inS, inS + V_R), 1 - vRamp(v, outS, outS + V_R)))
  const y = useTransform(p, (v) =>
    V_TY * (1 - vRamp(v, inS, inS + V_R) - vRamp(v, outS, outS + V_R)))
  return (
    <span className="vl-clip">
      <span className="vl-static" aria-hidden>{ch}</span>
      <motion.span className="vl" style={{ opacity: op, y }}>{ch}</motion.span>
    </span>
  )
}

// Stable outer hit area; hover styling and explicit tap, never timed flipping.
function PartnerFlip({ p }: { p: (typeof partners)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button type="button" className={flipped ? 'partner-flip is-flipped' : 'partner-flip'}
      aria-label={p.t + '：' + p.b} aria-pressed={flipped} onClick={() => setFlipped(!flipped)}>
      <span className="partner-flip-inner">
        <span className="partner-face"><strong>{p.t}</strong><span>{p.s}</span></span>
        <span className="partner-face back"><span>{p.b}</span></span>
      </span>
    </button>
  )
}

function WorkStackCard({ w, i, p }: { w: (typeof works)[number]; i: number; p: MotionValue<number> }) {
  const start = .1 + (i - 1) * .26
  const y = useTransform(p, [start, start + .21], ['105%', '0%'])
  return <motion.div className="work-layer" style={{ y: i ? y : 0, zIndex: i + 1 }}>
    <Link className="work-shot on" to={`/work/${w.slug}`}>
      <div className="ph" data-ph={`P-work-${w.slug}`}><img src={IMG[w.img]} alt={w.title} style={{ objectPosition: w.coverPosition }} /></div>
      <span className="cap"><strong>{w.title}</strong><span>{w.tag} · {w.year}</span></span>
    </Link>
  </motion.div>
}

function StatCard({ s }: { s: (typeof stats)[number] }) {
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const back = flipped || hovered
  return (
    <button type="button" className="stat-flip" aria-pressed={back}
      aria-label={s.l + '：点击翻面'} onClick={() => setFlipped(!flipped)}
      onPointerMove={e => { if (e.pointerType === 'mouse' && (e.movementX || e.movementY)) setHovered(true) }}
      onPointerLeave={() => setHovered(false)}>

      <motion.div className="stat-card-inner" animate={{ rotateY: back ? 180 : 0 }} transition={{ duration: .65, ease: [.22,1,.36,1] }}>
        <div className="stat-face" aria-hidden={back}>
          <p className="kicker">({s.tag}) <span className="stat-hint">悬停 / 点击翻面 ↗</span></p>
          <div>
            <strong className="stat-number" aria-label={s.n}>{s.n === '2020'
              ? <><span className="stat-number-lead" aria-hidden>2</span><span className="stat-number-tail" aria-hidden>020</span></>
              : s.n}</strong>
            <div><span>{s.l}</span></div>
            <span>{s.s}</span>
          </div>
        </div>
        <div className="stat-back" aria-hidden={!back}>
          <p className="kicker">({s.no})</p>
          <p className="back-line">{s.bline}</p>
          <p className="back-foot">{s.tag}</p>
        </div>
      </motion.div>
    </button>
  )
}

function HeroMosaicCell({
  id, src, i, progress,
}: {
  id: string
  src: string
  i: number
  progress: MotionValue<number>
}) {
  const col = (i % 3) - 1
  const row = Math.floor(i / 3) - 1
  const x = useTransform(progress, [0, 1], [col * 30, col * -16])
  const y = useTransform(progress, [0, 1], [row * 38, row * -18])
  const scale = useTransform(progress, [0, 1], [1.12 + (i % 2) * 0.025, 1.025])
  return (
    <motion.div className="cell" style={{ x, y, scale }}>
      <Ph id={id} src={src} />
    </motion.div>
  )
}

// testimonial pin model: progress domain T_D px; the sampled FLY windows
// (600→3000) are shifted +T_SHIFT to run after the door-open and card-flip
// phases; the hold fills the pin and releases after exactly T_D scroll pixels.
const T_D = 4100
const T_SHIFT = 800

function TCard({
  q, i, p,
}: {
  q: (typeof quotes)[number]
  i: number
  p: MotionValue<number>
}) {
  // mono slingshot cards (sampled): scroll-linked matrix3d keyframes per card.
  // DOM idx 0 sits on top and flies out first, idx 1 follows, idx 2 last
  // (with a second burst); idx 3 never moves.
  const fly = i === 0 ? FLY_A : i === 1 ? FLY_B : i === 2 ? FLY_C : null
  const opacity = useTransform(p, v => fly ? 1 - vRamp(v * T_D, fly[fly.length - 1][0] + T_SHIFT - 90, fly[fly.length - 1][0] + T_SHIFT) : 1)
  const tr = useTransform(p, (v) => {
    const rel = v * T_D
    if (fly && rel - T_SHIFT >= fly[0][0]) return matAt(fly, rel - T_SHIFT)
    return 'none'
  })
  return (
    <motion.div
      className="t-fly"
      style={{ transform: tr, opacity, zIndex: quotes.length - i }}
    >
      <article className={q.dark ? 't-card is-dark' : 't-card'}>
        <div className="t-body">
          <header className="t-top"><span>{q.role}</span><span className="t-dots" aria-hidden>{quotes.map((_, d) => <i key={d} className={d <= i ? 'on' : ''} />)}</span></header>
          <img className="t-scene" src={IMG[q.img]} alt="" loading="lazy" />
          <h3>{q.who}</h3>
          <p className="t-quote">{q.text}</p>
          <footer><span className="t-author-mark" aria-hidden>W.</span><span>王泽斌 · 做过之后留下的话</span></footer>
        </div>
      </article>
    </motion.div>
  )
}

// round3 grid order: 3×3 — a,b,c / e,d(center),f / g,h,i
const REEL_IMGS = showreelImages.map((key) => IMG[key])

function ReelCell({
  i, src, p,
}: {
  i: number
  src: string
  p: MotionValue<number>
}) {
  // center starts oversized and scales DOWN into the grid; surrounding
  // strips slide in from outside; nothing ever scales up
  const col = (i % 3) - 1
  const row = Math.floor(i / 3) - 1
  const center = i === 4
  const t = useTransform(p, [0.04, 0.42], [1, 0])
  const x = useTransform(t, (v) => col * 340 * v)
  const y = useTransform(t, (v) => row * 240 * v)
  const op = useTransform(p, [0.04, 0.3], [0, 1])
  const scale = useTransform(p, [0.04, 0.42], [1.9, 1])
  return (
    <motion.div
      className={center ? 'reel-cell center' : 'reel-cell'}
      style={center ? { scale, zIndex: 3 } : { x, y, opacity: op }}
    >
      {center ? (
        <Link to="/work" className="reel-hit" aria-label="查看全部作品">
          <Ph id={`P-reel-${i + 1}`} src={src} />
          <ReelTitle p={p} />
        </Link>
      ) : (
        <Ph id={`P-reel-${i + 1}`} src={src} />
      )}
    </motion.div>
  )
}

// mono title timing: letters roll up IN one by one as the pin engages, hold
// while the grid shrinks, then roll up OUT one by one before release
const RT_IN = 0.08
const RT_OUT = 0.78
const RT_D = 0.012
const RT_R = 0.07
const RT_TY = 72

function ReelTitle({ p }: { p: MotionValue<number> }) {
  const title = '实践剪影 26©'
  return (
    <h3 className="reel-title" aria-label={title}>
      {Array.from(title).map((ch, j) => (
        <ReelChar key={j} ch={ch} j={j} p={p} />
      ))}
    </h3>
  )
}

function ReelChar({
  ch, j, p,
}: {
  ch: string
  j: number
  p: MotionValue<number>
}) {
  const inS = RT_IN + j * RT_D
  const outS = RT_OUT + j * RT_D
  const op = useTransform(p, (v) =>
    Math.min(vRamp(v, inS, inS + RT_R), 1 - vRamp(v, outS, outS + RT_R)))
  const y = useTransform(p, (v) =>
    RT_TY * (1 - vRamp(v, inS, inS + RT_R) - vRamp(v, outS, outS + RT_R)))
  const c = ch === ' ' ? ' ' : ch
  return (
    <span className="rt-clip">
      <span className="rt-static" aria-hidden>{c}</span>
      <motion.span className="rt" style={{ opacity: op, y }}>{c}</motion.span>
    </span>
  )
}

// mono testimonial slingshot keyframes: [rel, ...matrix3d 16 values] sampled
// every 50px from the original site. Card A (top) tumbles up-right, card B
// down-left, card C left then off-screen with a second burst.
const FLY_A: number[][] = [
  [600, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [650, 1, 0.021, -0.005, 0, -0.02, 0.984, 0.179, 0, 0.009, -0.178, 0.984, 0, 13.714, -30.857, 0, 1],
  [700, 0.999, 0.053, -0.011, 0, -0.043, 0.908, 0.416, 0, 0.032, -0.415, 0.909, 0, 32.762, -73.714, 0, 1],
  [750, 0.996, 0.087, -0.015, 0, -0.059, 0.777, 0.627, -0.001, 0.066, -0.624, 0.779, 0, 51.81, -116.571, 0, 1],
  [800, 0.992, 0.123, -0.015, 0, -0.062, 0.597, 0.8, -0.001, 0.108, -0.793, 0.6, 0, 70.857, -159.429, 0, 1],
  [850, 0.987, 0.16, -0.013, 0, -0.05, 0.381, 0.923, -0.001, 0.153, -0.911, 0.384, 0, 89.905, -202.286, 0, 1],
  [900, 0.981, 0.196, -0.006, 0, -0.023, 0.142, 0.99, -0.001, 0.195, -0.97, 0.144, 0, 108.952, -245.143, 0, 1],
  [950, 0.973, 0.23, 0.005, 0, 0.019, -0.103, 0.995, -0.001, 0.23, -0.968, -0.104, 0, 128, -288, 0, 1],
  [1000, 0.965, 0.261, 0.019, 0, 0.074, -0.339, 0.938, -0.001, 0.251, -0.904, -0.346, 0, 147.048, -330.857, 0, 1],
  [1050, 0.957, 0.287, 0.034, 0, 0.136, -0.551, 0.823, -0.001, 0.255, -0.784, -0.566, 0, 166.095, -373.714, 0, 1],
  [1100, 0.95, 0.308, 0.051, 0, 0.2, -0.726, 0.658, -0.001, 0.239, -0.615, -0.751, 0.001, 185.143, -416.571, 0, 1],
  [1150, 0.944, 0.324, 0.066, 0, 0.261, -0.853, 0.452, 0, 0.203, -0.409, -0.89, 0.001, 204.19, -459.429, 0, 1],
  [1200, 0.939, 0.335, 0.079, 0, 0.311, -0.925, 0.218, 0, 0.146, -0.18, -0.973, 0.001, 223.238, -502.286, 0, 1],
  [1250, 0.936, 0.341, 0.087, 0, 0.342, -0.94, 0, 0, 0.082, 0.03, -0.996, 0.001, 240, -540, 0, 1],
]

const FLY_B: number[][] = [
  [1400, 1, 0, 0, 0, 0, 1, 0.005, 0, 0, -0.005, 1, 0, 0, 0, 0, 1],
  [1450, 1, 0.016, -0.007, 0, -0.014, 0.968, 0.252, 0, 0.011, -0.251, 0.968, 0, -15.381, 50.191, 0, 1],
  [1500, 0.999, 0.035, -0.012, 0, -0.025, 0.875, 0.483, 0, 0.027, -0.482, 0.876, 0, -30.46, 99.397, 0, 1],
  [1550, 0.998, 0.056, -0.015, 0, -0.031, 0.729, 0.684, -0.001, 0.049, -0.682, 0.729, 0, -45.54, 148.603, 0, 1],
  [1600, 0.997, 0.079, -0.015, 0, -0.03, 0.538, 0.843, -0.001, 0.075, -0.84, 0.538, 0, -60.619, 197.81, 0, 1],
  [1650, 0.995, 0.102, -0.011, 0, -0.022, 0.313, 0.95, -0.001, 0.101, -0.944, 0.314, 0, -75.698, 247.016, 0, 1],
  [1700, 0.992, 0.125, -0.003, 0, -0.006, 0.07, 0.998, -0.001, 0.125, -0.99, 0.07, 0, -90.778, 296.222, 0, 1],
  [1750, 0.989, 0.145, 0.009, 0, 0.017, -0.178, 0.984, -0.001, 0.144, -0.973, -0.178, 0, -105.857, 345.429, 0, 1],
  [1800, 0.987, 0.161, 0.023, 0, 0.046, -0.413, 0.909, -0.001, 0.156, -0.896, -0.415, 0, -120.937, 394.635, 0, 1],
  [1850, 0.984, 0.173, 0.039, 0, 0.078, -0.622, 0.779, -0.001, 0.159, -0.763, -0.626, 0.001, -136.016, 443.841, 0, 1],
  [1900, 0.982, 0.179, 0.055, 0, 0.111, -0.792, 0.6, 0, 0.151, -0.583, -0.798, 0.001, -151.095, 493.048, 0, 1],
  [1950, 0.981, 0.181, 0.07, 0, 0.14, -0.913, 0.384, 0, 0.134, -0.367, -0.921, 0.001, -166.175, 542.254, 0, 1],
  [2000, 0.981, 0.177, 0.082, 0, 0.164, -0.976, 0.144, 0, 0.106, -0.128, -0.986, 0.001, -181.254, 591.46, 0, 1],
  [2050, 0.981, 0.173, 0.087, 0, 0.174, -0.985, 0, 0, 0.086, 0.015, -0.996, 0.001, -190, 620, 0, 1],
]

const FLY_C: number[][] = [
  [2200, 1, 0.009, -0.002, 0, -0.009, 0.997, 0.08, 0, 0.002, -0.08, 0.997, 0, -10.667, -15.746, 0, 1],
  [2250, 0.999, 0.039, -0.007, 0, -0.035, 0.946, 0.323, 0, 0.019, -0.323, 0.946, 0, -44, -64.952, 0, 1],
  [2300, 0.997, 0.071, -0.011, 0, -0.054, 0.836, 0.547, 0, 0.048, -0.545, 0.837, 0, -77.333, -114.159, 0, 1],
  [2350, 0.994, 0.105, -0.012, 0, -0.062, 0.674, 0.736, 0, 0.086, -0.732, 0.676, 0, -110.667, -163.365, 0, 1],
  [2400, 0.99, 0.14, -0.011, 0, -0.057, 0.47, 0.881, 0, 0.129, -0.871, 0.474, 0, -144, -212.571, 0, 1],
  [2450, 0.985, 0.175, -0.007, 0, -0.036, 0.239, 0.97, 0, 0.172, -0.955, 0.242, 0, -177.333, -261.778, 0, 1],
  // second burst: rest at (247,153) until rel 2700, fling off-screen by 3000
  [2700, 0.985, 0.175, -0.007, 0, -0.036, 0.239, 0.97, 0, 0.172, -0.955, 0.242, 0, -177.333, -261.778, 0, 1],
  [2750, 0.943, 0.327, 0.06, 0, 0.293, -0.903, 0.314, 0, 0.156, -0.279, -0.948, 0.001, -377.333, -557.016, 0, 1],
  [2950, 0.943, 0.327, 0.06, 0, 0.293, -0.903, 0.314, 0, 0.156, -0.279, -0.948, 0.001, -377.333, -557.016, 0, 1],
  [3000, 0.937, 0.341, 0.07, 0, 0.342, -0.94, 0, 0, 0.066, 0.024, -0.998, 0.001, -420, -620, 0, 1],
]

// piecewise-linear matrix interpolation over the keyframe list; the matrix is
// applied verbatim (it already carries mono's perspective component)
function matAt(keys: number[][], rel: number): string {
  const first = keys[0]
  const last = keys[keys.length - 1]
  const fmt = (m: number[]) =>
    `matrix3d(${m.slice(1).map((v) => Math.round(v * 10000) / 10000).join(',')})`
  if (rel <= first[0]) return fmt(first)
  if (rel >= last[0]) return fmt(last)
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1]
    const b = keys[i]
    if (rel <= b[0]) {
      const t = (rel - a[0]) / (b[0] - a[0])
      return fmt(a.map((v, j) => (j === 0 ? v : v + (b[j] - v) * t)))
    }
  }
  return fmt(last)
}
