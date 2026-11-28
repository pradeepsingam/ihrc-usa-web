import {managed} from '../lib/managedContent';
import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft,ChevronRight,Heart,BadgeCheck,HandHeart,ShieldAlert} from 'lucide-react';
import {mvo,programs,texts} from '../data';
import {news,events,pubCategories} from '../content';
import {recognitionText,recognitionMarquee} from '../data/recognition';
import JoinLink from '../components/JoinLink';
import CooperationMarquee from '../components/CooperationMarquee';
import {Wrap,Heading,Btn,Card,IconBadge,ProgramCard,NewsCard,EventCard,Empty} from '../components/UI';
const editableCopy=managed("copy.Home","Home — headings and text","Page text",{
 "text-learn-more": "Learn More →",
 "text-our-mission": "Our Mission",
 "text-international-human-rights-council-usa-human-rights-education-and": "International Human Rights Council – USA: Human Rights Education and Humanitarian Action",
 "text-our-recognition": "Our Recognition",
 "text-about-ihrc-usa": "About IHRC-USA",
 "text-the-international-human-rights-council-usa-ihrc-usa-is-an-organiz": "The International Human Rights Council – USA (IHRC-USA) is an organization focused on human rights awareness, humanitarian values, peace, equality and community development, working through education, advocacy, community engagement and responsible cooperation.",
 "text-about-us": "About Us →",
 "text-welcome-message": "Welcome Message",
 "text-read-the-chairman-s-message": "Read the Chairman’s Message",
 "text-human-rights-priorities": "Human Rights Priorities",
 "text-featured-programs": "Featured Programs",
 "text-latest-news-events": "Latest News & Events",
 "text-no-news-or-events-have-been-published-yet-please-check-back-soon": "No news or events have been published yet. Please check back soon.",
 "text-publications-resources": "Publications & Resources",
 "text-become-a-member": "Become a Member",
 "text-join-people-who-share-a-commitment-to-human-dignity": "Join people who share a commitment to human dignity.",
 "text-apply-now": "Apply Now",
 "text-volunteer": "Volunteer",
 "text-give-your-time-and-skills-to-protect-human-rights": "Give your time and skills to protect human rights.",
 "text-join-as-volunteer": "Join as Volunteer",
 "text-join-our-community": "Join Our Community",
 "text-take-part-in-human-rights-education-and-community-initiatives": "Take part in human rights education and community initiatives.",
 "text-report-a-human-rights-concern": "Report a Human Rights Concern",
 "text-share-a-concern-with-ihrc-usa-using-our-confidential-form": "Share a concern with IHRC-USA using our confidential form.",
 "text-report-a-concern": "Report a Concern"
});


const slides=managed("Home.slides","Homepage slideshow",'Website content',[
{k:'IHRC-USA',h:'Equal Justice',h2:'for Everyone & Everywhere.',bg:'/images/hero-building.jpg',p:'Promoting Human Dignity , Advancing Justice , Building Peace , Serving Humanity , Defending Human Rights',to:'/who-we-are',g:'from-sky-50 to-sky-100'},
{k:'Get Involved',h:'Join Our Community.',h2:'Become a Member.',bg:'/images/hero-students.jpg',p:'Stand with advocates and volunteers across the island.',to:'/apply',g:'from-sky-50 to-sky-100'},
{k:'Programs',h:'Education for Rights.',h2:'Hope for Generations.',bg:'/images/hero 1.png',p:'Workshops, clinics and youth forums in every province.',to:'/programs',g:'from-sky-50 to-sky-100'},
{k:'Our Motto',h:'Always, Everywhere,',h2:'Service Above Self.',bg:'/images/motto.jpg',p:'dignity, equality, freedom, peace, security and well-being for all.',to:'/vision-mission',g:'from-sky-50 to-sky-100'}]);

const priorities=managed("Home.priorities","Homepage priorities",'Website content',[['Human Rights','Promoting awareness of fundamental human rights and dignity.'],['Justice','Encouraging equality, fairness, accountability and access to justice.'],['Peace','Supporting dialogue, tolerance and peaceful coexistence.'],['Humanitarian Service','Supporting vulnerable communities through responsible humanitarian initiatives.'],['Education','Promoting knowledge, awareness and opportunities for learning.'],['Empowerment','Encouraging women, children, youth and communities to participate in positive change.']]);

function Slider(){const[i,setI]=useState(0);const n=slides.length;
useEffect(()=>{if(n<2)return;const t=setInterval(()=>setI(x=>(x+1)%n),6000);return()=>clearInterval(t)},[n]);const s=slides[i]||slides[0];if(!s)return null;
return <section className={'relative overflow-hidden bg-gradient-to-br '+s.g} aria-roledescription="carousel">
{s.bg&&<div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[64%] md:block"><img src={s.bg} alt="" className="h-full w-full object-cover object-center"/><div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-sky-50 via-sky-50/90 to-transparent"/></div>}
<div className="relative grid min-h-[380px] items-center gap-6 px-12 py-10 sm:px-16 md:min-h-[360px] md:grid-cols-2 lg:px-12">
<div className="md:max-w-[46vw]"><p className="inline-block rounded-full bg-navy px-3 py-1 text-xs font-bold uppercase tracking-widest text-white sm:text-sm">{s.k}</p><h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-[38px] xl:text-[44px]">{s.h}<span className="block text-brand">{s.h2}</span></h2>
{s.p&&(s.p.includes(' • ')?<div className="mt-4 flex max-w-xl flex-wrap gap-2">{s.p.split(' • ').map(t=><span key={t} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy shadow-sm ring-1 ring-navy/15 sm:text-sm">{t}</span>)}</div>:<p className="mt-3 max-w-lg text-base font-medium text-slate-800 sm:text-lg">{s.p}</p>)}{s.more&&s.more.map(t=>t.includes(' • ')?<div key={t} className="mt-3 flex max-w-xl flex-wrap gap-2">{t.split(' • ').map(x=><span key={x} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy shadow-sm ring-1 ring-navy/15 sm:text-sm">{x}</span>)}</div>:<p key={t} className="mt-3 max-w-lg border-l-4 border-gold pl-3 text-sm italic text-slate-700">{t}</p>)}<div className="mt-6 flex flex-col gap-3 sm:flex-row"><Btn to={s.to}>{editableCopy["text-learn-more"]}</Btn><Btn to="/vision-mission" alt cls="bg-white/70">{editableCopy["text-our-mission"]}</Btn></div></div>
{s.bg?<img src={s.bg} alt="" className="mx-auto w-full max-w-md rounded-xl md:hidden"/>:null}</div>
{[[-1,ChevronLeft,'left-2','Previous slide'],[1,ChevronRight,'right-2','Next slide']].map(([d,I,p,l])=><button key={l} aria-label={l} onClick={()=>setI((i+d+n)%n)} className={'absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-navy hover:bg-white '+p}><I/></button>)}
<div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">{slides.map((_,x)=><button key={x} aria-label={'Slide '+(x+1)} onClick={()=>setI(x)} className={'h-3 w-3 rounded-full '+(x===i?'bg-brand':'bg-white')}/>)}</div></section>}

const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);

export default function Home(){
const welcome=texts['chairman-message'].b[0][1].split('\n\n').slice(0,2).join('\n\n');
const up=events.filter(e=>e.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
const latest=[...news].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
return <>
<h1 className="sr-only">{editableCopy["text-international-human-rights-council-usa-human-rights-education-and"]}</h1>
<Slider/>
<Wrap cls="grid gap-4 md:grid-cols-3">{mvo.map(m=><Card key={m.t} cls="flex items-center gap-4"><IconBadge i={m.i}/><div><h3 className="font-bold text-navy">{m.t}</h3><p className="text-sm text-slate-600">{m.d}</p><Link to={m.to} className="mt-2 inline-block text-sm font-semibold text-brand">Read More →</Link></div></Card>)}</Wrap>
<Wrap><Heading to="/recognition">{editableCopy["text-our-recognition"]}</Heading><Card><p className="text-slate-700">{recognitionText}</p><div className="marquee mt-5 overflow-hidden" aria-label="UN and EU registrations"><ul className="marquee-track">{[...recognitionMarquee,...recognitionMarquee].map((l,k)=><li key={k} aria-hidden={k>=recognitionMarquee.length?'true':undefined} className="mr-4 flex h-28 w-52 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><img src={l.src} alt={k>=recognitionMarquee.length?'':l.alt} loading="lazy" className="max-h-full max-w-full object-contain"/></li>)}</ul></div><div className="mt-4"><Btn to="/recognition">Read More →</Btn></div></Card></Wrap>
<Wrap><div><Heading>{editableCopy["text-about-ihrc-usa"]}</Heading><p className="text-slate-700">{editableCopy["text-the-international-human-rights-council-usa-ihrc-usa-is-an-organiz"]}</p><div className="mt-4"><Btn to="/who-we-are">{editableCopy["text-about-us"]}</Btn></div></div></Wrap>
<Wrap><Heading to="/chairman-message">{editableCopy["text-welcome-message"]}</Heading><Card><p className="whitespace-pre-line text-slate-700">{welcome}</p><div className="mt-4"><Btn to="/chairman-message" alt>{editableCopy["text-read-the-chairman-s-message"]}</Btn></div></Card></Wrap>
<Wrap><Heading to="/who-we-are">{editableCopy["text-human-rights-priorities"]}</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{priorities.map(([t,d])=><Card key={t}><h3 className="font-bold text-navy">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></Card>)}</div></Wrap>
<Wrap><Heading to="/programs">{editableCopy["text-featured-programs"]}</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{programs.slice(0,3).map(p=><ProgramCard key={p.t} p={p}/>)}</div></Wrap>
<Wrap><Heading to="/news">{editableCopy["text-latest-news-events"]}</Heading>{up.length+latest.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{up.map(e=><EventCard key={e.id} e={e}/>)}{latest.map(n=><NewsCard key={n.id} n={n}/>)}</div>:<Empty>{editableCopy["text-no-news-or-events-have-been-published-yet-please-check-back-soon"]}</Empty>}</Wrap>
<Wrap><Heading to="/publications">{editableCopy["text-publications-resources"]}</Heading><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pubCategories.slice(0,6).map(c=><Link key={c} to="/publications"><Card cls="font-semibold text-navy">{c}</Card></Link>)}</div></Wrap>
<CooperationMarquee/>
<Wrap cls="grid gap-4 md:grid-cols-3"><div className="rounded-xl bg-navy p-6 text-white"><BadgeCheck size={32}/><h3 className="mt-2 font-serif text-xl font-bold">{editableCopy["text-become-a-member"]}</h3><p className="mb-4 text-blue-100">{editableCopy["text-join-people-who-share-a-commitment-to-human-dignity"]}</p><Btn to="/membership" cls="!bg-white !text-navy">{editableCopy["text-apply-now"]}</Btn></div>
<div className="rounded-xl bg-brand p-6 text-white"><HandHeart size={32}/><h3 className="mt-2 font-serif text-xl font-bold">{editableCopy["text-volunteer"]}</h3><p className="mb-4 text-blue-100">{editableCopy["text-give-your-time-and-skills-to-protect-human-rights"]}</p><Btn to="/volunteer" cls="!bg-white !text-navy">{editableCopy["text-join-as-volunteer"]}</Btn></div>
<div className="rounded-xl bg-gold p-6 text-navy"><Heart size={32}/><h3 className="mt-2 font-serif text-xl font-bold">{editableCopy["text-join-our-community"]}</h3><p className="mb-4">{editableCopy["text-take-part-in-human-rights-education-and-community-initiatives"]}</p><JoinLink className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-navy">Join</JoinLink></div></Wrap>
<Wrap><div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-blue-50 p-6 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><ShieldAlert size={32} className="shrink-0 text-navy"/><div><h3 className="font-serif text-xl font-bold text-navy">{editableCopy["text-report-a-human-rights-concern"]}</h3><p className="text-sm text-slate-600">{editableCopy["text-share-a-concern-with-ihrc-usa-using-our-confidential-form"]}</p></div></div><Btn to="/report-concern">{editableCopy["text-report-a-concern"]}</Btn></div></Wrap></>}
