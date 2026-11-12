import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ChevronDown,CheckCircle2,Calendar} from 'lucide-react';

export const Img=({src,alt,cls=''})=>{const[f,setF]=useState(false);return f?null:<img src={src} alt={alt} onError={()=>setF(true)} className={'object-cover '+cls}/>};
export const Wrap=({children,cls=''})=><section className={'mx-auto max-w-6xl px-4 py-8 sm:py-10 '+cls}>{children}</section>;
export const Heading=({children,to})=><div className="mb-5 flex items-center justify-between gap-3"><h2 className="border-l-4 border-brand pl-3 text-xl font-bold text-navy sm:text-2xl">{children}</h2>{to&&<Link to={to} className="shrink-0 text-sm font-semibold text-brand hover:underline">View all →</Link>}</div>;
export const Btn=({to,children,alt,cls=''})=><Link to={to} className={'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition '+(alt?'border-2 border-navy text-navy hover:bg-navy hover:text-white ':'bg-navy text-white hover:bg-brand ')+cls}>{children}</Link>;
export const Page=({title,sub,img,children})=><><div className="bg-gradient-to-r from-navy to-brand px-4 py-10 text-white sm:py-14"><div className="mx-auto flex max-w-6xl items-center justify-between gap-6"><div><h1 className="font-serif text-3xl font-bold sm:text-4xl">{title}</h1>{sub&&<p className="mt-2 max-w-2xl text-blue-100">{sub}</p>}</div>{img&&<Img src={'/images/ihrc/'+img+'.png'} alt="" cls="hidden h-36 w-auto rounded-lg shadow-lg ring-2 ring-white/50 md:block"/>}</div></div>
<Wrap>{children}</Wrap></>;
export const Card=({children,cls=''})=><div className={'rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md '+cls}>{children}</div>;
export const IconBadge=({i:I})=><span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-100 text-brand sm:h-20 sm:w-20"><I size={30}/></span>;

export const Tabs=({items,value,onChange})=><div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist">{items.map(t=><button key={t} role="tab" aria-selected={value===t} onClick={()=>onChange(t)} className={'min-h-[40px] shrink-0 rounded-full px-4 text-sm font-medium '+(value===t?'bg-navy text-white':'bg-white text-navy ring-1 ring-slate-200 hover:bg-blue-50')}>{t}</button>)}</div>;

export const Accordion=({items})=>{const[o,setO]=useState(0);return <div className="space-y-2">{items.map(([q,a],i)=><div key={q} className="rounded-lg bg-white ring-1 ring-slate-100">
<button onClick={()=>setO(o===i?-1:i)} aria-expanded={o===i} className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-navy">{q}<ChevronDown size={18} className={'shrink-0 transition '+(o===i?'rotate-180':'')}/></button>
{o===i&&<p className="whitespace-pre-line px-4 pb-4 text-slate-600">{a}</p>}</div>)}</div>};

export const ProgramCard=({p})=><Card><Img src={p.img} alt={p.t} cls="w-full rounded-lg"/><h3 className="mt-3 font-bold text-navy">{p.t}</h3><span className="text-xs font-semibold text-brand">{p.c}</span><p className="mt-1 text-sm text-slate-600">{p.d}</p></Card>;
export const NewsCard=({n})=><Card cls="flex flex-col"><Img src={n.img} alt={n.t} cls="mb-3 w-full rounded-lg"/>
<span className={'w-fit rounded-full px-2 py-0.5 text-xs font-semibold '+(n.k==='Event'?'bg-amber-100 text-amber-800':'bg-blue-100 text-blue-800')}>{n.k}</span>
<h3 className="mt-2 font-bold text-navy">{n.t}</h3><p className="mt-1 flex-1 text-sm text-slate-600">{n.d}</p><p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Calendar size={14}/>{n.dt}</p></Card>;
export const PersonCard=({p})=><Link to={'/member-profile/'+p.id}><Card cls="text-center"><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy text-xl font-bold text-white">{p.name.replace(/^(Dr|Mr|Mrs|Ms)\.\s/,'').split(' ').map(w=>w[0]).join('')}</span>
<h3 className="mt-3 font-bold text-navy">{p.name}</h3><p className="text-sm text-slate-500">{p.role}</p></Card></Link>;

const rules={email:/^\S+@\S+\.\S+$/,tel:/^\+?[\d\s-]{9,15}$/};
export function Form({fields,button='Submit',ok='Your email app has opened with your details. Please press Send to complete your request.',to='globalihrc@gmail.com',subject=''}){
const[v,setV]=useState({});const[e,setE]=useState({});const[done,setDone]=useState(false);
const submit=ev=>{ev.preventDefault();const er={};fields.forEach(f=>{const x=(v[f.n]||'').trim();if(f.req&&!x)er[f.n]='This field is required';else if(x&&rules[f.type]&&!rules[f.type].test(x))er[f.n]='Enter a valid '+f.type;});setE(er);if(!Object.keys(er).length){const body=fields.map(f=>f.label+': '+(v[f.n]||'').trim()).join('\n');window.location.href='mailto:'+to+'?subject='+encodeURIComponent(subject||button)+'&body='+encodeURIComponent(body);setDone(true);setV({})}};
if(done)return <div className="rounded-xl bg-green-50 p-6 text-center text-green-800"><CheckCircle2 className="mx-auto mb-2"/><p>{ok}</p><button onClick={()=>setDone(false)} className="mt-3 text-sm font-semibold underline">Fill again</button></div>;
const cl=n=>'mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand '+(e[n]?'border-red-400':'border-slate-300');
return <form noValidate onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{fields.map(f=><label key={f.n} className={'block text-sm font-medium '+(f.type==='textarea'?'sm:col-span-2':'')}>{f.label}{f.req&&' *'}
{f.opts?<select value={v[f.n]||''} onChange={x=>setV({...v,[f.n]:x.target.value})} className={cl(f.n)}><option value="">Select…</option>{f.opts.map(o=><option key={o}>{o}</option>)}</select>:
f.type==='textarea'?<textarea rows={4} value={v[f.n]||''} onChange={x=>setV({...v,[f.n]:x.target.value})} className={cl(f.n)}/>:
<input type={f.type||'text'} value={v[f.n]||''} onChange={x=>setV({...v,[f.n]:x.target.value})} className={cl(f.n)}/>}
{e[f.n]&&<span className="text-xs text-red-600">{e[f.n]}</span>}</label>)}
<div className="sm:col-span-2"><button className="min-h-[48px] w-full rounded-full bg-navy px-8 font-semibold text-white hover:bg-brand sm:w-auto">{button}</button></div></form>}
