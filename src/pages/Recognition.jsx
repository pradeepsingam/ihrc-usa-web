import {Page,Card} from '../components/UI';
import FormCta from '../components/FormCta';
import {recognitionText,recognitionSections} from '../data/recognition';

const Fig=({i})=><figure className="flex flex-col items-center rounded-lg bg-white p-3 ring-1 ring-slate-100"><img src={i.src} alt={i.c} loading="lazy" className={'w-auto object-contain '+(i.wide?'max-h-72':'max-h-40')}/><figcaption className="mt-2 text-center text-sm font-medium text-navy">{i.c}</figcaption></figure>;

export default function Recognition(){return <Page title="Our Recognition" sub="Registrations and listings of IHRC-USA with the United Nations and the European Commission.">
 <div className="space-y-4">
  <Card><h2 className="font-serif text-xl font-bold text-navy">Our Recognition</h2><p className="mt-2 text-slate-700">{recognitionText}</p></Card>
  {recognitionSections.map(s=><Card key={s.t}><h2 className="font-serif text-xl font-bold text-navy">{s.t}</h2><p className="mt-2 text-slate-700">{s.d}</p>
   <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">{s.images.map(i=><div key={i.src+i.c} className={i.wide?'sm:col-span-2':''}><Fig i={i}/></div>)}</div>
   {s.sub&&<div className="mt-6"><h3 className="font-bold text-navy">{s.sub.h}</h3><div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{s.sub.items.map(i=><div key={i.c} className="flex flex-col"><Fig i={i}/><p className="mt-1 text-center text-xs text-slate-600">{i.d}</p></div>)}</div></div>}
  </Card>)}
 </div><FormCta page="recognition" cls="mt-8"/></Page>}
