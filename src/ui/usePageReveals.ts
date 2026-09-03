import { useEffect } from 'react'

/** Entrance animations: direction is latched once, reset only well outside view. */
export function usePageReveals(route: string) {
  useEffect(() => {
    const candidates = document.querySelectorAll<HTMLElement>(
      'main h1, main h2, main h3, main p, main time, .footer h2, .footer h3, .footer p, .footer a',
    )
    const added: HTMLElement[] = []
    candidates.forEach((el) => {
      if (!el.closest('.reveal, .vision, .showreel, .t-fly, .chat-demo, .work-pin, .system-visual, .art-viewer')) {
        el.classList.add('reveal', 'auto-reveal')
        added.push(el)
      }
    })
    const elements = [...document.querySelectorAll<HTMLElement>('.reveal')]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const shown = new Set<HTMLElement>()
    const timers = new Map<HTMLElement, number>()
    let frame = 0
    let lastY = window.scrollY
    let direction = 'down'
    let initialized = false
    const clear = (el: HTMLElement) => {
      window.clearTimeout(timers.get(el))
      timers.delete(el)
    }
    const scan = () => {
      frame = 0
      const y = window.scrollY
      if (initialized && Math.abs(y - lastY) > 1) direction = y > lastY ? 'down' : 'up'
      initialized = true
      lastY = y
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const outside = rect.bottom < -96 || rect.top > innerHeight + 96
        const visible = rect.bottom > 24 && rect.top < innerHeight - 24
        if (reduced || (visible && !shown.has(el))) {
          clear(el)
          if (!shown.has(el)) {
            el.classList.add('reveal-reset')
            el.classList.toggle('from-top', direction === 'up')
            el.classList.toggle('from-bottom', direction !== 'up')
            // Commit the start pose before restoring the transition.
            void el.offsetWidth
            el.classList.remove('reveal-reset')
            el.classList.add('revealed')
            shown.add(el)
          }
        }
        if (!outside) clear(el)
        else if (!reduced && shown.has(el) && !timers.has(el)) {
          timers.set(el, window.setTimeout(() => {
            const r = el.getBoundingClientRect()
            if (r.bottom < -96 || r.top > innerHeight + 96) {
              el.classList.add('reveal-reset')
              el.classList.remove('revealed')
              shown.delete(el)
            }
            timers.delete(el)
          }, 1000))
        }
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(scan) }
    elements.forEach((el) => el.classList.remove('revealed', 'from-top', 'from-bottom'))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      timers.forEach(timer => window.clearTimeout(timer))
      elements.forEach((el) => el.classList.remove('revealed', 'from-top', 'from-bottom', 'reveal-reset'))
      added.forEach((el) => el.classList.remove('reveal', 'auto-reveal'))
    }
  }, [route])
}
