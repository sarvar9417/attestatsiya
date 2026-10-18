import { useMemo } from 'react'
// Original 2026 M04 diagram bank; formulas drive schematics but are not shown.
const FORMULAS: Record<string,string> = {"G001":"¬((A∧B))","G002":"¬((A∨B))","G003":"¬((A⊕B))","G004":"((A∧B)∧C)","G005":"((A∨B)∨C)","G006":"((A∨B)⊕C)","G007":"((A⊕B)∧C)","G008":"((A⊕B)∨C)","G009":"(¬((A∨B))∧C)","G010":"(¬((A∨B))∨C)","G011":"(¬(A)∧B)","G012":"(¬(A)∨B)","G013":"¬((A⊕B))","G014":"((A∧B)⊕C)","G015":"((A∨B)⊕C)","G016":"((A⊕B)⊕C)","G017":"(¬((A∨B))∧C)","G018":"(¬(A)∨B)","G019":"((A⊕B)∧C)","G020":"(¬((A∧B))∧C)","G021":"(¬((A∨B))∨C)","G022":"(¬(A)⊕B)","G023":"(¬(B)⊕A)","G024":"¬((A⊕B))","G025":"(¬(A)∧B)","G026":"(¬(B)∧A)","G027":"¬((A∧B))","G028":"((A∧B)∧C)","G029":"((A∨B)∧C)","G030":"((A⊕B)∧C)","G031":"¬((A∨B))","G032":"((A∧B)∨C)","G033":"((A∨B)∨C)","G034":"((A⊕B)∨C)","G035":"(¬((A∧B))∨C)","G036":"(¬(A)∧B)","G037":"((A∨B)⊕C)","G038":"((A⊕B)⊕C)","G039":"(¬((A∨B))∧C)","G040":"(¬(A)∨B)","G041":"(¬(B)∨A)","G042":"¬((A∨B))","G043":"(¬(A)∧B)","G044":"(¬(B)∨A)","G045":"((A∧B)∧C)","G046":"((A∨B)∨C)","G047":"(¬((A∧B))∧C)","G048":"(¬(A)∧B)","G049":"(¬(B)⊕A)","G050":"((A∧B)∧C)","G051":"((A∨B)⊕C)","G052":"(¬((A∧B))∧C)"}
type E = {type:'var';label:string}|{type:'gate';op:string;children:E[]}
type Node = {expr:E;x:number;y:number;kids:Node[]}
function parse(source:string):E {
 const t=source.match(/[ABC¬∧∨⊕()]/g)||[];let i=0
 const unary=():E=>{
  if(t[i]==='¬'){i++;return{type:'gate',op:'¬',children:[unary()]}}
  if(t[i]==='('){i++;const n=binary(0);if(t[i++]!==')')throw Error('invalid circuit');return n}
  if(!t[i]||!/[ABC]/.test(t[i]))throw Error('invalid input')
  return{type:'var',label:t[i++]}
 }
 const prec:Record<string,number>={'∨':1,'⊕':2,'∧':3}
 const binary=(min:number):E=>{
  let n=unary()
  while(prec[t[i]]!==undefined&&prec[t[i]]>=min){
   const op=t[i++];const child=binary(prec[op]+1)
   n={type:'gate',op,children:[n,child]}
  }
  return n
 }
 const n=binary(0);if(i!==t.length)throw Error('invalid trailing input');return n
}
const depth=(e:E):number=>e.type==='var'?0:1+Math.max(...e.children.map(depth))
function drawData(root:E) {
 let count=0
 const visit=(e:E):Node=>{
  if(e.type==='var')return{expr:e,x:40,y:55+75*count++,kids:[]}
  const kids=e.children.map(visit),y=kids.reduce((a,c)=>a+c.y,0)/kids.length
  return{expr:e,x:125+depth(e)*108,y,kids}
 }
 const tree=visit(root)
 return{tree,width:tree.x+120,height:Math.max(145,count*75+42)}
}
const children=(n:Node):Node[]=>[...n.kids.flatMap(children),n]
const label=(op:string)=>op==='∧'?'&':op==='∨'?'≥1':op==='⊕'?'=1':'1'
export default function MantiqCircuit({id}:{id:string}){
 const d=useMemo(()=>{try{return FORMULAS[id]?drawData(parse(FORMULAS[id])):null}catch{return null}},[id])
 if(!d)return <span>Chizma topilmadi: {id}</span>
 const ns=children(d.tree)
 return <span className="block my-3 max-w-full overflow-x-auto rounded-lg border border-border bg-white p-2" data-fig={id}>
 <svg role="img" aria-label={`Mantiqiy sxema ${id}`} viewBox={`0 0 ${d.width} ${d.height}`} width={Math.min(d.width,750)} height={d.height} className="max-w-none">
 {ns.map((n,k)=>n.expr.type==='gate'?n.kids.map((child,j)=>{
  const ey=n.kids.length===1?n.y:n.y+(j===0?-14:14)
  const sx=child.x+(child.expr.type==='var'?16:33),ex=n.x-33
  return <path key={`edge-${k}-${j}`} d={`M ${sx} ${child.y} H ${(sx+ex)/2} V ${ey} H ${ex}`} fill="none" stroke="#102e46" strokeWidth="2"/>}):null)}
 {ns.map((n,k)=>n.expr.type==='var'?<text key={k} x={n.x-6} y={n.y+5} fill="#087e8b" fontWeight="700" fontSize="18">{n.expr.label}</text>:
 <g key={k}><rect x={n.x-32} y={n.y-23} width="64" height="46" rx="4" fill="#e7f0f8" stroke="#102e46" strokeWidth="2"/><text x={n.x} y={n.y+6} fill="#102e46" textAnchor="middle" fontSize="19" fontWeight="700">{label(n.expr.op)}</text>{n.expr.op==='¬'&&<circle cx={n.x+35} cy={n.y} r="4" fill="white" stroke="#102e46" strokeWidth="2"/>}</g>)}
 <path d={`M ${d.tree.x+40} ${d.tree.y} H ${d.width-39}`} fill="none" stroke="#102e46" strokeWidth="2"/>
 <text x={d.width-31} y={d.tree.y+5} fill="#087e8b" fontWeight="700" fontSize="17">Y</text>
 </svg></span>
}
