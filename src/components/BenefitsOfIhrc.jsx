import {Heading} from './UI';
import {ihrcBenefits} from '../data/ihrcBenefits';

export default function BenefitsOfIhrc(){
return <section>
<Heading>Benefits of IHRC</Heading>
<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{ihrcBenefits.map(([title,text,Icon])=>
<li key={title} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-brand"><Icon size={20} aria-hidden="true"/></span>
<div><h3 className="font-bold text-navy">{title}</h3><p className="mt-0.5 text-sm text-slate-600">{text}</p></div></li>)}</ul>
</section>}
