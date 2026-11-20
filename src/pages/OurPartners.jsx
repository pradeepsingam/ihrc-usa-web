import {Page,Card} from '../components/UI';
import FormCta from '../components/FormCta';
import {recognitionMarquee} from '../data/recognition';
import {partners} from '../content';

const P='/images/partners/';
const ourPartners=[
 {src:P+'un-us-human-rights.jpg',name:'UN & US Human Rights Organization'},
 {src:P+'peace-one-day-mali.jpg',name:'Peace One Day Mali'}];

const Logo=({src,name,big,url})=>{const fig=<figure className="flex h-full flex-col items-center justify-between rounded-lg bg-white p-3 ring-1 ring-slate-100"><img src={src} alt={name} loading="lazy" className={'w-auto object-contain '+(big?'max-h-56':'max-h-32')}/><figcaption className="mt-3 text-center text-sm font-semibold text-navy">{name}</figcaption></figure>;
return url?<a href={url} target="_blank" rel="noopener noreferrer" className="block h-full transition hover:opacity-90">{fig}</a>:fig};

export default function OurPartners(){
 return <Page title="Our Partners" sub="The organizations and institutions IHRC-USA works with and is recognised by.">
  <div className="space-y-4">
   <Card><h2 className="font-serif text-xl font-bold text-navy">Our Partners</h2>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">{ourPartners.map(p=><Logo key={p.name} src={p.src} name={p.name} big/>)}{/* partners added in the admin panel (Organisation → Partners) */}{partners.filter(p=>p.logo).map(p=><Logo key={'a-'+p.name} src={p.logo} name={p.name} url={p.website} big/>)}</div></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">Our Recognition</h2>
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{recognitionMarquee.map(r=><Logo key={r.src} src={r.src} name={r.alt}/>)}</div></Card>
  </div>
  <FormCta page="our-partners" cls="mt-8"/>
 </Page>}
