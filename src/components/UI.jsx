import {useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {pageBgs} from '../data';
import {ChevronDown,CheckCircle2,Calendar,User,AlertCircle,MapPin,X} from 'lucide-react';
import {siteInfo,TBD} from '../content';
import {submitForm} from '../lib/submitForm';

export const Img=({src,alt,cls=''})=>{const[f,setF]=useState(false);return f?null:<img src={src} alt={alt} onError={()=>setF(true)} className={'object-cover '+cls}/>};
export const fmt=d=>{const x=new Date(d+'T00:00:00');return isNaN(x)?d:x.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})};
export const Pending=({children=TBD})=><span className="italic text-slate-500">{children}</span>;
export const Empty=({children})=><div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 shadow-sm">{children}</div>;
export const Gallery=({images=[],alt=''})=>{const[o,setO]=useState(null);if(!images.length)return null;return <><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{images.map(src=><button key={src} onClick={()=>setO(src)} className="overflow-hidden rounded-lg" aria-label={'Enlarge image: '+alt}><img src={src} alt={alt} loading="lazy" className="h-40 w-full object-cover transition hover:scale-105"/></button>)}</div>{o&&<div role="dialog" aria-modal="true" onClick={()=>setO(null)} className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4"><button aria-label="Close" className="absolute right-4 top-4 text-white"><X/></button><img src={o} alt={alt} className="max-h-full max-w-full rounded-lg"/></div>}</>};
export const Wrap=({children,cls=''})=><section className={'mx-auto max-w-6xl px-4 py-8 sm:py-10 '+cls}>{children}</section>;
export const Heading=({children,to})=><div className="mb-5 flex items-center justify-between gap-3"><h2 className="border-l-4 border-brand pl-3 text-xl font-bold text-navy sm:text-2xl">{children}</h2>{to&&<Link to={to} className="shrink-0 text-sm font-semibold text-brand hover:underline">View all →</Link>}</div>;
export const Btn=({to,children,alt,cls=''})=><Link to={to} className={'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition '+(alt?'border-2 border-navy text-navy hover:bg-navy hover:text-white ':'bg-navy text-white hover:bg-brand ')+cls}>{children}</Link>;
export const Page=({title,sub,img,bg:bgProp,children})=>{const{pathname}=useLocation();const bg=bgProp||pageBgs[pathname.replace(/^\/+|\/+$/g,'')];return <div><div className={"relative isolate overflow-hidden px-4 py-10 text-white sm:py-14 "+(bg?"bg-navy ":"bg-gradient-to-r from-navy to-brand")}>{bg&&<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><img src={bg} alt="" className="h-full w-full object-cover object-center"/><div className="absolute inset-0 bg-navy/60"/></div>}<div className="mx-auto flex max-w-6xl items-center justify-between gap-6"><div><h1 className="font-serif text-3xl font-bold drop-shadow-sm sm:text-4xl">{title}</h1>{sub&&<p className="mt-2 max-w-2xl text-blue-100 drop-shadow-sm">{sub}</p>}</div></div></div>
<div className={bg?"bg-[#f3f7fc]":""}><Wrap>{children}</Wrap></div></div>};
export const Card=({children,cls=''})=><div className={'rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md '+cls}>{children}</div>;
export const IconBadge=({i:I})=><span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-100 text-brand sm:h-20 sm:w-20"><I size={30}/></span>;

export const Tabs=({items,value,onChange})=><div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist">{items.map(t=><button key={t} role="tab" aria-selected={value===t} onClick={()=>onChange(t)} className={'min-h-[40px] shrink-0 rounded-full px-4 text-sm font-medium '+(value===t?'bg-navy text-white':'bg-white text-navy ring-1 ring-slate-200 hover:bg-blue-50')}>{t}</button>)}</div>;

export const Accordion=({items})=>{const[o,setO]=useState(0);return <div className="space-y-2">{items.map(([q,a],i)=><div key={q} className="rounded-lg bg-white ring-1 ring-slate-100">
<button onClick={()=>setO(o===i?-1:i)} aria-expanded={o===i} className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-navy">{q}<ChevronDown size={18} className={'shrink-0 transition '+(o===i?'rotate-180':'')}/></button>
{o===i&&<p className="whitespace-pre-line px-4 pb-4 text-slate-600">{a}</p>}</div>)}</div>};

export const ProgramCard=({p})=><Link to={'/programs/'+p.slug}><Card cls="h-full flex flex-col gap-3"><div className="flex items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-100 text-brand"><p.icon size={22}/></span><span className="text-xs font-semibold text-brand">{p.c}</span></div><h3 className="font-bold text-navy">{p.t}</h3><p className="text-sm text-slate-600 flex-1">{p.d}</p></Card></Link>;
export const NewsCard=({n})=><Link to={'/news/'+n.id}><Card cls="flex h-full flex-col">{n.image&&<Img src={n.image} alt={n.title} cls="mb-3 w-full rounded-lg"/>}<span className="w-fit rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">{n.type}</span><h3 className="mt-2 font-bold text-navy">{n.title}</h3><p className="mt-1 flex-1 text-sm text-slate-600">{n.summary}</p><p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Calendar size={14}/>{fmt(n.date)}</p></Card></Link>;
export const EventCard=({e})=><Link to={'/events/'+e.id}><Card cls="flex h-full flex-col">{e.image&&<Img src={e.image} alt={e.title} cls="mb-3 w-full rounded-lg"/>}<span className="w-fit rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Event</span><h3 className="mt-2 font-bold text-navy">{e.title}</h3><p className="mt-1 flex-1 text-sm text-slate-600">{e.description}</p><p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Calendar size={14}/>{fmt(e.date)}</p>{e.location&&<p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={14}/>{e.location}</p>}</Card></Link>;
export const PersonCard=({p})=><Link to={'/member-profile/'+p.id}><Card cls="text-center">{p.photo?<img src={p.photo} alt={p.name} className="mx-auto h-20 w-20 rounded-full object-cover"/>:<span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy/10 text-navy"><User size={34}/></span>}<h3 className={'mt-3 font-bold '+(p.tbd?'italic text-slate-400':'text-navy')}>{p.name}</h3><p className="text-sm text-slate-500">{p.role}</p></Card></Link>;

const rules={email:/^\S+@\S+\.\S+$/,tel:/^\+?[\d\s-]{9,15}$/};
export function Form({fields,button='Submit',ok='Thank you. Your email app has opened with your details. Please press Send there to complete your submission.',to=siteInfo.email,subject='',init={}}){
const[v,setV]=useState(init);const[e,setE]=useState({});const[done,setDone]=useState(false);
const set=(n,x)=>setV({...v,[n]:x});
const[busy,setBusy]=useState(false);const[err,setErr]=useState('');const[mode,setMode]=useState('mailto');
const submit=async ev=>{ev.preventDefault();const er={};fields.forEach(f=>{const x=(v[f.n]||'').trim();if(f.req&&!x)er[f.n]='This field is required';else if(x&&rules[f.type]&&!rules[f.type].test(x))er[f.n]='Enter a valid '+(f.type==='tel'?'phone number':f.type);});setE(er);setErr('');if(Object.keys(er).length)return;
setBusy(true);try{const m=await submitForm({form:subject||button,subject:subject||button,to,fields:fields.map(f=>({label:f.label,value:v[f.n]}))});setMode(m);setDone(true);setV(init)}catch(x){setErr('Sorry, we could not send your form. Please try again, or email us at '+to+'.')}finally{setBusy(false)}};
if(done)return <div role="status" className="rounded-xl bg-green-50 p-6 text-center text-green-800"><CheckCircle2 className="mx-auto mb-2"/><p>{mode==='api'?'Thank you. Your form has been submitted successfully. We will get back to you soon.':mode==='mailto-copy'?'Your details were copied. Your email app has opened: paste them into the email body (Ctrl+V) and press Send.':ok}</p><button onClick={()=>setDone(false)} className="mt-3 text-sm font-semibold underline">Fill again</button></div>;
const cl=n=>'mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand '+(e[n]?'border-red-400':'border-slate-300');
const has=Object.keys(e).length>0;
return <form noValidate onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
{err&&<div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2"><AlertCircle size={18}/>{err}</div>}
{has&&<div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2"><AlertCircle size={18}/>Please correct the highlighted fields and try again.</div>}
{fields.map(f=><label key={f.n} className={'block text-sm font-medium '+(f.type==='textarea'?'sm:col-span-2':'')}>{f.label}{f.req&&' *'}
{f.hint&&<span className="block text-xs font-normal text-slate-500">{f.hint}</span>}
{f.opts?<select value={v[f.n]||''} aria-invalid={!!e[f.n]} onChange={x=>set(f.n,x.target.value)} className={cl(f.n)}><option value="">Select…</option>{f.opts.map(o=><option key={o}>{o}</option>)}</select>:
f.type==='textarea'?<textarea rows={4} value={v[f.n]||''} aria-invalid={!!e[f.n]} onChange={x=>set(f.n,x.target.value)} className={cl(f.n)}/>:
<input type={f.type||'text'} value={v[f.n]||''} aria-invalid={!!e[f.n]} onChange={x=>set(f.n,x.target.value)} className={cl(f.n)}/>}
{e[f.n]&&<span className="text-xs text-red-600">{e[f.n]}</span>}</label>)}
<p className="text-xs text-slate-500 sm:col-span-2">Your details are sent to IHRC-USA and are used only to respond to your request.</p>
<div className="sm:col-span-2"><button disabled={busy} className="min-h-[48px] w-full rounded-full bg-navy px-8 font-semibold text-white hover:bg-brand disabled:opacity-60 sm:w-auto">{busy?'Sending…':button}</button></div></form>}
