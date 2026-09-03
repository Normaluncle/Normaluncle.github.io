import {useEffect,useRef,useState} from 'react'
import {Link} from 'react-router-dom'
import {motion,useScroll,useTransform,useReducedMotion} from 'motion/react'
import {artGroups,artMedia,type ArtMedia} from '../art'
import type Lenis from 'lenis'

const find=(id:string)=>artMedia.find(m=>m.id===id)!
const lenis=()=> (window as Window & {__lenis?:Lenis}).__lenis

export default function Art(){
 const [selection,setSelection]=useState<{group:string;index:number}|null>(null)
 const hero=useRef<HTMLElement>(null)
 const reduced=useReducedMotion()
 const {scrollYProgress}=useScroll({target:hero,offset:['start start','end start']})
 const drift=useTransform(scrollYProgress,[0,1],[0,reduced?0:90])
 const open=(m:ArtMedia)=>setSelection({group:m.group,index:artMedia.filter(x=>x.group===m.group).findIndex(x=>x.id===m.id)})
 const jump=(id:string)=>{const el=document.getElementById(`art-${id}`);if(el){if(lenis())lenis()!.scrollTo(el,{offset:-24,immediate:!!reduced});else el.scrollIntoView({behavior:reduced?'instant':'smooth'})}}
 return <main className="art-page">
  <section className="art-hero" ref={hero}>
   <div className="art-topline"><span>王泽斌 / PERSONAL ARCHIVE</span><Link to="/studio">回到关于我 ↗</Link></div>
   <div className="art-heading"><p className="art-eyebrow">不用解决问题的时候，<br/>我喜欢把颜色留在别的地方。</p><h1>我的<br/><span>另一面<span className="art-asterisk" aria-hidden>✳</span></span></h1></div>
   <div className="art-coverline"><span>ART, WALLS & SMALL WORLDS.</span><span>五组作品 / 一些现场片段</span></div>
   <motion.div className="art-hero-pictures" style={{y:drift}}>
    <button className="art-cover art-cover-main" onClick={()=>open(find('bar-8'))} aria-label="查看粉色与青色墙绘原图"><img src={find('bar-8').src} alt="粉色与青色的现场墙绘" fetchPriority="high"/><span>ON THE WALL / 01</span></button>
    <button className="art-cover art-cover-note" onClick={()=>open(find('illustration-1'))} aria-label="查看人物线稿原图"><img src={find('illustration-1').thumb} alt="人物与植物的手绘线稿"/><span>AND ON PAPER.</span></button>
    <span className="art-sticker">有些想法，<br/>先画出来。</span>
   </motion.div>
  </section>
  <section className="art-directory">
   <div><p className="art-eyebrow">翻开这一页</p><h2>墙面、纸面，<br/>还有屏幕里面。</h2><p>这里不是另一份简历。是一些画过的墙、留下的线稿，和做过的小场景。作品不都来自同一个阶段，但都属于我。</p></div>
   <nav aria-label="艺术作品分类">{artGroups.map(g=><button key={g.id} onClick={()=>jump(g.id)}><span>{g.no}</span><strong>{g.title}</strong><small>{artMedia.filter(m=>m.group===g.id).length} {g.id==='live'?'段':'张'}</small><i aria-hidden>↘</i></button>)}</nav>
  </section>
  {artGroups.map(g=>{
   const items=artMedia.filter(m=>m.group===g.id),featured=g.featured.map(find)
   return <section className={`art-collection art-${g.id}`} id={`art-${g.id}`} key={g.id}>
    <header className="art-collection-head"><span className="art-index">{g.no} /</span><div><p className="art-eyebrow">{g.en}</p><h2>{g.title}</h2></div><p>{g.intro}</p></header>
    <div className="art-gallery">
     {featured.map((m,i)=><figure key={m.id} className={`art-frame art-frame-${i}`}><button onClick={()=>open(m)} aria-label={`查看${m.caption}`}><img src={m.src.endsWith('.mp4')?m.thumb:m.src} srcSet={m.type==='image'?`${m.thumb} 640w, ${m.src} ${Math.min(m.width,1600)}w`:undefined} sizes={i===0?'(max-width: 700px) 100vw, 75vw':'(max-width: 700px) 90vw, 45vw'} width={m.width} height={m.height} loading="lazy" alt={m.caption}/><span className="art-open">{m.type==='video'?'播放 ▶':'展开 ↗'}</span></button><figcaption><span>{m.caption}</span><span>{g.tag}</span></figcaption></figure>)}
    </div>
    <div className="art-collection-foot"><p>{g.id==='live'?'短片保留现场节奏，点击后播放。':'点击照片查看完整画面，方向键切换同组作品。'}</p><button onClick={()=>open(items[0])}>翻看这一组 <span>({items.length.toString().padStart(2,'0')}) ↗</span></button></div>
   </section>
  })}
  <section className="art-outro"><p className="art-eyebrow">BACK TO WHAT'S NEXT</p><h2>换个画面，<br/>还是同一个我。</h2><div><p>画墙的时候，要考虑人从哪里看。<br/>做产品的时候，也一样。</p><Link to="/work">去看我的产品项目 ↗</Link><Link to="/contact">聊聊你的想法 ↗</Link></div><span className="art-signoff">王泽斌 © 2026</span></section>
  {selection&&<ArtLightbox group={selection.group} initial={selection.index} onClose={()=>setSelection(null)}/>}
 </main>
}

function ArtLightbox({group,initial,onClose}:{group:string;initial:number;onClose:()=>void}){
 const items=artMedia.filter(m=>m.group===group),[index,setIndex]=useState(initial),[fit,setFit]=useState(true)
 const dialog=useRef<HTMLDialogElement>(null),item=items[index]
 const step=(delta:number)=>{setIndex(i=>(i+delta+items.length)%items.length);setFit(true)}
 useEffect(()=>{const el=dialog.current!,focus=document.activeElement as HTMLElement|null;el.showModal();lenis()?.stop();document.body.classList.add('art-viewer-open');return()=>{el.close();lenis()?.start();document.body.classList.remove('art-viewer-open');focus?.focus({preventScroll:true})}},[])
 return <dialog className="art-viewer" ref={dialog} aria-label={`${artGroups.find(g=>g.id===group)?.title}作品查看器`} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}}} data-lenis-prevent>
  <div className="art-viewer-top"><span>{artGroups.find(g=>g.id===group)?.title} / {String(index+1).padStart(2,'0')} — {String(items.length).padStart(2,'0')}</span><button onClick={onClose} autoFocus aria-label="关闭作品查看器">关闭 ×</button></div>
  <div className={`art-viewer-media${fit?'':' zoomed'}`} key={item.id}>{item.type==='video'?<video src={item.src} poster={item.thumb} controls autoPlay playsInline preload="metadata" aria-label={item.caption}/>:<button onClick={()=>setFit(!fit)} aria-label={fit?'放大查看图片':'恢复完整图片'}><img src={item.src} alt={item.caption}/></button>}</div>
  <div className="art-viewer-bottom"><button onClick={()=>step(-1)} aria-label="上一件作品">← 上一件</button><p aria-live="polite">{item.caption}<small>{item.type==='video'?'现场实况片段':fit?'完整画面 · 点击放大':'放大查看 · 点击还原'}</small></p><button onClick={()=>step(1)} aria-label="下一件作品">下一件 →</button></div>
 </dialog>
}
