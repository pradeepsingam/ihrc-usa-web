import {managed} from '../lib/managedContent';
import NotFound from './NotFound';
import {useState,useMemo,useEffect} from 'react';
import {Link,useParams,useSearchParams} from 'react-router-dom';
import {Download,ExternalLink,Phone,Search as SearchIcon,FileText,ShieldAlert} from 'lucide-react';
import {nav,texts,programs} from '../data';
import {news,events,projects,publications,partners,branches,awardCategories,pubCategories,programDetails,siteInfo} from '../content';
import {Page,Card,Tabs,Accordion,Btn,Img,Form,Empty,Pending,Gallery,fmt,NewsCard,EventCard,Heading,RichText} from '../components/UI';
import {UpdatesList,allUpdates} from '../components/UpdatesList';
import ComplaintForm,{complaintInfo} from '../components/ComplaintForm';
const editableCopy=managed("copy.PublicPages","Public Pages — headings and text","Page text",{
 "page-title-human-rights": "Human Rights",
 "page-introduction-learn-about-the-rights-that-belong-to-every-person": "Learn about the rights that belong to every person.",
 "text-handbooks-awareness-materials-and-training-resources-are-publishe": "Handbooks, awareness materials and training resources are published in our resource library.",
 "text-open-publications": "Open Publications",
 "text-external-resources": "External resources",
 "text-report-a-human-rights-concern": "Report a Human Rights Concern",
 "page-title-global-network": "Global Network",
 "page-introduction-officially-authorised-ihrc-branches": "Officially authorised IHRC branches.",
 "text-representative": "Representative",
 "text-designation": "Designation",
 "text-email": "Email",
 "text-phone": "Phone",
 "text-office-location": "Office location",
 "text-programs": "Programs",
 "text-no-branches-match-your-search": "No branches match your search.",
 "text-only-officially-authorised-branches-and-representatives-are-liste": "Only officially authorised branches and representatives are listed in this directory.",
 "page-title-events": "Events",
 "page-introduction-upcoming-and-past-ihrc-events": "Upcoming and past IHRC events.",
 "text-location": "Location",
 "text-this-event-has-ended": "This event has ended.",
 "text-all-events": "← All events",
 "page-title-news": "News",
 "page-introduction-ihrc-announcements-and-organisational-updates": "IHRC announcements and organisational updates.",
 "text-close": "Close",
 "page-title-publications-resources": "Publications & Resources",
 "page-introduction-handbooks-reports-and-educational-materials": "Handbooks, reports and educational materials.",
 "text-download": "Download",
 "page-title-awards-recognition": "Awards & Recognition",
 "page-introduction-recognising-outstanding-service-to-human-rights": "Recognising outstanding service to human rights.",
 "text-about-the-awards": "About the Awards",
 "text-information-about-ihrc-usa-awards-and-recognition": "Information about IHRC-USA awards and recognition:",
 "text-award-categories-will-be-announced-here": "Award categories will be announced here.",
 "page-title-partnerships": "Partnerships",
 "page-introduction-working-together-for-human-dignity": "Working together for human dignity.",
 "text-ihrc-usa-works-together-with-the-state-human-rights-defenders-wom": "IHRC-USA works together with the state, human rights defenders, women, children, indigenous peoples, internally displaced persons, refugees and community members, and through civil society organizations (CSOs), to protect and fulfil the fundamental rights of all.",
 "text-visit-website": "Visit website",
 "text-verified-partners-will-be-listed-here": "Verified partners will be listed here.",
 "text-civil-society-organizations-csos-can-apply-for-cso-status-with-th": "Civil society organizations (CSOs) can apply for CSO status with the Department of Social Affairs and Partnerships (DSAP) of the International Human Rights Council-USA. Complete the questionnaire online; it is sent to",
 "text-apply-online": "Apply Online",
 "page-title-report-a-human-rights-concern": "Report a Human Rights Concern",
 "page-introduction-submit-a-complaint-or-report-a-human-rights-concern": "Submit a complaint or report a human rights concern.",
 "text-official-complaint-submission": "Official Complaint Submission",
 "text-important-notice": "Important Notice",
 "text-who-can-submit-a-complaint": "Who can submit a complaint?",
 "text-types-of-complaints-accepted": "Types of complaints accepted",
 "text-complaint-submission-form": "Complaint Submission Form",
 "text-complaints-against-an-individual-organization-institution-company": "Complaints Against an Individual, Organization, Institution, Company, or Other Entity. Please complete the relevant sections as accurately as possible.",
 "text-activities": "Activities",
 "text-no-news-events-or-projects-for-this-program-yet": "No news, events or projects for this program yet.",
 "text-all-programs": "All programs",
 "page-title-search": "Search"
});


const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const box='w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand sm:max-w-sm';
const SearchField=({value,onChange,label='Search'})=><div className="relative mb-6 sm:max-w-sm"><SearchIcon size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-400"/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={label+'…'} aria-label={label} className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 outline-none focus:border-brand"/></div>;
const Section=({title,children})=><section className="mt-10"><Heading>{title}</Heading>{children}</section>;

const hr=managed("PublicPages.hr","Human rights articles",'Website content',[
['What Are Human Rights?','Human rights are the basic rights and freedoms that belong to every person simply because they are human. They do not depend on nationality, sex, ethnic origin, colour, religion, language or any other status.\n\nThe Universal Declaration of Human Rights, adopted by the United Nations General Assembly on 10 December 1948, sets out for the first time the fundamental rights to be universally protected. They include civil and political rights, such as life, liberty and freedom of expression, and economic, social and cultural rights, such as education, health and an adequate standard of living.'],
['Why Human Rights Matter','Human rights protect human dignity and set limits on how those in power may treat people. They are the foundation of freedom, justice and peace, and they allow every person to take part in the life of their community on an equal footing.\n\nWhen rights are respected, people can live safely, learn, work, speak freely and seek justice. When they are denied, discrimination, poverty and conflict are more likely to grow.'],
['Universal Human Rights Principles','• Universality – human rights belong to everyone, everywhere.\n• Inalienability – rights cannot be taken away, except in specific situations and according to due process.\n• Indivisibility and interdependence – civil, political, economic, social and cultural rights are equally important and linked to one another.\n• Equality and non-discrimination – every person is entitled to rights without distinction of any kind.\n• Participation and inclusion – everyone has the right to take part in decisions that affect them.\n• Accountability and the rule of law – those responsible for protecting rights must answer for their actions.'],
['Equality and Non-Discrimination','All human beings are born free and equal in dignity and rights. Discrimination means treating people unfairly because of characteristics such as race, colour, sex, language, religion, political or other opinion, national or social origin, property, birth or other status.\n\nEquality before the law and protection against discrimination apply to everyone. States are expected to take active steps to remove barriers that keep people from enjoying their rights.'],
['Children’s Rights','The Convention on the Rights of the Child (1989) recognises that children have their own rights, including the right to life and development, to education, to health care, to protection from violence, abuse and exploitation, and to be heard in matters that affect them.\n\nIn every decision concerning children, their best interests must be a primary consideration.'],
['Women’s Rights','Women and girls are entitled to the same human rights as everyone else. The Convention on the Elimination of All Forms of Discrimination against Women (1979) calls for equality in education, work, health, family life and public participation, and for protection from violence and discrimination.'],
['Disability Rights','The Convention on the Rights of Persons with Disabilities (2006) affirms that persons with disabilities have the same rights as everyone else. It stresses dignity, independence, accessibility, reasonable accommodation and full inclusion in society, and the principle that decisions should involve the people they affect.'],
['Refugees and Displaced Persons','Everyone has the right to seek asylum from persecution. The 1951 Refugee Convention protects refugees, including through the principle of non-refoulement: people must not be returned to a place where their life or freedom would be at risk.\n\nPeople displaced within their own country keep all of their rights. The UN Guiding Principles on Internal Displacement describe the protection and assistance they are entitled to receive.'],
['Access to Justice','Access to justice means that people can seek and obtain a fair remedy when their rights are violated. It includes equality before the law, the right to a fair and public hearing by an independent and impartial court, the presumption of innocence, and access to legal information and assistance.'],
['Human Rights Education','People can only claim their rights if they know them. Human rights education builds knowledge, skills and attitudes that promote respect for rights and equality. It is a continuing process for children, young people and adults, in schools, communities and workplaces, and it is recognised in the UN Declaration on Human Rights Education and Training (2011).']]);
const hrLinks=managed("PublicPages.hrLinks","Human rights resource links",'Website content',[['Universal Declaration of Human Rights (United Nations)','https://www.un.org/en/about-us/universal-declaration-of-human-rights'],['Office of the UN High Commissioner for Human Rights (OHCHR)','https://www.ohchr.org'],['Human rights education resources (OHCHR)','https://www.ohchr.org/en/education-and-training'],['United Nations (UN)','https://www.un.org/en/'],['European Court of Human Rights (ECHR)','https://www.echr.coe.int/'],['European Commission','https://commission.europa.eu/index_en']]);

export const HumanRights=()=><Page title={editableCopy["page-title-human-rights"]} sub={editableCopy["page-introduction-learn-about-the-rights-that-belong-to-every-person"]}><Accordion items={hr}/>
<Section title="Awareness Materials and Educational Resources"><div className="grid gap-4 md:grid-cols-2"><Card><h3 className="font-bold text-navy">From IHRC-USA</h3><p className="mt-1 text-sm text-slate-600">{editableCopy["text-handbooks-awareness-materials-and-training-resources-are-publishe"]}</p><div className="mt-3"><Btn to="/publications">{editableCopy["text-open-publications"]}</Btn></div></Card>
<Card><h3 className="font-bold text-navy">{editableCopy["text-external-resources"]}</h3><ul className="mt-2 space-y-2 text-sm">{hrLinks.map(([l,u])=><li key={u}><a href={u} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 text-brand hover:underline"><ExternalLink size={14} className="mt-1 shrink-0"/>{l}</a></li>)}</ul></Card></div></Section>
<div className="mt-8"><Btn to="/report-concern">{editableCopy["text-report-a-human-rights-concern"]}</Btn></div></Page>;

export const GlobalNetwork=()=>{const[q,setQ]=useState('');const list=branches.filter(b=>(b.country+b.name).toLowerCase().includes(q.toLowerCase()));
return <Page title={editableCopy["page-title-global-network"]} sub={editableCopy["page-introduction-officially-authorised-ihrc-branches"]}><SearchField value={q} onChange={setQ} label="Search by country or branch"/>
{list.length?<div className="grid gap-4 md:grid-cols-2">{list.map(b=><Card key={b.id}><p className="text-xs font-semibold uppercase tracking-wide text-brand">{b.country}</p><h2 className="font-serif text-xl font-bold text-navy">{b.name}</h2>
<dl className="mt-3 grid grid-cols-[8rem_1fr] gap-x-3 gap-y-2 text-sm"><dt className="text-slate-500">{editableCopy["text-representative"]}</dt><dd>{b.representative||<Pending/>}</dd><dt className="text-slate-500">{editableCopy["text-designation"]}</dt><dd>{b.designation||<Pending/>}</dd><dt className="text-slate-500">{editableCopy["text-email"]}</dt><dd>{b.email?<a className="text-brand hover:underline" href={'mailto:'+b.email}>{b.email}</a>:<Pending/>}</dd><dt className="text-slate-500">{editableCopy["text-phone"]}</dt><dd>{b.phone||<Pending/>}</dd><dt className="text-slate-500">{editableCopy["text-office-location"]}</dt><dd>{b.location||<Pending/>}</dd><dt className="text-slate-500">{editableCopy["text-programs"]}</dt><dd>{b.activities||<Pending/>}</dd></dl></Card>)}</div>:<Empty>{editableCopy["text-no-branches-match-your-search"]}</Empty>}
<p className="mt-6 text-sm text-slate-500">{editableCopy["text-only-officially-authorised-branches-and-representatives-are-liste"]}</p></Page>};

const Reg=({ev})=><Form button="Register" subject={'Event Registration'+(ev?': '+ev.title:'')} init={ev?{event:ev.title}:{}} fields={[{n:'event',label:'Event',req:1,...(ev?{}:{opts:events.filter(e=>e.date>=today()&&e.registration!==false).map(e=>e.title)})},{n:'name',label:'Full name',req:1},{n:'email',label:'Email',type:'email',req:1},{n:'phone',label:'Phone',type:'tel',req:1},{n:'org',label:'Organization (optional)'},{n:'guests',label:'Number of attendees',req:1}]}/>;
export const Events=()=>{const[t,setT]=useState('Upcoming');const[q,setQ]=useState('');const d=today();
const list=events.filter(e=>(t==='Upcoming'?e.date>=d:e.date<d)&&(e.title+e.description+(e.location||'')).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>t==='Upcoming'?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
return <Page title={editableCopy["page-title-events"]} sub={editableCopy["page-introduction-upcoming-and-past-ihrc-events"]}><Tabs items={['Upcoming','Past']} value={t} onChange={setT}/><SearchField value={q} onChange={setQ} label="Search events"/>
{list.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(e=><EventCard key={e.id} e={e}/>)}</div>:<Empty>{t==='Upcoming'?'No upcoming events have been announced yet. Please check back soon.':'No past events to show.'}</Empty>}
{events.some(e=>e.date>=d&&e.registration!==false)&&<Section title="Event Registration"><Card><Reg/></Card></Section>}</Page>};
export const EventDetail=()=>{const{id}=useParams();const e=events.find(x=>String(x.id)===id);if(!e)return <NotFound/>;const up=e.date>=today();
return <Page title={e.title} sub={fmt(e.date)+(e.endDate?' – '+fmt(e.endDate):'')+(e.location?' · '+e.location:'')}>{e.image&&<Img src={e.image} alt={e.title} cls="mb-6 max-h-96 w-full rounded-xl"/>}<Card><RichText text={e.body||e.description}/><dl className="mt-4 grid grid-cols-[6rem_1fr] gap-2 text-sm"><dt className="text-slate-500">Date</dt><dd>{fmt(e.date)}</dd><dt className="text-slate-500">{editableCopy["text-location"]}</dt><dd>{e.location||<Pending/>}</dd></dl></Card>
{e.images&&<Section title="Gallery"><Gallery images={e.images} alt={e.title}/></Section>}
{(!up||e.registration!==false)&&<Section title="Event Registration">{up?<Card><Reg ev={e}/></Card>:<Empty>{editableCopy["text-this-event-has-ended"]}</Empty>}</Section>}<div className="mt-6"><Btn to="/events" alt>{editableCopy["text-all-events"]}</Btn></div></Page>};

export const NewsList=()=>{const[sp]=useSearchParams();const[k,setK]=useState('All');const[q,setQ]=useState(sp.get('q')||'');const types=['All',...new Set(news.map(n=>n.type))];
const list=[...news].sort((a,b)=>b.date.localeCompare(a.date)).filter(n=>(k==='All'||n.type===k)&&(n.title+n.summary).toLowerCase().includes(q.toLowerCase()));
return <Page title={editableCopy["page-title-news"]} sub={editableCopy["page-introduction-ihrc-announcements-and-organisational-updates"]}><Tabs items={types} value={k} onChange={setK}/><SearchField value={q} onChange={setQ} label="Search news"/>
{list.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(n=><NewsCard key={n.id} n={n}/>)}</div>:<Empty>{news.length?'No news matches your search.':'No news has been published yet. Please check back soon.'}</Empty>}</Page>};
export const NewsDetail=()=>{const{id}=useParams();const n=news.find(x=>String(x.id)===id);if(!n)return <NotFound/>;const rel=news.filter(x=>x.id!==id).slice(0,3);
return <Page title={n.title} sub={n.type+' · '+fmt(n.date)}>{n.image&&<Img src={n.image} alt={n.title} cls="mb-6 max-h-96 w-full rounded-xl"/>}<Card><RichText text={n.body||n.summary} cls="space-y-3"/></Card>
{rel.length>0&&<Section title="Related News"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rel.map(x=><NewsCard key={x.id} n={x}/>)}</div></Section>}<div className="mt-6"><Btn to="/news" alt>← All news</Btn></div></Page>};

// Read-only viewer for publications whose download is switched off in the admin (the browser's PDF toolbar is hidden).
const DocViewer=({doc,onClose})=>{useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose]);
return <div role="dialog" aria-modal="true" aria-label={doc.title} className="fixed inset-0 z-[60] flex flex-col bg-black/80 p-2 sm:p-6" onContextMenu={e=>e.preventDefault()}>
<div className="mb-2 flex items-center justify-between gap-3 text-white"><h2 className="truncate font-semibold">{doc.title}</h2><button onClick={onClose} className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-navy">{editableCopy["text-close"]}</button></div>
{/\.(png|jpe?g|gif|webp)$/i.test(doc.file)?<img src={doc.file} alt={doc.title} className="mx-auto max-h-full max-w-full object-contain"/>
:<iframe title={doc.title} src={doc.file+'#toolbar=0&navpanes=0'} className="h-full w-full flex-1 rounded bg-white"/>}</div>};
export const Publications=()=>{const[c,setC]=useState('All');const[q,setQ]=useState('');const[view,setView]=useState(null);const list=publications.filter(p=>(c==='All'||p.category===c)&&(p.title+(p.description||'')).toLowerCase().includes(q.toLowerCase()));
return <Page title={editableCopy["page-title-publications-resources"]} sub={editableCopy["page-introduction-handbooks-reports-and-educational-materials"]}><div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pubCategories.map(k=><button key={k} onClick={()=>setC(c===k?'All':k)} aria-pressed={c===k} className={'flex items-center justify-between rounded-xl p-4 text-left shadow-sm ring-1 transition '+(c===k?'bg-navy text-white ring-navy':'bg-white text-navy ring-slate-100 hover:shadow-md')}><span className="font-semibold">{k}</span><span className="text-xs opacity-70">{publications.filter(p=>p.category===k).length}</span></button>)}</div>
<SearchField value={q} onChange={setQ} label="Search documents"/>
{list.length?<ul className="space-y-3">{list.map(p=><li key={p.id}><Card cls="flex flex-col gap-3 sm:flex-row sm:items-center">{p.cover?<img src={p.cover} alt="" loading="lazy" className="h-24 w-20 shrink-0 rounded object-cover ring-1 ring-slate-200"/>:<FileText className="shrink-0 text-brand" size={28}/>}<div className="flex-1"><h3 className="font-bold text-navy">{p.title}</h3><p className="text-xs text-slate-500">{p.category}{p.year&&' · '+p.year}</p>{p.description&&<p className="mt-1 text-sm text-slate-600">{p.description}</p>}</div><div className="flex gap-2">{p.download===false?<button type="button" onClick={()=>setView(p)} className="inline-flex min-h-[40px] items-center gap-1 rounded-full border-2 border-navy px-4 text-sm font-semibold text-navy hover:bg-navy hover:text-white"><ExternalLink size={14}/>Read</button>:<><a href={p.file} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1 rounded-full border-2 border-navy px-4 text-sm font-semibold text-navy hover:bg-navy hover:text-white"><ExternalLink size={14}/>View</a><a href={p.file} download className="inline-flex min-h-[40px] items-center gap-1 rounded-full bg-navy px-4 text-sm font-semibold text-white hover:bg-brand"><Download size={14}/>{editableCopy["text-download"]}</a></>}</div></Card></li>)}</ul>:<Empty>{publications.length?'No documents match your selection.':'Documents will be published here once they are available.'}</Empty>}{view&&<DocViewer doc={view} onClose={()=>setView(null)}/>}</Page>};

export const Awards=()=><Page title={editableCopy["page-title-awards-recognition"]} sub={editableCopy["page-introduction-recognising-outstanding-service-to-human-rights"]}>
<Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-about-the-awards"]}</h2><p className="mt-2 text-slate-700">{editableCopy["text-information-about-ihrc-usa-awards-and-recognition"]+" "}<Pending/></p></Card>
<Section title="Award Categories">{awardCategories.length?<div className="grid gap-4 sm:grid-cols-2">{awardCategories.map(a=><Card key={a.name}>{a.image&&<img src={a.image} alt={a.name} loading="lazy" className="mb-3 h-40 w-full rounded-lg object-cover"/>}<h3 className="font-bold text-navy">{a.name}</h3><p className="text-sm text-slate-600">{a.description}</p></Card>)}</div>:<Empty>{editableCopy["text-award-categories-will-be-announced-here"]}</Empty>}</Section>
<Section title="Award Nomination Form"><Card><Form button="Submit Nomination" subject="Award Nomination" fields={[{n:'nominee',label:'Nominee name',req:1},{n:'country',label:'Country',req:1},{n:'org',label:'Organization'},awardCategories.length?{n:'cat',label:'Award category',req:1,opts:awardCategories.map(a=>a.name)}:{n:'cat',label:'Award category',req:1},{n:'ach',label:'Achievements',type:'textarea',req:1},{n:'docs',label:'Supporting documents',type:'textarea',hint:'Add links to documents, or list them and attach the files in the email that opens.'},{n:'by',label:'Nominator name',req:1},{n:'byemail',label:'Nominator email',type:'email',req:1},{n:'byphone',label:'Nominator phone',type:'tel'}]}/></Card></Section></Page>;

const pc=managed("PublicPages.pc","Partner categories",'Website content',['Government and state institutions','Civil society organizations (CSOs)','Human rights defenders','Community organizations']);
export const Partnerships=()=><Page title={editableCopy["page-title-partnerships"]} sub={editableCopy["page-introduction-working-together-for-human-dignity"]}>
<Card><p className="text-slate-700">{editableCopy["text-ihrc-usa-works-together-with-the-state-human-rights-defenders-wom"]}</p></Card>
<Section title="Partner Categories"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{pc.map(x=><Card key={x}><h3 className="font-semibold text-navy">{x}</h3></Card>)}</div></Section>
<Section title="Our Partners">{partners.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{partners.map(p=><Card key={p.name}>{p.logo&&<img src={p.logo} alt={p.name} className="mb-3 h-16 object-contain"/>}<h3 className="font-bold text-navy">{p.name}</h3><p className="text-xs text-brand">{p.category}</p><p className="mt-1 text-sm text-slate-600">{p.description}</p>{p.website&&<a href={p.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-brand hover:underline">{editableCopy["text-visit-website"]}</a>}</Card>)}</div>:<Empty>{editableCopy["text-verified-partners-will-be-listed-here"]}</Empty>}</Section>
<Section title="CSO Partnership (CSO Status)"><Card cls="bg-blue-50"><p className="text-slate-700">{editableCopy["text-civil-society-organizations-csos-can-apply-for-cso-status-with-th"]+" "}<a className="text-brand hover:underline" href="mailto:info@ihrc-usa.org">info@ihrc-usa.org</a>.</p><div className="mt-4 flex flex-wrap gap-3"><Btn to="/partnership-application">{editableCopy["text-apply-online"]}</Btn></div></Card></Section>
</Page>;

const Bul=({items})=><ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-700">{items.map(i=><li key={i}>{i}</li>)}</ul>;
export const ReportConcern=()=><Page title={editableCopy["page-title-report-a-human-rights-concern"]} sub={editableCopy["page-introduction-submit-a-complaint-or-report-a-human-rights-concern"]}>
<div className="space-y-6">
<Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-official-complaint-submission"]}</h2>{complaintInfo.intro.map(t=><p key={t} className="mt-2 text-slate-700">{t}</p>)}</Card>
<Card cls="!bg-amber-50 ring-amber-200"><h2 className="flex items-center gap-2 font-bold text-navy"><ShieldAlert size={20}/>{editableCopy["text-important-notice"]}</h2><Bul items={complaintInfo.notice}/></Card>
<div className="grid gap-4 md:grid-cols-2 md:items-start">
<details className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><summary className="cursor-pointer font-semibold text-navy">{editableCopy["text-who-can-submit-a-complaint"]}</summary><Bul items={complaintInfo.who}/></details>
<details className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><summary className="cursor-pointer font-semibold text-navy">{editableCopy["text-types-of-complaints-accepted"]}</summary><Bul items={complaintInfo.types}/><p className="mt-3 text-sm italic text-slate-600">{complaintInfo.outside}</p></details></div>
<Card cls="!p-5 sm:!p-8"><h2 className="mb-1 font-serif text-xl font-bold text-navy">{editableCopy["text-complaint-submission-form"]}</h2><p className="mb-5 text-sm text-slate-600">{editableCopy["text-complaints-against-an-individual-organization-institution-company"]}</p><ComplaintForm/></Card>
</div></Page>;

export const ProgramDetail=()=>{const{slug}=useParams();const p=programs.find(x=>x.slug===slug);if(!p)return <NotFound/>;const x=programDetails[slug]||{};const rel=allUpdates().filter(u=>u.program===slug);const Icon=p.icon;const pi=programs.indexOf(p),prev=programs[pi-1],next=programs[pi+1];
return <Page title={p.t} sub={`Objective ${p.n} of ${programs.length} · ${p.c}`}><Card>{p.img&&<img src={p.img} alt="" className="mx-auto mb-4 block max-h-64 w-auto max-w-full rounded-lg object-contain"/>}<div className="mb-3 flex items-center gap-3">{Icon&&<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-100 text-brand"><Icon size={24}/></span>}<RichText text={x.description||p.d}/></div>
{(x.location||x.date||(x.activities&&x.activities.length>0))&&<dl className="mt-4 grid grid-cols-[6rem_1fr] gap-2 text-sm">{x.location&&<><dt className="text-slate-500">{editableCopy["text-location"]}</dt><dd>{x.location}</dd></>}{x.date&&<><dt className="text-slate-500">Date</dt><dd>{fmt(x.date)}</dd></>}{x.activities&&x.activities.length>0&&<><dt className="text-slate-500">{editableCopy["text-activities"]}</dt><dd><ul className="list-disc pl-5">{x.activities.map(a=><li key={a}>{a}</li>)}</ul></dd></>}</dl>}</Card>
{x.images&&x.images.length>0&&<Section title="Gallery"><Gallery images={x.images} alt={p.t}/></Section>}
<Section title="News, Events & Projects">{rel.length?<UpdatesList items={rel}/>:<Empty>{editableCopy["text-no-news-events-or-projects-for-this-program-yet"]}</Empty>}</Section><div className="mt-6 flex flex-wrap gap-3">{prev&&<Btn to={'/programs/'+prev.slug} alt>← {prev.n}. {prev.t}</Btn>}<Btn to="/programs" alt>{editableCopy["text-all-programs"]}</Btn>{next&&<Btn to={'/programs/'+next.slug} alt>{next.n}. {next.t} →</Btn>}</div></Page>};

const flat=v=>typeof v==='string'?v:Array.isArray(v)?v.join(' '):v&&v.items?v.intro+' '+v.items.join(' '):'';
export const SearchPage=()=>{const[sp]=useSearchParams();const q=(sp.get('q')||'').trim().toLowerCase();
const index=useMemo(()=>{const r=[];nav.forEach(n=>{if(n.to)r.push({t:n.l,to:n.to,d:''});(n.c||[]).forEach(([l,to])=>r.push({t:l,to,d:''}))});
Object.entries(texts).forEach(([k,t])=>r.push({t:t.title,to:'/'+k,d:t.sub+' '+t.b.map(([h,p])=>h+' '+flat(p)).join(' ')}));
programs.forEach(p=>r.push({t:p.t,to:'/programs/'+p.slug,d:p.d+' '+p.c}));hr.forEach(([h,p])=>r.push({t:h,to:'/human-rights',d:p}));
news.forEach(n=>r.push({t:n.title,to:'/news/'+n.id,d:n.summary}));events.forEach(e=>r.push({t:e.title,to:'/events/'+e.id,d:e.description}));projects.forEach(p=>r.push({t:p.title,to:'/projects/'+p.id,d:p.summary||''}));publications.forEach(p=>r.push({t:p.title,to:'/publications',d:p.description||p.category}));return r},[]);
const words=q.split(/\s+/).filter(Boolean);
const res=words.length?index.filter(i=>words.every(w=>(i.t+' '+i.d).toLowerCase().includes(w))):[];
const seen=new Set();const out=res.filter(r=>{const k=r.to+r.t;if(seen.has(k))return false;seen.add(k);return true}).slice(0,30);
const snip=d=>{if(!d)return'';const i=Math.max(0,d.toLowerCase().indexOf(words[0]));return (i>40?'…':'')+d.slice(Math.max(0,i-40),i+120)+'…'};
return <Page title={editableCopy["page-title-search"]} sub={q?`Results for “${sp.get('q')}”`:'Search the website.'}>{out.length?<ul className="space-y-3">{out.map(r=><li key={r.to+r.t}><Link to={r.to}><Card><h3 className="font-bold text-navy">{r.t}</h3>{r.d&&<p className="mt-1 text-sm text-slate-600">{snip(r.d)}</p>}<p className="mt-1 text-xs text-brand">{r.to}</p></Card></Link></li>)}</ul>:<Empty>{q?'No results found. Try different words.':'Type a word in the search box to find pages.'}</Empty>}</Page>};
