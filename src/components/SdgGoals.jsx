import {useState} from 'react';
import {Card} from './UI';
import {sdgs} from '../data/sdgs';

const font={fontFamily:"'Arial Narrow','Roboto Condensed','Helvetica Neue',Arial,sans-serif",fontStretch:'condensed'};

export default function SdgGoals(){
const [active,setActive]=useState(null);
const g=active?sdgs.find(s=>s.n===active):null;
return <Card>
<h2 className="font-serif text-xl font-bold text-navy">Sustainable Development Goals</h2>
<p className="mt-2 text-base text-slate-700 sm:text-lg">IHRC-USA works in support of the United Nations Sustainable Development Goals. Hover over (or tap) the goals to open them up and read each one.</p>
<div className="mx-auto mt-6 max-w-4xl" onMouseLeave={()=>setActive(null)}>
<ul className="group/sdg grid grid-cols-6 gap-[1.6%] transition-all duration-300 ease-out hover:gap-3 focus-within:gap-3 sm:hover:gap-5">
{sdgs.map(s=><li key={s.n} className="relative">
<button type="button" onMouseEnter={()=>setActive(s.n)} onFocus={()=>setActive(s.n)} onClick={()=>setActive(s.n)} aria-label={`Goal ${s.n}: ${s.title}`} aria-pressed={active===s.n}
className="relative block aspect-square w-full overflow-hidden rounded-[3%] text-left text-white transition-all duration-300 ease-out hover:z-10 hover:scale-110 hover:shadow-xl focus:z-10 focus:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand group-hover/sdg:rounded-lg group-focus-within/sdg:rounded-lg"
style={{background:s.color,containerType:'inline-size',...(active===s.n?{boxShadow:`0 0 0 3px ${s.color}`}:null)}}>
<span aria-hidden="true" className="absolute font-bold leading-none" style={{...font,left:'8%',top:'7%',fontSize:'24cqw'}}>{s.n}</span>
<span aria-hidden="true" className="absolute font-bold uppercase leading-[1.08]" style={{...font,left:'30%',right:'4%',top:'9%',fontSize:'8.6cqw'}}>{s.title}</span>
<img src={`/images/sdg/goal-${s.n}.png`} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full"/>
</button></li>)}
<li aria-hidden="true" className="relative">
<div className="grid aspect-square w-full place-items-center rounded-[3%] bg-slate-100 p-[8%] text-center font-bold uppercase leading-none text-[#009edb] transition-all duration-300 group-hover/sdg:rounded-lg" style={{...font,containerType:'inline-size'}}>
<span style={{fontSize:'15cqw',lineHeight:1.05}}>Sustainable<br/>Development<br/><span style={{fontSize:'22cqw'}}>Goals</span></span></div></li>
</ul>
<div aria-live="polite" className="mt-6 min-h-[8rem] rounded-lg border-l-8 bg-slate-50 p-5 transition-colors sm:p-6" style={{borderLeftColor:g?g.color:'#cbd5e1'}}>
{g?<><p className="text-lg font-bold uppercase tracking-wide sm:text-xl" style={{color:g.color}}>Goal {g.n} · {g.title}</p><p className="mt-2 text-lg leading-relaxed text-slate-800 sm:text-2xl">{g.text}</p></>
:<p className="text-lg text-slate-500 sm:text-xl">Move your mouse over a goal to see what it stands for.</p>}
</div></div>
</Card>}
