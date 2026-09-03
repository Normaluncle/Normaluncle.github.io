import {build,createServer,loadEnv} from 'vite'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
import path from 'node:path'
const environment=loadEnv('production',process.cwd(),'VITE_')
const siteConfig=JSON.parse(await readFile('src/site-config.json','utf8'))
const origin=process.env.VITE_PUBLIC_SITE_ORIGIN||environment.VITE_PUBLIC_SITE_ORIGIN||siteConfig.origin||''
if(origin){const u=new URL(origin);if(!['http:','https:'].includes(u.protocol)||u.pathname!=='/'||u.search||u.hash)throw new Error('VITE_PUBLIC_SITE_ORIGIN must be a http(s) origin without a subdirectory')}
await build()
const vite=await createServer({cacheDir:'.verify/static-vite-cache',optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom',mode:'production'})
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')
try{
 const {render,publicRoutes,pageMetadata}=await vite.ssrLoadModule('/src/entry-static.tsx')
 const template=await readFile('dist/index.html','utf8')
 for(const route of [...publicRoutes,'/404']){
  const m=pageMetadata(route),url=origin?new URL(m.pathname,origin).href:'',image=origin?new URL(m.image,origin).href:''
  const tags=[['property','og:title',m.title],['property','og:description',m.description],['property','og:type',m.type],['name','twitter:title',m.title],['name','twitter:description',m.description],['name','twitter:card','summary_large_image'],['name','robots',m.known?'index,follow':'noindex,follow']]
  if(origin)tags.push(['property','og:image',image],['name','twitter:image',image],['property','og:url',url])
  const head=tags.map(([a,n,v])=>`<meta ${a}="${n}" content="${escape(v)}" />`).join('\n')+(origin&&m.known?`\n<link rel="canonical" href="${escape(url)}" />`:'')
  const html=template.replace(/<title>.*?<\/title>/,`<title>${escape(m.title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(m.description)}" />`).replace('</head>',head+'\n</head>').replace('<div id="root"></div>',`<div id="root">${render(route)}</div>`).replace('<body>',`<body${route==='/art'?' class="art-route"':''}>`)
  const filename=route==='/404'?'dist/404.html':path.join('dist',route.slice(1),'index.html')
  await mkdir(path.dirname(filename),{recursive:true});await writeFile(filename,html)
  // Static hosts differ on /route versus /route/. Supply both clean-URL forms
  // so a request never falls back to the home page before React hydrates it.
  if(route!=='/'&&route!=='/404'){const flat=path.join('dist',route.slice(1)+'.html');await mkdir(path.dirname(flat),{recursive:true});await writeFile(flat,html)}
 }
 await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${origin?`Sitemap: ${origin.replace(/\/$/,'')}/sitemap.xml\n`:''}`)
 if(origin)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(r=>`<url><loc>${escape(new URL(r,origin).href)}</loc></url>`).join('')}</urlset>`)
 console.log(`Pre-rendered ${publicRoutes.length} pages + 404. ${origin?'Canonical and sharing URLs included.':'Set VITE_PUBLIC_SITE_ORIGIN before the final public build for absolute sharing URLs.'}`)
}finally{await vite.close()}
