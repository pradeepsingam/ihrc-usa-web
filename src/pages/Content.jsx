import {useState,useEffect} from 'react';
import {useSearchParams,useParams} from 'react-router-dom';
import {Award} from 'lucide-react';
import {texts,programs,news,benefits,groups,people,allPeople} from '../data';
import {Page,Card,Tabs,Accordion,ProgramCard,NewsCard,PersonCard,IconBadge,Btn,Img} from '../components/UI';
import ObjectivesSection from '../components/ObjectivesSection';
import CoreValues from '../components/CoreValues';
import BenefitsOfIhrc from '../components/BenefitsOfIhrc';

export const TextPage=({k})=>{const t=texts[k];return <Page title={t.title} sub={t.sub}>{t.imgs&&<div className="mb-6 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">{t.imgs.map(n=><Img key={n} src={'/images/ihrc/'+n+'.png'} alt={t.title} cls="w-full rounded-xl shadow"/>)}</div>}{k==='constitution'?<Accordion items={t.b}/>:
<div className="space-y-4">{t.b.map(([h,p])=>k==='objectives'&&h==='Objectives'?<ObjectivesSection key={h}/>:k==='objectives'&&h==='Core Values'?<CoreValues key={h}/>:<Card key={h} cls={t.bg&&t.bg[h]?'relative overflow-hidden':''}>{t.bg&&t.bg[h]&&<><img src={'/images/ihrc/'+t.bg[h]+'.png'} alt="" aria-hidden="true" onError={e=>{e.currentTarget.style.display='none'}} className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-cover object-center opacity-[0.14] sm:w-2/3 sm:opacity-20"/><div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/10"/></>}<div className="relative"><h2 className="font-serif text-xl font-bold text-navy">{h}</h2><p className="mt-2 whitespace-pre-line text-slate-700">{p}</p></div></Card>)}</div>}</Page>};

export const Programs=()=>{const[sp]=useSearchParams();const[c,setC]=useState(sp.get('cat')||'All');useEffect(()=>setC(sp.get('cat')||'All'),[sp]);const cats=['All',...new Set(programs.map(p=>p.c))];
return <Page title="Programs" img="09" sub="Initiatives that educate, protect and empower."><Tabs items={cats} value={c} onChange={setC}/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{programs.filter(p=>c==='All'||p.c===c).map(p=><ProgramCard key={p.t} p={p}/>)}</div></Page>};

export const News=()=>{const[sp]=useSearchParams();const[k,setK]=useState(sp.get('type')||'All');useEffect(()=>setK(sp.get('type')||'All'),[sp]);const q=(sp.get('q')||'').toLowerCase();
const list=news.filter(n=>(k==='All'||n.k===k)&&(n.t+n.d).toLowerCase().includes(q));
return <Page img="29" title="News & Events" sub={q?`Search results for “${sp.get('q')}”`:'Latest updates from the branch.'}><Tabs items={['All','News','Event']} value={k} onChange={setK}/>
{list.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(n=><NewsCard key={n.t} n={n}/>)}</div>:<p className="text-slate-500">No results found.</p>}</Page>};

export const Benefits=()=><Page img="26" title="Membership Benefits" sub="Why join the IHRC Sri Lanka Branch."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(([t,d])=><Card key={t}><IconBadge i={Award}/><h3 className="mt-3 font-bold text-navy">{t}</h3><p className="text-sm text-slate-600">{d}</p></Card>)}</div><div className="mt-6"><Btn to="/apply">Apply for Membership</Btn></div><div className="mt-10"><BenefitsOfIhrc/></div></Page>;

export const People=({g})=>{const[q,setQ]=useState('');const G=groups[g];
return <Page title={G.title} img={G.img} sub={G.sub}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter by name or role…" aria-label="Filter" className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:max-w-sm"/>
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{people[g].filter(p=>(p.name+p.role).toLowerCase().includes(q.toLowerCase())).map(p=><PersonCard key={p.id} p={p}/>)}</div></Page>};

export const Profile=()=>{const{id}=useParams();const p=allPeople.find(x=>x.id===id)||allPeople[0];
return <Page title="Member Profile" sub="IHRC member profile."><Card cls="flex flex-col items-center gap-6 sm:flex-row"><span className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-navy text-3xl font-bold text-white">{p.name.split(' ').slice(-2).map(w=>w[0]).join('')}</span>
<div><h2 className="font-serif text-2xl font-bold text-navy">{p.name}</h2><p className="text-brand">{p.role}</p><dl className="mt-3 grid grid-cols-2 gap-2 text-sm"><dt className="text-slate-500">Member ID</dt><dd>{p.id.toUpperCase()}</dd><dt className="text-slate-500">Status</dt><dd>Active</dd></dl></div></Card></Page>};
