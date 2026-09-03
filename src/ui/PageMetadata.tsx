import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {pageMetadata} from '../metadata'
export default function PageMetadata(){
 const {pathname}=useLocation()
 useEffect(()=>{
  const m=pageMetadata(pathname)
  document.title=m.title
  const set=(name:string,value:string,property=false)=>{const attribute=property?'property':'name';let el=document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attribute,name);document.head.append(el)}el.content=value}
  set('description',m.description);set('og:title',m.title,true);set('og:description',m.description,true);set('og:type',m.type,true);set('twitter:title',m.title);set('twitter:description',m.description);set('twitter:card','summary_large_image');set('robots',m.known?'index,follow':'noindex,follow')
  const configured=import.meta.env.VITE_PUBLIC_SITE_ORIGIN as string|undefined
  const local=['http://127.0.0.1:5173','http://localhost:5173'].includes(location.origin)
  const origin=configured||(local?location.origin:'')
  if(origin){set('og:image',new URL(m.image,origin).href,true);set('twitter:image',new URL(m.image,origin).href);set('og:url',new URL(m.pathname,origin).href,true)}
  else{document.head.querySelector('meta[property="og:image"]')?.remove();document.head.querySelector('meta[property="og:url"]')?.remove();document.head.querySelector('meta[name="twitter:image"]')?.remove()}
  let canonical=document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if(configured&&m.known){if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical)}canonical.href=new URL(m.pathname,configured).href}else canonical?.remove()
 },[pathname])
 return null
}
