export type DiagramBox={id:string;x:number;y:number;width:number;height:number}
type Point={x:number;y:number}
/** Orthogonal visibility-grid routing. Edges may run in gutters, never through a module. */
export function routeEdge(boxes:DiagramBox[],from:string,to:string,padding=7):string {
 const a=boxes.find(b=>b.id===from)!,b=boxes.find(b=>b.id===to)!
 const inflated=boxes.map(r=>({x:r.x-padding,y:r.y-padding,right:r.x+r.width+padding,bottom:r.y+r.height+padding}))
 const ports=(r:DiagramBox)=>[
  {outer:{x:r.x-padding,y:r.y+r.height/2},inner:{x:r.x,y:r.y+r.height/2}},
  {outer:{x:r.x+r.width+padding,y:r.y+r.height/2},inner:{x:r.x+r.width,y:r.y+r.height/2}},
  {outer:{x:r.x+r.width/2,y:r.y-padding},inner:{x:r.x+r.width/2,y:r.y}},
  {outer:{x:r.x+r.width/2,y:r.y+r.height+padding},inner:{x:r.x+r.width/2,y:r.y+r.height}},
 ]
 const starts=ports(a),ends=ports(b)
 const xs=[...new Set([...inflated.flatMap(r=>[r.x,r.right]),...starts.map(p=>p.outer.x),...ends.map(p=>p.outer.x)])].sort((a,b)=>a-b)
 const ys=[...new Set([...inflated.flatMap(r=>[r.y,r.bottom]),...starts.map(p=>p.outer.y),...ends.map(p=>p.outer.y)])].sort((a,b)=>a-b)
 const width=xs.length,total=width*ys.length
 const point=(id:number):Point=>({x:xs[id%width],y:ys[Math.floor(id/width)]})
 const index=(p:Point)=>ys.indexOf(p.y)*width+xs.indexOf(p.x)
 const blocked=(p:Point)=>inflated.some(r=>p.x>r.x+.01&&p.x<r.right-.01&&p.y>r.y+.01&&p.y<r.bottom-.01)
 const visible=(p:Point,q:Point)=>!inflated.some(r=>p.x===q.x?p.x>r.x+.01&&p.x<r.right-.01&&Math.max(p.y,q.y)>r.y+.01&&Math.min(p.y,q.y)<r.bottom-.01:p.y>r.y+.01&&p.y<r.bottom-.01&&Math.max(p.x,q.x)>r.x+.01&&Math.min(p.x,q.x)<r.right-.01)
 const valid=Array.from({length:total},(_,i)=>!blocked(point(i)))
 const dist=new Float64Array(total).fill(Infinity),previous=new Int32Array(total).fill(-1),origin=new Int32Array(total).fill(-1),pending=new Set<number>()
 starts.forEach((p,i)=>{const id=index(p.outer);if(valid[id]){dist[id]=0;origin[id]=i;pending.add(id)}})
 const targets=new Map(ends.map((p,i)=>[index(p.outer),i]))
 let finish=-1
 while(pending.size){
  let current=-1,best=Infinity
  for(const id of pending){const p=point(id),h=Math.min(...ends.map(e=>Math.abs(e.outer.x-p.x)+Math.abs(e.outer.y-p.y)));if(dist[id]+h<best){best=dist[id]+h;current=id}}
  if(current<0)break
  if(targets.has(current)){finish=current;break}
  pending.delete(current)
  const col=current%width,row=Math.floor(current/width)
  const neighbours=[col>0?current-1:-1,col<width-1?current+1:-1,row>0?current-width:-1,row<ys.length-1?current+width:-1]
  for(const next of neighbours){if(next<0||!valid[next])continue;const p=point(current),q=point(next);if(!visible(p,q))continue;const length=Math.abs(p.x-q.x)+Math.abs(p.y-q.y)+.001;if(dist[current]+length<dist[next]){dist[next]=dist[current]+length;previous[next]=current;origin[next]=origin[current];pending.add(next)}}
 }
 if(finish<0) return ''
 const chain:Point[]=[];let cursor=finish
 while(cursor>=0){chain.push(point(cursor));cursor=previous[cursor]}
 chain.reverse();chain.unshift(starts[origin[finish]].inner);chain.push(ends[targets.get(finish)!].inner)
 const simplified=chain.filter((p,i)=>i===0||i===chain.length-1||!((chain[i-1].x===p.x&&p.x===chain[i+1].x)||(chain[i-1].y===p.y&&p.y===chain[i+1].y)))
 return simplified.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}
