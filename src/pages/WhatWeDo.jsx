import {Link} from 'react-router-dom';
import {Page,Card,Btn} from '../components/UI';
import FormCta from '../components/FormCta';
import {texts} from '../data';
import {programs} from '../data/programs';

const purpose=texts['who-we-are'].b.find(x=>x[0]==='Our Purpose')[1].items;
const cats=[...new Set(programs.map(p=>p.c))].map(c=>[c,programs.filter(p=>p.c===c)]);

export default function WhatWeDo(){
 return <Page title="What We Do" sub="Education, awareness, community participation and humanitarian service for human dignity.">
  <div className="space-y-4">
   <Card><h2 className="font-serif text-xl font-bold text-navy">Our Work</h2>
    <p className="mt-2 text-slate-700">IHRC-USA works to promote human-rights awareness, humanitarian values, peace, equality and community empowerment through education, advocacy, service, partnerships and responsible action.</p></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">Our Purpose</h2>
    <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">{purpose.map(i=><li key={i} className="flex gap-2 text-slate-700"><span className="text-brand">•</span><span>{i}</span></li>)}</ul></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">Our Programme Areas</h2>
    <p className="mt-2 text-slate-700">Our work is organised under {programs.length} specific objectives across these areas.</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cats.map(([c,list])=><Link key={c} to={'/programs?cat='+c}><div className="h-full rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100 transition hover:bg-blue-100"><h3 className="font-bold text-navy">{c}</h3><p className="mt-1 text-sm text-slate-600">{list.length} {list.length===1?'objective':'objectives'}</p><ul className="mt-2 space-y-1 text-sm text-slate-700">{list.slice(0,4).map(p=><li key={p.n}>• {p.t}</li>)}</ul></div></Link>)}</div>
    <div className="mt-5"><Btn to="/programs">View all programs</Btn></div></Card>
  </div>
  <FormCta page="what-we-do" cls="mt-8"/>
 </Page>}
