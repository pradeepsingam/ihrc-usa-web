import {useState,useEffect} from 'react';
import {useSearchParams,useParams} from 'react-router-dom';
import {Award,User} from 'lucide-react';
import {texts,programs,benefits,groups,people,allPeople} from '../data';
import {Page,Card,Tabs,Accordion,ProgramCard,PersonCard,IconBadge,Btn,Pending} from '../components/UI';
import ObjectivesSection from '../components/ObjectivesSection';
import CoreValues from '../components/CoreValues';
import BenefitsOfIhrc from '../components/BenefitsOfIhrc';

export const TextPage=({k})=>{const t=texts[k];return <Page title={t.title} sub={t.sub}>{k==='constitution'?<Accordion items={t.b}/>:
<div className="space-y-4">{t.b.map(([h,p])=>k==='objectives'&&h==='Objectives'?<ObjectivesSection key={h}/>:k==='objectives'&&h==='Core Values'?<CoreValues key={h}/>:<Card key={h} ><div className="relative"><h2 className="font-serif text-xl font-bold text-navy">{h}</h2>{typeof p==='string'?<p className="mt-2 whitespace-pre-line text-slate-700">{p}</p>:<>{!Array.isArray(p)&&<p className="mt-2 text-slate-700">{p.intro}</p>}<ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">{(Array.isArray(p)?p:p.items).map(i=><li key={i} className="flex gap-2 text-slate-700"><span className="text-brand">•</span><span>{i}</span></li>)}</ul></>}</div></Card>)}</div>}</Page>};

export const Programs=()=>{const[sp]=useSearchParams();const[c,setC]=useState(sp.get('cat')||'All');useEffect(()=>setC(sp.get('cat')||'All'),[sp]);const cats=['All',...new Set(programs.map(p=>p.c))];
return <Page title="Programs" sub="Initiatives that educate, protect and empower."><Tabs items={cats} value={c} onChange={setC}/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{programs.filter(p=>c==='All'||p.c===c).map(p=><ProgramCard key={p.t} p={p}/>)}</div></Page>};


export const Benefits=()=><Page title="Membership Benefits" sub="Why join the IHRC-USA."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(([t,d])=><Card key={t}><IconBadge i={Award}/><h3 className="mt-3 font-bold text-navy">{t}</h3><p className="text-sm text-slate-600">{d}</p></Card>)}</div><div className="mt-6"><Btn to="/apply">Apply for Membership</Btn></div><div className="mt-10"><BenefitsOfIhrc/></div></Page>;

export const People=({g})=>{const[q,setQ]=useState('');const G=groups[g];
return <Page title={G.title} sub={G.sub}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter by name or role…" aria-label="Filter" className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:max-w-sm"/>
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{people[g].filter(p=>(p.name+p.role).toLowerCase().includes(q.toLowerCase())).map(p=><PersonCard key={p.id} p={p}/>)}</div></Page>};

export const Profile=()=>{const{id}=useParams();const p=allPeople.find(x=>x.id===id)||allPeople[0];
return <Page title={p.tbd?p.role:p.name} sub={p.tbd?'Profile to be added.':p.role}><Card cls="flex flex-col items-center gap-6 sm:flex-row">{p.photo?<img src={p.photo} alt={p.name} className="h-28 w-28 shrink-0 rounded-full object-cover"/>:<span className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-navy/10 text-navy"><User size={48}/></span>}
<dl className="grid flex-1 grid-cols-[8rem_1fr] gap-x-3 gap-y-2 text-sm"><dt className="text-slate-500">Name</dt><dd>{p.tbd?<Pending/>:p.name}</dd><dt className="text-slate-500">Designation</dt><dd>{p.role}</dd><dt className="text-slate-500">Biography</dt><dd>{p.bio||<Pending/>}</dd><dt className="text-slate-500">Responsibilities</dt><dd>{p.responsibilities||<Pending/>}</dd></dl></Card></Page>};
