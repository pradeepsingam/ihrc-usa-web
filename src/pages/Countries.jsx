import {useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {Page,Card,PersonCard,Empty} from '../components/UI';
import FormCta from '../components/FormCta';
import {countries} from '../data/countries';
import {allPeople} from '../data';
import {countryCode,membersForCountry} from '../lib/countryMembers';

const emoji=c=>String.fromCodePoint(...[...c.toUpperCase()].map(ch=>127397+ch.charCodeAt(0)));
const Flag=({code,name})=>{const[err,setErr]=useState(false);
 return err?<span className="text-3xl leading-none" aria-hidden="true">{emoji(code)}</span>
 :<img src={`https://flagcdn.com/w80/${code}.png`} srcSet={`https://flagcdn.com/w160/${code}.png 2x`} alt={`Flag of ${name}`} loading="lazy" onError={()=>setErr(true)} className="h-7 w-10 shrink-0 rounded-sm object-cover ring-1 ring-slate-200"/>};

export default function Countries(){
 const[q,setQ]=useState('');
 const[params]=useSearchParams();
 const selected=countries.find(([code])=>code===countryCode(params.get('country')));
 if(selected){
  const members=membersForCountry(allPeople,selected[0]);
  return <Page title={'Members in '+selected[1]} sub="Public IHRC-USA member profiles for this country.">
   <Link to="/countries" className="mb-6 inline-block font-semibold text-brand underline">← All countries</Link>
   <div className="mb-6 flex items-center gap-3"><Flag code={selected[0]} name={selected[1]}/><h2 className="font-serif text-xl font-bold text-navy">{selected[1]} · {members.length} {members.length===1?'member':'members'}</h2></div>
   {members.length?<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{members.map(person=><PersonCard key={person.id} p={person}/>)}</div>
    :<Empty>No public member profiles are listed for {selected[1]} yet.</Empty>}
  </Page>;
 }
 const list=countries.filter(([,n])=>n.toLowerCase().includes(q.trim().toLowerCase()));
 return <Page title="Countries" sub="Flags and names of the 195 countries recognised worldwide — 193 UN member states and 2 observer states.">
  <FormCta page="countries" cls="mb-6"/>
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search country…" aria-label="Search country" className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:max-w-sm"/>
  <p className="mb-5 text-sm text-slate-500">Showing {list.length} of {countries.length} countries</p>
  <p className="mb-5 text-sm text-slate-600">Choose a country to see its public member profiles.</p>
  {list.length?<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map(([c,n])=><Link key={c} to={'/countries?country='+c} aria-label={'View members in '+n} className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"><Card cls="flex h-full items-center gap-3 !p-3"><Flag code={c} name={n}/><span className="flex-1 font-medium text-navy">{n}</span><span aria-hidden="true" className="text-brand">→</span></Card></Link>)}</div>
  :<p className="text-slate-600">No country found.</p>}
  <p className="mt-8 text-xs text-slate-500">The 193 UN member states plus the Holy See (Vatican City) and Palestine as observer states.</p>
 </Page>}
