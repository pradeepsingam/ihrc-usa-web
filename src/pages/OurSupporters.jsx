import {useEffect,useState} from 'react';
import {Page,Card} from '../components/UI';
import FormCta from '../components/FormCta';
import {SUPPORTERS_ENDPOINT} from '../config';
import {supporters} from '../content';

const initials=n=>n.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();

const SupporterCard=({s})=>{
 const body=<>
  <div className="flex h-28 items-center justify-center rounded-lg bg-white">
   {s.logo?<img src={s.logo} alt={s.name} loading="lazy" className="max-h-28 w-auto max-w-full object-contain"/>
    :<span className="grid h-20 w-20 place-items-center rounded-full bg-navy text-2xl font-bold text-white">{initials(s.name)}</span>}
  </div>
  <h3 className="mt-3 text-center font-bold text-navy">{s.name}</h3>
  {s.details&&<p className="mt-1 text-center text-sm text-slate-600">{s.details}</p>}
 </>;
 const cls='block h-full rounded-lg bg-white p-4 ring-1 ring-slate-100';
 return s.url?<a href={s.url} target="_blank" rel="noopener noreferrer" className={cls+' transition hover:ring-brand'}>{body}</a>:<div className={cls}>{body}</div>;
};

const Section=({title,list,empty})=><Card><h2 className="font-serif text-xl font-bold text-navy">{title}</h2>
 {list.length?<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(s=><SupporterCard key={s.name} s={s}/>)}</div>
  :<p className="mt-3 text-sm text-slate-600">{empty}</p>}</Card>;

export default function OurSupporters(){
 const [data,setData]=useState(supporters);
 const [loading,setLoading]=useState(!!SUPPORTERS_ENDPOINT);
 useEffect(()=>{
  if(!SUPPORTERS_ENDPOINT)return;
  let live=true;
  fetch(SUPPORTERS_ENDPOINT).then(r=>r.ok?r.json():Promise.reject()).then(j=>{if(live)setData({donors:Array.isArray(j.donors)?j.donors:[],sponsors:Array.isArray(j.sponsors)?j.sponsors:[]});}).catch(()=>{}).finally(()=>{if(live)setLoading(false);});
  return()=>{live=false;};
 },[]);
 const {donors,sponsors}=data;
 const empty=t=>loading?'Loading…':t;
 return <Page title="Our Supporters" sub="With gratitude to the donors and sponsors who make our work possible.">
  <div className="space-y-4">
   <Section title="Donors" list={donors} empty={empty("Our donors will be listed here.")}/>
   <Section title="Sponsors" list={sponsors} empty={empty("Our sponsors will be listed here.")}/>
  </div>
  <FormCta page="our-supporters" cls="mt-8"/>
 </Page>}
