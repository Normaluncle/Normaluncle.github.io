import {IMG,notes,works} from './content'
import {systemStories} from './systems'
import {artMedia} from './art'
export const publicRoutes=['/','/studio','/work','/news','/contact','/art',...works.map(w=>`/work/${w.slug}`),...notes.map(n=>`/news/${n.slug}`),...systemStories.map(s=>`/systems/${s.slug}`)]
export function pageMetadata(path:string){
 const pathname=path.replace(/\/$/,'')||'/'
 const work=works.find(w=>pathname===`/work/${w.slug}`),note=notes.find(n=>pathname===`/news/${n.slug}`),story=systemStories.find(s=>pathname===`/systems/${s.slug}`)
 const names:Record<string,string>={'/':'产品、设计与 AI 应用','/studio':'经历与方法','/work':'精选项目','/news':'项目笔记','/contact':'联系','/art':'我的另一面'}
 const art=pathname==='/art'
 const title=`${work?.title||note?.title||story?.title.replaceAll('\n','')||names[pathname]||'页面未找到'} · 王泽斌`
 const description=work?.lead||note?.excerpt||story?.intro||(art?'王泽斌的艺术作品夹：体育馆与校园墙绘、酒吧现场、人物线稿、3D 场景和实况片段。':'美术生出身，画过墙、带过店，也做过小程序和 AI 应用。这里是王泽斌的项目、经历、笔记与联系方式。')
 const project=story&&works.find(w=>w.slug===story.project)
 const image=work?IMG[work.heroImg]:note?IMG[note.img]:project?IMG[project.heroImg]:art?artMedia.find(m=>m.id==='bar-8')!.src:IMG.showreel05
 return {title,description,image,type:note?'article':'website',known:publicRoutes.includes(pathname),pathname}
}
