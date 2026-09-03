import {useEffect,useLayoutEffect,useRef,useState,type CSSProperties} from 'react'
import {Link,useParams} from 'react-router-dom'
import {motion,useReducedMotion} from 'motion/react'
import {systemStories,type SystemStory} from '../systems'
import {works} from '../content'
import type Lenis from 'lenis'
import {routeEdge} from '../route-edges'

export default function System(){
 const {slug}=useParams(),story=systemStories.find(s=>s.slug===slug)
 if(!story)return <main className="page wrap"><h1>没有找到这份流程。</h1><Link to="/work">返回项目</Link></main>
 return <SystemReader key={story.slug} story={story}/>
}
function SystemReader({story}:{story:SystemStory}){
 const [active,setActive]=useState(0),root=useRef<HTMLDivElement>(null),reduce=useReducedMotion()
 const family=systemStories.filter(s=>s.project===story.project),work=works.find(w=>w.slug===story.project)!
 useEffect(()=>{
  let raf=0
  const scan=()=>{raf=0;const steps=[...root.current!.querySelectorAll<HTMLElement>('.system-step')],anchor=innerHeight*(innerWidth<810?.77:.53);let best=0,distance=Infinity;steps.forEach((el,i)=>{const r=el.getBoundingClientRect(),d=Math.abs((r.top+r.bottom)/2-anchor);if(d<distance){best=i;distance=d}});setActive(best)}
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(scan)}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);scan()
  return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(raf)}
 },[])
 const go=(i:number)=>{const el=root.current?.querySelectorAll<HTMLElement>('.system-step')[i];if(!el)return;const y=el.getBoundingClientRect().top+scrollY+el.offsetHeight/2-innerHeight*(innerWidth<810?.77:.53);const l=(window as Window&{__lenis?:Lenis}).__lenis;if(l)l.scrollTo(y,{immediate:!!reduce});else window.scrollTo({top:y,behavior:reduce?'instant':'smooth'})}
 return <main className="page system-page">
  <header className="system-intro wrap"><Link className="system-back" to={`/work/${work.slug}`}>← 回到{work.title}</Link><p className="kicker">({story.eyebrow})</p><h1>{story.title}</h1><div className="system-intro-bottom"><p>{story.intro}</p><div><span className="system-status">{story.status}</span><small>向下滚动阅读 · 流程演示，非实时后台</small></div></div></header>
  {family.length>1&&<nav className="system-family wrap" aria-label="胜算流程主题">{family.map((s,i)=><Link key={s.slug} className={s.slug===story.slug?'selected':''} to={`/systems/${s.slug}`} aria-current={s.slug===story.slug?'page':undefined}><span>0{i+1}</span>{s.eyebrow.split('/')[1].trim()}</Link>)}</nav>}
  <div className="system-reader wrap" ref={root}>
   <div className="system-script">{story.steps.map((s,i)=><section className={`system-step${active===i?' active':''}`} key={s.title} aria-current={active===i?'step':undefined}><p className="system-step-number">{String(i+1).padStart(2,'0')} / {String(story.steps.length).padStart(2,'0')}</p><h2>{s.title}</h2><p className="system-step-body">{s.body}</p><dl><div><dt>从这里开始</dt><dd>{s.input}</dd></div><div><dt>这一步留下</dt><dd>{s.output}</dd></div></dl><details><summary>展开设计说明 <span>＋</span></summary><p>{s.detail}</p></details></section>)}</div>
   <aside className="system-visual" aria-label="随阅读步骤变化的流程图">
    <div className="system-visual-top"><span>{work.title} / PROCESS</span><span>{String(active+1).padStart(2,'0')} — {String(story.steps.length).padStart(2,'0')}</span></div>
    <SystemMap story={story} active={active}/>
    <div className="system-map-caption" aria-live="polite"><span>当前输出</span><p>{story.steps[active].output}</p></div>
    <nav className="system-step-nav" aria-label="跳转流程步骤">{story.steps.map((s,i)=><button key={s.title} className={i===active?'on':''} onClick={()=>go(i)} aria-label={`第${i+1}步：${s.title}`} aria-current={active===i?'step':undefined}>{String(i+1).padStart(2,'0')}</button>)}</nav>
    <div className="system-key"><span><i/>当前涉及</span><span><i/>其他模块</span><span>没有自动播放</span></div>
   </aside>
  </div>
  <section className="system-foundations wrap" aria-labelledby="system-foundations-title"><p className="kicker">(贯穿整条流程)</p><h2 id="system-foundations-title">让这些环节一起工作的底座。</h2><div>{story.foundations.map((item,i)=><article key={item.title}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
  <section className="system-closing wrap"><p className="kicker">(回到产品)</p><h2>{story.closing}</h2><div className="system-source-note"><span>设计依据</span><p>{story.sources.join(' / ')}</p></div><Link className="pill" to={`/work/${work.slug}`}><span className="pill-face">回到{work.title}项目 ↗</span></Link></section>
 </main>
}
function SystemMap({story,active}:{story:SystemStory;active:number}){
 const ref=useRef<HTMLDivElement>(null),[paths,setPaths]=useState<{id:string;d:string}[]>([]),[size,setSize]=useState({w:600,h:430})
 const selected=story.steps[active],reduced=useReducedMotion()
 useLayoutEffect(()=>{
  const el=ref.current!
  const measure=()=>{
   const base=el.getBoundingClientRect();setSize({w:base.width,h:base.height})
   const boxes=story.nodes.map(n=>{const r=el.querySelector<HTMLElement>(`[data-node="${n.id}"]`)!.getBoundingClientRect();return{id:n.id,x:r.left-base.left,y:r.top-base.top,width:r.width,height:r.height}})
   setPaths(story.edges.map(edge=>({id:`${edge.from}>${edge.to}`,d:routeEdge(boxes,edge.from,edge.to,innerWidth<810?3:7)})))
  }
  const observer=new ResizeObserver(measure);observer.observe(el);el.querySelectorAll('[data-node]').forEach(n=>observer.observe(n));measure();return()=>observer.disconnect()
 },[story])
 return <div className="system-map" ref={ref}>
  <svg viewBox={`0 0 ${size.w} ${size.h}`} className="system-connections" aria-hidden><defs><marker id="system-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="context-stroke"/></marker></defs>{paths.map(path=><motion.path key={path.id} d={path.d} fill="none" stroke={selected.edges.includes(path.id)?'#242722':'#c7c9c1'} strokeWidth={selected.edges.includes(path.id)?2:1} markerEnd="url(#system-arrow)" animate={{opacity:selected.edges.includes(path.id)?1:.5}} transition={{duration:reduced?0:.45}}/>)}</svg>
  {story.nodes.map(node=><div key={node.id} data-node={node.id} className={`system-node${selected.nodes.includes(node.id)?' current':''}`} style={{'--node-col':node.col,'--node-row':node.row} as CSSProperties}><span>{node.title}</span><small>{node.detail}</small></div>)}
 </div>
}
