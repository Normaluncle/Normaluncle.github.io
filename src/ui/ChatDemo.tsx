import { useEffect, useRef, useState } from 'react'
import { chatScenes, IMG } from '../content'

const DELAYS = [350, 1750, 3300, 5150]

export default function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [scene, setScene] = useState(0)
  const chat = chatScenes[scene].messages
  useEffect(() => {
    let started = 0
    let outsideSince = 0
    const tick = () => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      const now = performance.now()
      const outside = r.bottom < -96 || r.top > innerHeight + 96
      if (outside) {
        outsideSince ||= now
        if (now - outsideSince > 1000) { started = 0; setCount(0) }
        return
      }
      outsideSince = 0
      if (!started && r.top < innerHeight * .7 && r.bottom > innerHeight * .3) started = now
      if (started) setCount(DELAYS.filter(delay => now - started >= delay).length)
    }
    const interval = window.setInterval(tick, 120)
    tick()
    return () => clearInterval(interval)
  }, [scene])
  return (
    <div className="card live wechat chat-demo" ref={ref} aria-label="学生与胜算的两人学习对话示例">
      <div className="wx-bar">
        <span className="wx-back" aria-hidden>‹</span>
        <img className="wx-brand" src={IMG.chatLogo} alt="" />
        <div className="wx-title"><strong>胜算</strong><em>{count === 1 || count === 3 ? '正在输入…' : '学习对话'}</em></div>
        <span className="wx-more" aria-hidden>···</span>
      </div>
      <div className="chat-pane" aria-live="polite">
        <p className="wx-time">{chatScenes[scene].label} · 学生发起</p>
        {chat.map((c, i) => (
          <div className={`wx-row${c.me ? ' me' : ''}${i < count ? ' sent' : ''}`} key={i} aria-hidden={i >= count}>
            {!c.me && <img className="wx-avatar them" src={IMG[c.avatar]} alt={c.who} />}
            <div className={c.me ? 'bubble me' : 'bubble'}>{c.t}</div>
            {c.me && <img className="wx-avatar me" src={IMG[c.avatar]} alt={c.who} />}
          </div>
        ))}
      </div>
      <div className="chat-scenes" role="group" aria-label="切换对话场景">
        <span className="chat-scene-slider" style={{ transform: `translateX(${scene * 100}%)` }} aria-hidden />
        {chatScenes.map((s, i) => <button type="button" key={s.label} aria-pressed={i === scene} onClick={() => { if (i !== scene) { setCount(0); setScene(i) } }}>{s.label}</button>)}
      </div>
    </div>
  )
}
