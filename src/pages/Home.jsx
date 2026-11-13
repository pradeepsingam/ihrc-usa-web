import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft,ChevronRight,Heart,BadgeCheck,HandHeart,ShieldAlert} from 'lucide-react';
import {mvo,programs,texts} from '../data';
import {news,events,pubCategories} from '../content';
import DonateLink from '../components/DonateLink';
import CooperationMarquee from '../components/CooperationMarquee';
import {Wrap,Heading,Btn,Card,IconBadge,ProgramCard,NewsCard,EventCard,Empty} from '../components/UI';

const slides=[
{k:'IHRC-USA',h:'Equal Justice',h2:'for Everyone & Everywhere.',bg:'/images/hero-building.jpg',p:'Promoting Human Dignity • Advancing Justice • Building Peace • Serving Humanity • Defending Human Rights',to:'/who-we-are',g:'from-sky-50 to-sky-100'},
{k:'Get Involved',h:'Join Our Community.',h2:'Become a Member.',bg:'/images/hero-students.jpg',p:'Stand with advocates and volunteers across the island.',to:'/apply',g:'from-sky-50 to-sky-100'},
{k:'Programs',h:'Education for Rights.',h2:'Hope for Generations.',bg:'/images/hero 1.png',p:'Workshops, clinics and youth forums in every province.',to:'/programs',g:'from-sky-50 to-sky-100'},
// 4 - the motto slide (same style as the first slide)
{k:'Our Motto',h:'Always, Everywhere,',h2:'Service Above Self.',bg:'/images/hero-building.jpg',p:'Dignity, security and well-being for all.',more:['Promoting Human Dignity • Advancing Justice • Building Peace • Serving Humanity • Defending Human Rights','“IHRC–USA is committed to advancing awareness of human rights, equality, justice, peace”'],to:'/vision-mission',g:'from-sky-50 to-sky-100'}];

const priorities=[['Human Rights','Promoting awareness of fundamental human rights and dignity.'],['Justice','Encouraging equality, fairness, accountability and access to justice.'],['Peace','Supporting dialogue, tolerance and peaceful coexistence.'],['Humanitarian Service','Supporting vulnerable communities through responsible humanitarian initiatives.'],['Education','Promoting knowledge, awareness and opportunities for learning.'],['Empowerment','Encouraging women, children, youth and communities to participate in positive change.']];

function Slider(){const[i,setI]=useState(0);const n=slides.length;
useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%n),6000);return()=>clearInterval(t)},[n]);const s=slides[i];
return <section className={'relative overflow-hidden bg-gradient-to-br '+s.g} aria-roledescription="carousel">
{s.bg&&<div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[64%] md:block"><img src={s.bg} alt="" className="h-full w-full object-cover object-center"/><div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-sky-50 via-sky-50/90 to-transparent"/></div>}
<div className="relative grid min-h-[380px] items-center gap-6 px-12 py-10 sm:px-16 md:min-h-[360px] md:grid-cols-2 lg:px-12">
<div className="md:max-w-[46vw]"><p className="inline-block rounded-full bg-navy px-3 py-1 text-xs font-bold uppercase tracking-widest text-white sm:text-sm">{s.k}</p><h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-[38px] xl:text-[44px]">{s.h}<span className="block text-brand">{s.h2}</span></h1>
{s.p&&(s.p.includes(' • ')?<div className="mt-4 flex max-w-xl flex-wrap gap-2">{s.p.split(' • ').map(t=><span key={t} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy shadow-sm ring-1 ring-navy/15 sm:text-sm">{t}</span>)}</div>:<p className="mt-3 max-w-lg text-base font-medium text-slate-800 sm:text-lg">{s.p}</p>)}{s.more&&s.more.map(t=>t.includes(' • ')?<div key={t} className="mt-3 flex max-w-xl flex-wrap gap-2">{t.split(' • ').map(x=><span key={x} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy shadow-sm ring-1 ring-navy/15 sm:text-sm">{x}</span>)}</div>:<p key={t} className="mt-3 max-w-lg border-l-4 border-gold pl-3 text-sm italic text-slate-700">{t}</p>)}<div className="mt-6 flex flex-col gap-3 sm:flex-row"><Btn to={s.to}>Learn More →</Btn><Btn to="/vision-mission" alt cls="bg-white/70">Our Mission</Btn></div></div>
{s.bg?<img src={s.bg} alt="" className="mx-auto w-full max-w-md rounded-xl md:hidden"/>:null}</div>
{[[-1,ChevronLeft,'left-2','Previous slide'],[1,ChevronRight,'right-2','Next slide']].map(([d,I,p,l])=><button key={l} aria-label={l} onClick={()=>setI((i+d+n)%n)} className={'absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-navy hover:bg-white '+p}><I/></button>)}
<div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">{slides.map((_,x)=><button key={x} aria-label={'Slide '+(x+1)} onClick={()=>setI(x)} className={'h-3 w-3 rounded-full '+(x===i?'bg-brand':'bg-white')}/>)}</div></section>}

const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);

export default function Home(){
const welcome=texts['chairman-message'].b[0][1].split('\n\n').slice(0,2).join('\n\n');
const up=events.filter(e=>e.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
const latest=[...news].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
return <>
<Slider/>
<Wrap cls="grid gap-4 md:grid-cols-3">{mvo.map(m=><Card key={m.t} cls="flex items-center gap-4"><IconBadge i={m.i}/><div><h3 className="font-bold text-navy">{m.t}</h3><p className="text-sm text-slate-600">{m.d}</p><Link to={m.to} className="mt-2 inline-block text-sm font-semibold text-brand">Read More →</Link></div></Card>)}</Wrap>
<Wrap><div><Heading>About IHRC-USA</Heading><p className="text-slate-700">The International Human Rights Council – USA (IHRC-USA) is an organization focused on human rights awareness, humanitarian values, peace, equality and community development, working through education, advocacy, community engagement and responsible cooperation.</p><div className="mt-4"><Btn to="/who-we-are">About Us →</Btn></div></div></Wrap>
<Wrap><Heading to="/chairman-message">Welcome Message</Heading><Card><p className="whitespace-pre-line text-slate-700">{welcome}</p><div className="mt-4"><Btn to="/chairman-message" alt>Read the Chairman’s Message</Btn></div></Card></Wrap>
<Wrap><Heading to="/who-we-are">Human Rights Priorities</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{priorities.map(([t,d])=><Card key={t}><h3 className="font-bold text-navy">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></Card>)}</div></Wrap>
<Wrap><Heading to="/programs">Featured Programs</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{programs.slice(0,3).map(p=><ProgramCard key={p.t} p={p}/>)}</div></Wrap>
<Wrap><Heading to="/news">Latest News & Events</Heading>{up.length+latest.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{up.map(e=><EventCard key={e.id} e={e}/>)}{latest.map(n=><NewsCard key={n.id} n={n}/>)}</div>:<Empty>No news or events have been published yet. Please check back soon.</Empty>}</Wrap>
<Wrap><Heading to="/publications">Publications & Resources</Heading><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pubCategories.slice(0,6).map(c=><Link key={c} to="/publications"><Card cls="font-semibold text-navy">{c}</Card></Link>)}</div></Wrap>
<CooperationMarquee/>
<Wrap cls="grid gap-4 md:grid-cols-3"><div className="rounded-xl bg-navy p-6 text-white"><BadgeCheck size={32}/><h3 className="mt-2 font-serif text-xl font-bold">Become a Member</h3><p className="mb-4 text-blue-100">Join people who share a commitment to human dignity.</p><Btn to="/membership" cls="!bg-white !text-navy">Apply Now</Btn></div>
<div className="rounded-xl bg-brand p-6 text-white"><HandHeart size={32}/><h3 className="mt-2 font-serif text-xl font-bold">Volunteer</h3><p className="mb-4 text-blue-100">Give your time and skills to protect human rights.</p><Btn to="/volunteer" cls="!bg-white !text-navy">Join as Volunteer</Btn></div>
<div className="rounded-xl bg-gold p-6 text-navy"><Heart size={32}/><h3 className="mt-2 font-serif text-xl font-bold">Support Our Work</h3><p className="mb-4">Your gift helps us protect dignity for generations.</p><DonateLink className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-navy">Donate</DonateLink></div></Wrap>
<Wrap><div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-blue-50 p-6 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><ShieldAlert size={32} className="shrink-0 text-navy"/><div><h3 className="font-serif text-xl font-bold text-navy">Report a Human Rights Concern</h3><p className="text-sm text-slate-600">Share a concern with IHRC-USA using our confidential form.</p></div></div><Btn to="/report-concern">Report a Concern</Btn></div></Wrap></>}
