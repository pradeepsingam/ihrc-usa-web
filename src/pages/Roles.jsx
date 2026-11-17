import {useState} from 'react';
import {AlertTriangle,ShieldCheck,Scale,Gift,FileText,Ban,Users} from 'lucide-react';
import {Page,Card,Tabs} from '../components/UI';
import FormCta from '../components/FormCta';
import {rolesIntro,rolesStructure,roles,codeOfConduct} from '../data/roles';

const List=({items})=><ul className="mt-2 space-y-2">{items.map(i=><li key={i} className="flex gap-2 text-slate-700"><span className="text-brand">•</span><span>{i}</span></li>)}</ul>;
const Block=({icon:I,title,items})=>items.length?<div className="mt-5"><h3 className="flex items-center gap-2 font-bold text-navy"><I size={18} className="text-brand"/>{title}</h3><List items={items}/></div>:null;

export default function Roles(){
 const tabs=['Overview','Positions','Code of Conduct'];
 const [tab,setTab]=useState('Overview');
 const [sel,setSel]=useState(roles[0].name);
 const r=roles.find(x=>x.name===sel);
 return <Page title="Roles & Responsibilities" sub="Position descriptions, authority, duties and code of conduct within IHRC-USA.">
  <Tabs items={tabs} value={tab} onChange={setTab}/>
  {tab==='Overview'&&<div className="space-y-4">
   <Card><h2 className="font-serif text-xl font-bold text-navy">Introduction and Legal Notice</h2><p className="mt-2 text-slate-700">{rolesIntro.text}</p>
    <div className="mt-4 flex gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200"><AlertTriangle className="mt-0.5 shrink-0" size={18}/><p>{rolesIntro.notice}</p></div></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">General Rules</h2><List items={rolesIntro.rules}/></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">Organisational Positions</h2><p className="mt-2 text-slate-700">The positions and participant categories within IHRC-USA.</p>
    <div className="mt-4 grid gap-6 md:grid-cols-2">{rolesStructure.map(([h,items])=><div key={h}><h3 className="flex items-center gap-2 font-bold text-navy"><Users size={18} className="text-brand"/>{h}</h3><List items={items}/></div>)}</div></Card>
  </div>}
  {tab==='Positions'&&<div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
   <nav aria-label="Positions" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">{roles.map(x=><button key={x.name} onClick={()=>setSel(x.name)} className={'min-h-[40px] shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium '+(sel===x.name?'bg-navy text-white':'bg-white text-navy ring-1 ring-slate-200 hover:bg-blue-50')}>{x.name}</button>)}</nav>
   <Card><h2 className="font-serif text-2xl font-bold text-navy">{r.name}</h2><p className="mt-2 text-slate-700"><span className="font-semibold text-navy">Purpose: </span>{r.purpose}</p>
    <Block icon={ShieldCheck} title="Authority and Permitted Scope" items={r.authority}/>
    <Block icon={FileText} title="Duties and Activities" items={r.duties}/>
    <Block icon={Ban} title="Restrictions and Prohibited Conduct" items={r.restrictions}/>
    <Block icon={Gift} title="Benefits IHRC-USA May Provide" items={r.benefits}/>
    <p className="mt-2 text-xs italic text-slate-500">Benefits are conditional, not guaranteed, and depend on written approval, available resources, performance and policy.</p>
    <Block icon={Scale} title="Reporting, Review and Appointment Term" items={r.reporting}/></Card>
  </div>}
  {tab==='Code of Conduct'&&<div className="grid gap-4 sm:grid-cols-2">{codeOfConduct.map(c=><Card key={c.t}><h3 className="font-bold text-navy">{c.t}</h3><p className="mt-1 text-sm text-slate-700">{c.d}</p></Card>)}</div>}
 <FormCta page="roles" cls="mt-8"/>
 </Page>;
}
