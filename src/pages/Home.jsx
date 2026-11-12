import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft,ChevronRight,Heart,BadgeCheck} from 'lucide-react';
import {mvo,programs,news,people} from '../data';
import DonateLink from '../components/DonateLink';
import {Wrap,Heading,Btn,Card,IconBadge,ProgramCard,NewsCard,PersonCard,Img} from '../components/UI';

const slides=[
{k:'International Human Rights Council–USA',h:'Equal Justice',h2:'for Everyone & Everywhere.',bg:'/images/hero-stupa.jpg',p:'Promoting Human Dignity • Advancing Justice • Building Peace • Serving Humanity • Defending Human Rights',to:'/who-we-are',g:'from-sky-50 to-sky-100'},
{k:'Get Involved',h:'Join Our Community.',h2:'Become a Member.',bg:'/images/hero-students.jpg',p:'Stand with advocates and volunteers across the island.',to:'/apply',g:'from-sky-50 to-sky-100'},
{k:'Programs',h:'Education for Rights.',h2:'Hope for Generations.',bg:'/images/hero 1.png',p:'Workshops, clinics and youth forums in every province.',to:'/programs',g:'from-sky-50 to-sky-100'}];

const priorities=[['Human Rights','Promoting awareness of fundamental human rights and dignity.'],['Justice','Encouraging equality, fairness, accountability and access to justice.'],['Peace','Supporting dialogue, tolerance and peaceful coexistence.'],['Humanitarian Service','Supporting vulnerable communities through responsible humanitarian initiatives.'],['Education','Promoting knowledge, awareness and opportunities for learning.'],['Empowerment','Encouraging women, children, youth and communities to participate in positive change.']];

function Slider(){const[i,setI]=useState(0);const n=slides.length;
useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%n),6000);return()=>clearInterval(t)},[n]);const s=slides[i];
return <section className={'relative overflow-hidden bg-gradient-to-br '+s.g} aria-roledescription="carousel">
{s.bg&&<div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] md:block"><img src={s.bg} alt="" className="h-full w-full object-cover object-center"/><div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-sky-50 to-transparent"/></div>}
<div className="relative grid min-h-[380px] items-center gap-6 px-12 py-10 sm:px-16 md:min-h-[360px] md:grid-cols-2 lg:px-12">
<div><p className="font-bold text-navy sm:text-xl">{s.k}</p><h1 className="mt-1 text-4xl font-extrabold leading-tight text-navy lg:text-[52px]">{s.h}<span className="block text-brand">{s.h2}</span></h1>
<p className="mt-3 max-w-sm text-slate-800">{s.p}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><Btn to={s.to}>Learn More →</Btn><Btn to="/vision-mission" alt cls="bg-white/70">Our Mission</Btn></div></div>
{s.bg?<img src={s.bg} alt="" className="mx-auto w-full max-w-md rounded-xl md:hidden"/>:<Img src={'/images/ihrc/'+s.img+'.png'} alt={s.h} cls="mx-auto mb-4 w-56 rounded-xl shadow-xl ring-4 ring-white sm:w-72 md:mb-0 md:w-80"/>}</div>
{[[-1,ChevronLeft,'left-2','Previous slide'],[1,ChevronRight,'right-2','Next slide']].map(([d,I,p,l])=><button key={l} aria-label={l} onClick={()=>setI((i+d+n)%n)} className={'absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-navy hover:bg-white '+p}><I/></button>)}
<div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">{slides.map((_,x)=><button key={x} aria-label={'Slide '+(x+1)} onClick={()=>setI(x)} className={'h-3 w-3 rounded-full '+(x===i?'bg-brand':'bg-white')}/>)}</div></section>}

export default function Home(){return <>
<Slider/>
<Wrap cls="grid gap-4 md:grid-cols-3">{mvo.map(m=><Card key={m.t} cls="flex items-center gap-4"><IconBadge i={m.i}/><div><h3 className="font-bold text-navy">{m.t}</h3><p className="text-sm text-slate-600">{m.d}</p><Link to={m.to} className="mt-2 inline-block text-sm font-semibold text-brand">Read More →</Link></div></Card>)}</Wrap>
<Wrap><Heading to="/who-we-are">Our Priorities</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{priorities.map(([t,d])=><Card key={t}><h3 className="font-bold text-navy">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></Card>)}</div></Wrap>
<Wrap cls="grid items-center gap-6 md:grid-cols-2"><div><Heading>About IHRC–USA</Heading><p className="text-slate-700">The International Human Rights Council – USA (IHRC-USA) is an independent, non-profit and self-governed humanitarian organization committed to promoting and protecting human rights, justice, peace, equality and human dignity and humanitarian values through education, advocacy, community engagement and responsible international cooperation.</p><div className="mt-4"><Btn to="/who-we-are">About Us →</Btn></div></div>
<Img src="/images/about-students.jpg" alt="Human Rights for a Better Tomorrow" cls="w-full rounded-xl shadow-lg ring-1 ring-slate-200"/></Wrap>
<Wrap><Heading to="/programs">Our Programs</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{programs.slice(0,3).map(p=><ProgramCard key={p.t} p={p}/>)}</div></Wrap>
<Wrap><Heading to="/leadership">Leadership</Heading><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{people.leadership.slice(0,4).map(p=><PersonCard key={p.id} p={p}/>)}</div></Wrap>
<Wrap><Heading to="/news">News & Events</Heading><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{news.slice(0,3).map(n=><NewsCard key={n.t} n={n}/>)}</div></Wrap>
<Wrap cls="grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-navy p-6 text-white"><BadgeCheck size={32}/><h3 className="mt-2 font-serif text-xl font-bold">Verify a Member</h3><p className="mb-4 text-blue-100">Check the status of an IHRC member ID.</p><Btn to="/verify" cls="!bg-white !text-navy">Verify Now</Btn></div>
<div className="rounded-xl bg-gold p-6 text-navy"><Heart size={32}/><h3 className="mt-2 font-serif text-xl font-bold">Support Our Work</h3><p className="mb-4">Your gift helps us protect dignity for generations.</p><DonateLink className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand">Donate</DonateLink></div></Wrap></>}
