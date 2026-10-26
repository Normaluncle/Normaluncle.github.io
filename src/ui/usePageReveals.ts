import { useEffect } from 'react'

/** Once per route: never reset behind the reader or force layout on every scroll. */
export function usePageReveals(route: string) {
  useEffect(() => {
    const candidates = document.querySelectorAll<HTMLElement>(
      'main h1, main h2, main h3, main p, main time, .footer h2, .footer h3, .footer p, .footer a',
    )
    const added: HTMLElement[] = []
    candidates.forEach((el) => {
      if (!el.closest('.reveal, .vision, .showreel, .t-fly, .chat-demo, .work-pin, .system-visual, .art-viewer, .hero-word')) {
        el.classList.add('reveal', 'auto-reveal')
        added.push(el)
      }
    })
    const elements = [...document.querySelectorAll<HTMLElement>('.reveal')]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reveal = (el: HTMLElement) => el.classList.add('from-bottom', 'revealed')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        reveal(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      })
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' })
    elements.forEach((el) => el.classList.remove('revealed', 'from-top', 'from-bottom'))
    elements.forEach(el => { if (reduced) reveal(el); else observer.observe(el) })
    return () => {
      observer.disconnect()
      elements.forEach((el) => el.classList.remove('revealed', 'from-top', 'from-bottom', 'reveal-reset'))
      added.forEach((el) => el.classList.remove('reveal', 'auto-reveal'))
    }
  }, [route])
}
