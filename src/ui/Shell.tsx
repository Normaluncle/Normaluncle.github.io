import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { cancelFrame, frame } from 'motion/react'
import { IMG, works, contact } from '../content'
import { usePageReveals } from './usePageReveals'
import PageMetadata from './PageMetadata'

const nav = [
  { to: '/', label: '首页', en: 'Home', end: true },
  { to: '/studio', label: '关于', en: 'About' },
  { to: '/work', label: `项目 (${works.length})`, en: 'Work' },
  { to: '/news', label: '笔记', en: 'Notes' },
  { to: '/contact', label: '联系', en: 'Contact' },
]

const ORB_VIDEO = '/media/brand-orb-original.mp4'

function Brand() {
  return (
    <span className="brand-lockup">
      <span className="mark" aria-hidden>
        <video src={ORB_VIDEO} poster={IMG.brandPoster} autoPlay loop muted playsInline preload="auto" />
      </span>
      <span>王泽斌</span>
    </span>
  )
}

function FooterTitle() {
  const words = ['从想法，', '到可用的产品。', '一起把下一步做实。']
  return (
    <h2 className="footer-title reveal" aria-label={words.join('')}>
      {words.map((word, i) => (
        <span className="footer-word" key={word} aria-hidden>
          <span style={{ transitionDelay: `${i * 0.07}s` }}>{word}</span>
        </span>
      ))}
    </h2>
  )
}

type LenisWin = Window & { __lenis?: Lenis }

export default function Shell() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [dock, setDock] = useState(false)
  const topnavRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const [booted, setBooted] = useState(false)
  const [gone, setGone] = useState(false)
  const [ticks, setTicks] = useState<number[]>([])
  const cur = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const ticksRef = useRef<number[]>([])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const drawer = drawerRef.current!
    const siblings = [...document.getElementById('root')!.children].filter(el => el !== drawer && !el.classList.contains('drawer-bg')) as HTMLElement[]
    const original = siblings.map(el => el.inert)
    siblings.forEach(el => { el.inert = true })
    drawer.querySelector<HTMLButtonElement>('button')?.focus()
    lenisRef.current?.stop()
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = [...drawer.querySelectorAll<HTMLElement>('button,a[href]')]
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    drawer.addEventListener('keydown', trap)
    return () => {
      document.body.classList.remove('menu-open')
      siblings.forEach((el,i) => { el.inert = original[i] })
      drawer.removeEventListener('keydown', trap)
      lenisRef.current?.start()
      previous?.focus({preventScroll:true})
    }
  }, [open])

  usePageReveals(loc.pathname)
  useEffect(() => {
    document.body.classList.toggle('art-route', loc.pathname.replace(/\/$/, '') === '/art')
    return () => document.body.classList.remove('art-route')
  }, [loc.pathname])

  // cursor states via event delegation — stable under SPA renders (no
  // per-element binding that can miss nodes mounted after the effect)
  useEffect(() => {
    const READ_SEL = '.note-card .thumb, .work-shot, .case-bleed, .case-frame'
    const LINK_SEL = 'a, button, input, textarea'
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || !t.closest) return
      document.body.classList.toggle('cursor-read', !!t.closest(READ_SEL))
      document.body.classList.toggle('cursor-link', !!t.closest(LINK_SEL))
    }
    document.addEventListener('mouseover', over)
    return () => {
      document.removeEventListener('mouseover', over)
      document.body.classList.remove('cursor-read', 'cursor-link')
    }
  }, [])

  // debug placeholder labels: ?debug=1 or localStorage.debug = '1'
  useEffect(() => {
    const on =
      new URLSearchParams(window.location.search).has('debug') ||
      window.localStorage.getItem('debug') === '1'
    document.body.classList.toggle('debug', on)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setOpen(false)
    const lenis = lenisRef.current
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [loc.pathname])

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.12 })
    lenisRef.current = lenis
    ;(window as LenisWin).__lenis = lenis
    const update = (data: { timestamp: number }) => {
      lenis.raf(data.timestamp)
    }
    frame.update(update, true)
    return () => {
      cancelFrame(update)
      lenis.destroy()
      lenisRef.current = null
      delete (window as LenisWin).__lenis
    }
  }, [])

  useEffect(() => {
    // recording timeline: full black holds ~2s, curtain wipes up ~1s, done by 3s
    const t1 = window.setTimeout(() => setBooted(true), 2000)
    const t2 = window.setTimeout(() => setGone(true), 3000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('site-booted', booted)
    return () => document.body.classList.remove('site-booted')
  }, [booted])

  useEffect(() => {
    const el = cur.current
    const mq = window.matchMedia('(pointer: coarse)')
    const applyMq = () => {
      const mobile = mq.matches
      document.body.classList.toggle('hide-cursor', mobile)
    }
    applyMq()
    mq.addEventListener('change', applyMq)
    if (!el) {
      return () => mq.removeEventListener('change', applyMq)
    }
    const xLine = el.querySelector<HTMLElement>('.cursor-x')
    const yLine = el.querySelector<HTMLElement>('.cursor-y')
    const dot = el.querySelector<HTMLElement>('.cursor-dot')
    const label = el.querySelector<HTMLElement>('.cursor-label')
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0
    const move = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const loop = () => {
      x += (tx - x) * 0.38
      y += (ty - y) * 0.38
      if (xLine) xLine.style.left = `${x}px`
      if (yLine) yLine.style.top = `${y}px`
      if (dot) {
        dot.style.left = `${x}px`
        dot.style.top = `${y}px`
      }
      if (label) {
        label.style.left = `${x}px`
        label.style.top = `${y}px`
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      mq.removeEventListener('change', applyMq)
    }
  }, [])

  useEffect(() => {
    const measure = () => {
      const secs = [...document.querySelectorAll<HTMLElement>('[data-rail]')]
      const total = Math.max(document.documentElement.scrollHeight, 1)
      const arr = secs.map((s) => {
        const top = s.getBoundingClientRect().top + window.scrollY
        return 8 + (top / total) * 84
      })
      ticksRef.current = arr
      setTicks(arr)
    }
    const id = window.setTimeout(measure, 100)
    window.addEventListener('resize', measure)
    // remote placeholder images load late and shift layout — re-measure when
    // the page finishes and whenever body height changes
    window.addEventListener('load', measure)
    let lastH = 0
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight
      if (h !== lastH) {
        lastH = h
        measure()
      }
    })
    ro.observe(document.body)
    return () => {
      clearTimeout(id)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      ro.disconnect()
    }
  }, [loc.pathname])

  useEffect(() => {
    let lastY = 0
    let dir = 0
    const sync = () => {
      const secs = [...document.querySelectorAll<HTMLElement>('[data-rail]')]
      const scroll = lenisRef.current?.scroll ?? window.scrollY
      const mobile = window.innerWidth < 810
      // mono's top nav is not fixed: it translates 1:1 with scroll (sampled
      // y = 41 − scrollY), fully gone after the first ~150px. Past the hero
      // the bottom dock is the only nav — shown while scrolling UP past 3vh
      // (hides on down-scroll and near the top, per original behavior)
      const navEl = topnavRef.current
      // mono: the top nav scrolls away 1:1 on mobile too — it is not a fixed
      // bar covering the content
      if (navEl) navEl.style.transform = `translateY(${-scroll}px)`
      const dy = scroll - lastY
      if (Math.abs(dy) > 1.5) dir = dy
      lastY = scroll
      const show = !mobile && scroll > window.innerHeight * 3 && dir <= 0
      setDock((d) => (d === show ? d : show))
      const y = scroll + window.innerHeight * 0.38
      let dark = false
      let idx = 0
      secs.forEach((s, i) => {
        const top = s.getBoundingClientRect().top + window.scrollY
        if (y >= top) {
          idx = i
          dark = s.dataset.theme === 'dark'
        }
      })
      document.body.classList.toggle('on-dark', dark)
      const dot = document.querySelector<HTMLElement>('.rail-dot')
      const marks = ticksRef.current
      if (dot && secs.length) {
        // slide continuously between the current section's tick and the next
        // one so the dot glides along the rail and lands exactly on each tick
        const cur = Math.min(idx, secs.length - 1)
        const next = Math.min(cur + 1, secs.length - 1)
        const curTop = secs[cur].getBoundingClientRect().top + window.scrollY
        const nextTop = next !== cur ? secs[next].getBoundingClientRect().top + window.scrollY : curTop + 1
        const frac = Math.min(1, Math.max(0, (y - curTop) / Math.max(nextTop - curTop, 1)))
        const a = marks[cur] ?? 8 + (cur / Math.max(secs.length - 1, 1)) * 84
        const b = marks[next] ?? a
        dot.style.top = `${a + (b - a) * frac}%`
      }
    }
    window.addEventListener('scroll', sync, { passive: true })
    const lenis = lenisRef.current
    lenis?.on('scroll', sync)
    sync()
    return () => {
      window.removeEventListener('scroll', sync)
      lenis?.off('scroll', sync)
    }
  }, [loc.pathname])

  return (
    <>
      <PageMetadata />
      {!gone && (
        <div
          className={booted ? 'preloader out' : 'preloader'}
          aria-hidden
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setGone(true)
          }}
        >
          <span className="pre-word" aria-label="王泽斌">
            {Array.from('王泽斌').map((ch, i) => <i key={ch} style={{ '--pre-i': i } as CSSProperties}>{ch}</i>)}
          </span>
        </div>
      )}
      <div className="cursor" ref={cur} aria-hidden>
        <div className="cursor-x" />
        <div className="cursor-y" />
        <div className="cursor-dot" />
        <span className="cursor-label">了解更多</span>
      </div>
      <div className="rail" aria-hidden>
        {ticks.map((t, i) => (
          <span className="rail-tick" key={i} style={{ top: `${t}%` }} />
        ))}
        <span className="rail-dot" />
      </div>

      <header className="topnav" ref={topnavRef}>
        <Link to="/" className="logo"><Brand /></Link>
        <nav className="nav-links" aria-label="主导航">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>
          ))}
        </nav>
        <button className="burger" aria-label="菜单" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
          <i /><i /><i />
        </button>
      </header>

      <div className={open ? 'drawer-bg on' : 'drawer-bg'} onClick={() => setOpen(false)} />
      <aside ref={drawerRef} id="site-menu" className={open ? 'drawer on' : 'drawer'} role="dialog" aria-modal={open || undefined} aria-hidden={!open} inert={!open} aria-label="菜单">
        <button className="drawer-close" onClick={() => setOpen(false)} aria-label="关闭">×</button>
        <nav>
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>
              {n.label}
              <small>{n.en}</small>
            </Link>
          ))}
          <Link to="/art" onClick={() => setOpen(false)}>我的另一面<small>Art archive</small></Link>
        </nav>
        <div className="drawer-cta">
          <p>{contact.email}</p>
          <Link className="pill" to="/contact" onClick={() => setOpen(false)}>
            <span className="pill-face">联系</span>
          </Link>
        </div>
      </aside>

      <nav className={dock ? 'dock on' : 'dock'} aria-label="底部导航" inert={!dock} aria-hidden={!dock}>
        <NavLink to="/" end>首页</NavLink>
        <NavLink to="/studio">关于</NavLink>
        <Link to="/" className="logo"><Brand /></Link>
        <NavLink to="/news">笔记</NavLink>
        <NavLink to="/contact">联系</NavLink>
      </nav>

      <Outlet />

      <footer className="footer">
        <div className="footer-top">
          <FooterTitle />
          <Link className="pill ghost" to="/contact">
            <span className="pill-face">聊聊合作</span>
          </Link>
        </div>
        <div className="footer-grid">
          <div className="news-box">
            <Link to="/" className="logo"><Brand /></Link>
            <p className="kicker" style={{ marginTop: 24 }}>(产品 · 设计 · AI 应用)</p>
            <h3>把业务问题，做成可用的体验。</h3>
            <p className="footer-summary">从视觉与门店现场出发，关注产品逻辑、界面细节与有边界的自动化。这里记录我的项目、方法和持续探索。</p>
            <p className="copy">© 2026 王泽斌</p>
          </div>
          <div>
            <div className="foot-cols">
              <div><div className="lab">(了解我)</div><Link to="/">首页</Link><Link to="/studio">经历与方法</Link><Link to="/news">项目笔记</Link><Link to="/art">我的另一面 ↗</Link></div>
              <div><div className="lab">(精选项目)</div>{works.map(w => <Link key={w.slug} to={`/work/${w.slug}`}>{w.title}</Link>)}</div>
              <div className="footer-contacts">
                <div className="lab">(直接联系)</div>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <a href={`mailto:${contact.domesticEmail}`}>{contact.domesticEmail}</a>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                <Link to="/contact">微信二维码 ↗</Link>
                <p className="footer-location">{contact.location}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
