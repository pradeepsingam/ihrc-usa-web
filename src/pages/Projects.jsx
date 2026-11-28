import {managed} from '../lib/managedContent';
import NotFound from './NotFound';
import {useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {Calendar,MapPin,Download,Search as SearchIcon} from 'lucide-react';
import {projects} from '../content';
import {programs} from '../data';
import {Page,Card,Tabs,Btn,Img,Empty,Gallery,fmt,Heading,RichText} from '../components/UI';
const editableCopy=managed("copy.Projects","Projects — headings and text","Page text",{
 "page-title-projects": "Projects",
 "page-introduction-ihrc-usa-projects-and-project-articles": "IHRC-USA projects and project articles.",
 "text-program": "Program:",
 "text-download-document": "Download document",
 "text-gallery": "Gallery",
 "text-more-projects": "More Projects",
 "text-all-projects": "← All projects"
});


const ProjectCard=({p})=><Link to={'/projects/'+p.id}><Card cls="flex h-full flex-col">
  {p.image&&<Img src={p.image} alt={p.title} cls="mb-3 w-full rounded-lg"/>}
  {p.status&&<span className="w-fit rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">{p.status}</span>}
  <h3 className="mt-2 font-bold text-navy">{p.title}</h3>
  <p className="mt-1 flex-1 text-sm text-slate-600">{p.summary}</p>
  {p.date&&<p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Calendar size={14}/>{fmt(p.date)}</p>}
  {p.location&&<p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={14}/>{p.location}</p>}
</Card></Link>;

export const Projects=()=>{
  const[s,setS]=useState('All');const[q,setQ]=useState('');
  const statuses=['All',...new Set(projects.map(p=>p.status).filter(Boolean))];
  const list=[...projects].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).filter(p=>(s==='All'||p.status===s)&&((p.title||'')+(p.summary||'')).toLowerCase().includes(q.toLowerCase()));
  return <Page title={editableCopy["page-title-projects"]} sub={editableCopy["page-introduction-ihrc-usa-projects-and-project-articles"]}>
    {statuses.length>1&&<Tabs items={statuses} value={s} onChange={setS}/>}
    <div className="relative mb-6 sm:max-w-sm"><SearchIcon size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects…" aria-label="Search projects" className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 outline-none focus:border-brand"/></div>
    {list.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(p=><ProjectCard key={p.id} p={p}/>)}</div>:<Empty>{projects.length?'No projects match your search.':'No projects have been published yet. Please check back soon.'}</Empty>}
  </Page>;
};

export const ProjectDetail=()=>{
  const{id}=useParams();const p=projects.find(x=>String(x.id)===id);
  if(!p)return <NotFound/>;
  const prog=p.program&&programs.find(x=>x.slug===p.program);
  const rel=projects.filter(x=>x.id!==id).slice(0,3);
  return <Page title={p.title} sub={[p.status,p.date&&fmt(p.date),p.location].filter(Boolean).join(' · ')}>
    {p.image&&<Img src={p.image} alt={p.title} cls="mb-6 max-h-96 w-full rounded-xl"/>}
    <Card><RichText text={p.body||p.summary} cls="space-y-3"/>
      {(prog||p.file)&&<div className="mt-5 flex flex-wrap gap-3">
        {prog&&<Btn to={'/programs/'+prog.slug} alt>{editableCopy["text-program"]+" "}{prog.t}</Btn>}
        {p.file&&<a href={p.file} download className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-semibold text-white hover:bg-brand"><Download size={14}/>{editableCopy["text-download-document"]}</a>}
      </div>}
    </Card>
    {p.images&&p.images.length>0&&<section className="mt-10"><Heading>{editableCopy["text-gallery"]}</Heading><Gallery images={p.images} alt={p.title}/></section>}
    {rel.length>0&&<section className="mt-10"><Heading>{editableCopy["text-more-projects"]}</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rel.map(x=><ProjectCard key={x.id} p={x}/>)}</div></section>}
    <div className="mt-6"><Btn to="/projects" alt>{editableCopy["text-all-projects"]}</Btn></div>
  </Page>;
};
