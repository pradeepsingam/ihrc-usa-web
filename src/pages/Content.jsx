import {useState,useEffect} from 'react';
import NotFound from './NotFound';
import {useSearchParams,useParams} from 'react-router-dom';
import {Award,User} from 'lucide-react';
import {texts,programs,benefits,groups,people,allPeople} from '../data';
import {Page,Card,Tabs,Accordion,ProgramCard,PersonCard,IconBadge,Btn,Pending,RichText,Gallery} from '../components/UI';
import RegistrationForm from '../components/RegistrationForm';
import {forms} from '../content';
import ObjectivesSection from '../components/ObjectivesSection';
import CoreValues from '../components/CoreValues';
import SdgGoals from '../components/SdgGoals';
import BenefitsOfIhrc from '../components/BenefitsOfIhrc';
import FormCta from '../components/FormCta';
import {ProgramUpdates} from '../components/UpdatesList';

export const TextPage=({k})=>{const t=texts[k];return <Page title={t.title} sub={t.sub}>{k==='constitution'?<Accordion items={t.b}/>:
<div className="space-y-4">{t.b.map(([h,p])=>k==='who-we-are'&&h==='Sustainable Development Goals'?<SdgGoals key={h}/>:k==='objectives'&&h==='Objectives'?<ObjectivesSection key={h}/>:k==='objectives'&&h==='Core Values'?<CoreValues key={h}/>:<Card key={h} ><div className="relative"><h2 className="font-serif text-xl font-bold text-navy">{h}</h2>{typeof p==='string'?<RichText text={p} cls="mt-2"/>:<>{!Array.isArray(p)&&<p className="mt-2 text-slate-700">{p.intro}</p>}<ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">{(Array.isArray(p)?p:p.items).map((i,n)=><li key={n} className="flex gap-2 text-slate-700"><span className="text-brand">•</span><span>{i}</span></li>)}</ul></>}</div></Card>)}</div>}
{t.images&&t.images.length>0&&<div className="mt-8"><Gallery images={t.images} alt={t.title}/></div>}
{t.form&&forms[t.form]&&<div className="mt-8"><RegistrationForm spec={forms[t.form]}/></div>}</Page>};

// A form made in the admin Form Builder, at /forms/<address>.
export const FormPage=()=>{const{slug}=useParams();const f=forms[slug];if(!f)return <NotFound/>;
return <Page title={f.title} sub="Please complete the form below."><RegistrationForm spec={f}/></Page>};

export const Programs=()=>{const[sp]=useSearchParams();const[c,setC]=useState(sp.get('cat')||'All');useEffect(()=>setC(sp.get('cat')||'All'),[sp]);const cats=['All',...new Set(programs.map(p=>p.c))];
return <Page title="Programs" sub="Our 31 specific objectives."><Tabs items={cats} value={c} onChange={setC}/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{programs.filter(p=>c==='All'||p.c===c).map(p=><ProgramCard key={p.t} p={p}/>)}</div><ProgramUpdates cat={c}/></Page>};


export const Benefits=()=><Page title="Membership Benefits" sub="Why join the IHRC-USA."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(([t,d])=><Card key={t}><IconBadge i={Award}/><h3 className="mt-3 font-bold text-navy">{t}</h3><p className="text-sm text-slate-600">{d}</p></Card>)}</div><div className="mt-6"><Btn to="/apply">Apply for Membership</Btn></div><div className="mt-10"><BenefitsOfIhrc/></div></Page>;

export const People=({g})=>{const[q,setQ]=useState('');const[c,setC]=useState('All');const[country,setCountry]=useState('');useEffect(()=>{setQ('');setC('All');setCountry('')},[g]);const G=groups[g];
const countries=[...new Set(people[g].map(p=>p.country).filter(Boolean))].sort();
return <Page title={G.title} sub={G.sub}><FormCta page={g} cls="mb-6"/>{G.cats&&<Tabs items={['All',...G.cats]} value={c} onChange={setC} wrap={G.cats.length>4}/>}<div className="mb-6 flex flex-col gap-3 sm:flex-row"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter by name or role…" aria-label="Filter" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:max-w-sm"/>
{countries.length>0&&<select value={country} onChange={e=>setCountry(e.target.value)} aria-label="Filter by country" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:max-w-xs"><option value="">All countries</option>{countries.map(x=><option key={x}>{x}</option>)}</select>}</div>
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{people[g].filter(p=>(!country||p.country===country)&&(!G.cats||c==='All'||p.role===c||(p.role.endsWith(' — '+c)||p.role.endsWith(' – '+c)||p.role.endsWith(' for '+c)))&&(p.name+p.role+(p.country||'')).toLowerCase().includes(q.toLowerCase())).map(p=><PersonCard key={p.id} p={p}/>)}</div>{people[g].length===0&&<Card cls="text-center text-slate-600">Members of this page will be listed here soon.</Card>}</Page>};

// One person's profile. The address is /member-profile/<member ID>, and the ID may contain "/".
const Row=({label,children})=>children?<><dt className="text-slate-500">{label}</dt><dd className="whitespace-pre-line break-words">{children}</dd></>:null;
export const Profile=()=>{const id=useParams()['*']?.replace(/\/+$/,'');const p=id&&allPeople.find(x=>String(x.id)===id||String(x.memberId||'')===id);
if(!p)return <NotFound/>;
const page=Object.entries(people).find(([,list])=>list.includes(p))?.[0];
return <Page title={p.name} sub={p.role}><Card cls="flex flex-col items-center gap-6 sm:flex-row sm:items-start">{p.photo?<img src={p.photo} alt={p.name} className="h-40 w-40 shrink-0 rounded-full object-cover"/>:<span className="grid h-40 w-40 shrink-0 place-items-center rounded-full bg-navy/10 text-navy"><User size={64}/></span>}
<dl className="grid w-full flex-1 grid-cols-[9rem_1fr] gap-x-3 gap-y-2 text-sm"><Row label="Name">{p.name}</Row><Row label="Position">{p.role}</Row>{page&&<Row label="Members page">{groups[page].title}</Row>}<Row label="Member ID">{p.memberId}</Row><Row label="Membership">{p.title}</Row><Row label="Profession">{p.profession}</Row><Row label="Organization">{p.organization}</Row><Row label="City">{p.city}</Row><Row label="Country">{p.country}</Row><Row label="Member since">{p.joined}</Row><Row label="Areas of interest">{p.interests}</Row></dl></Card>
{p.bio&&<Card cls="mt-6"><h2 className="font-serif text-xl font-bold text-navy">Biography</h2><RichText text={p.bio} cls="mt-2"/></Card>}
{p.responsibilities&&<Card cls="mt-6"><h2 className="font-serif text-xl font-bold text-navy">Responsibilities</h2><RichText text={p.responsibilities} cls="mt-2"/></Card>}</Page>};
