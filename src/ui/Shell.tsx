import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
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
  const video = useRef<HTMLVideoElement>(null)
  const [fallback, setFallback] = useState(true)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = video.current!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const play = () => {
      if (!visible || document.hidden || reduced.matches) { el.pause(); return }
      el.muted = true
      void el.play().catch(() => setFallback(true))
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      setInView(visible)
      play()
    })
    observer.observe(el)
    el.addEventListener('canplay', play)
    document.addEventListener('visibilitychange', play)
    document.addEventListener('pointerup', play, { passive: true })
    reduced.addEventListener('change', play)
    return () => {
      observer.disconnect()
      el.pause()
      el.removeEventListener('canplay', play)
      document.removeEventListener('visibilitychange', play)
      document.removeEventListener('pointerup', play)
      reduced.removeEventListener('change', play)
    }
  }, [])
  return (
    <span className="brand-lockup">
      <span className={`mark${fallback ? ' mark-fallback' : ''}${inView ? ' mark-visible' : ''}`} aria-hidden>
        <video ref={video} src={ORB_VIDEO} poster={IMG.brandPoster} loop muted playsInline preload="auto" onPlaying={() => setFallback(false)} onPause={() => setFallback(true)} onError={() => setFallback(true)} />
      </span>
      <span>王泽斌</span>
    </span>
  )
}

function FooterTitle() {
  const words = ['从想法', '到可用的产品', '一起把下一步做实']
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
  const navigate = useNavigate()
  const entryHandled = useRef(false)
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

  // Every fresh document enters through Home. The shared shell stays mounted
  // for in-site navigation, so this must not redirect subsequent route changes.
  useLayoutEffect(() => {
    if (entryHandled.current) return
    entryHandled.current = true
    if (loc.pathname !== '/' || loc.hash) navigate('/', { replace: true })
  }, [loc.pathname, loc.hash, navigate])

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
    // Native touch inertia has one owner: the browser, not a second scroll loop.
    const native = window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)')
    let dispose: (() => void) | undefined
    const configure = () => {
      dispose?.()
      dispose = undefined
      if (native.matches) return
      const lenis = new Lenis({ autoRaf: false, lerp: 0.12, syncTouch: false })
      lenisRef.current = lenis
      ;(window as LenisWin).__lenis = lenis
      const update = (data: { timestamp: number }) => lenis.raf(data.timestamp)
      frame.update(update, true)
      dispose = () => {
        cancelFrame(update)
        lenis.destroy()
        lenisRef.current = null
        delete (window as LenisWin).__lenis
      }
    }
    configure()
    native.addEventListener('change', configure)
    return () => {
      native.removeEventListener('change', configure)
      dispose?.()
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
    // Shared by every route. Clamp Safari rubber-band scrolling so rebound
    // at the page boundary is not mistaken for an intentional direction change.
    const scrollPosition = () => Math.max(0, Math.min(window.scrollY, Math.max(0, document.documentElement.scrollHeight - window.innerHeight)))
    let lastY = scrollPosition()
    setDock(false)
    const followDirection = () => {
      const y = scrollPosition()
      const delta = y - lastY
      if (Math.abs(delta) < 0.75) return
      setDock(delta < 0)
      lastY = y
    }
    // Also available on short pages and when the pointer is already at the top.
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      setDock(event.deltaY < 0)
    }
    window.addEventListener('scroll', followDirection, { passive: true })
    window.addEventListener('wheel', wheel, { passive: true })
    return () => {
      window.removeEventListener('scroll', followDirection)
      window.removeEventListener('wheel', wheel)
    }
  }, [loc.pathname])

  useEffect(() => {
    const sync = () => {
      const secs = [...document.querySelectorAll<HTMLElement>('[data-rail]')]
      const scroll = lenisRef.current?.scroll ?? window.scrollY
      const navEl = topnavRef.current
      // mono: the top nav scrolls away 1:1 on mobile too — it is not a fixed
      // bar covering the content
      if (navEl) navEl.style.transform = `translateY(${-scroll}px)`
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
        <NavLink to="/work">项目</NavLink>
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
            <h3>把业务问题，做成可用的体验</h3>
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
