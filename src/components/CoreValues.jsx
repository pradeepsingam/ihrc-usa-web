import {Card} from './UI';
import {coreValues} from '../data/coreValues';

export default function CoreValues(){
return <Card>
<h2 className="font-serif text-xl font-bold text-navy">Core Values</h2>
<ul className="mt-4 grid gap-4 sm:grid-cols-2">{coreValues.map(({name,text,icon:Icon})=>
<li key={name} className="flex items-start gap-3">
<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 text-brand"><Icon size={22} aria-hidden="true"/></span>
<div><h3 className="font-bold text-navy">{name}</h3><p className="text-slate-700">{text}</p></div></li>)}</ul>
</Card>}
