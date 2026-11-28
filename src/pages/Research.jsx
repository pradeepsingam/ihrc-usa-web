import {managed} from '../lib/managedContent';
import {Page,Card,Heading} from '../components/UI';
import RegistrationForm from '../components/RegistrationForm';
import {researchForm} from '../data/researchForm';
import {researchAreas,researchWho,researchBenefits,researchTopics,equalOpportunity,researchRef,researchClosingDate} from '../data/research';
import {siteInfo,forms} from '../content';
const editableCopy=managed("copy.Research","Research — headings and text","Page text",{
 "page-title-call-for-researchers": "Call for Researchers",
 "page-introduction-join-our-global-research-network-in-the-service-of-human-rights": "Join our global research network in the service of human rights.",
 "text-join-our-global-research-network": "Join Our Global Research Network!",
 "text-the-international-human-rights-council-usa-ihrc-usa-invites-resea": "The International Human Rights Council – USA (IHRC-USA) invites researchers, academics, legal experts and field investigators to join its global research network in the service of human rights.",
 "text-closing-date": "Closing Date:",
 "text-strengthen-the-knowledge-base-for-human-rights-join-us": "Strengthen the knowledge base for human rights. Join us.",
 "text-apply-online": "Apply Online",
 "text-research-areas": "Research Areas",
 "text-who-can-apply": "Who Can Apply",
 "text-benefits": "Benefits",
 "text-how-to-apply": "How to Apply",
 "text-complete-the-researchers-application-form-below-in-full-attach-yo": "Complete the Researchers Application Form below in full. Attach your CV, a one-page research proposal abstract and copies of your certificates in the attachments section. Incomplete applications will not be considered. Questions:",
 "text-research-topics": "Research Topics",
 "text-researchers-application-form": "Researchers Application Form"
});


const Bullets=({items,cols})=><ul className={'mt-3 grid gap-x-6 gap-y-2 '+(cols?'sm:grid-cols-2':'')}>{items.map(i=><li key={i} className="flex gap-2 text-slate-700"><span className="text-brand">•</span><span>{i}</span></li>)}</ul>;

export default function Research(){
return <Page title={editableCopy["page-title-call-for-researchers"]} sub={editableCopy["page-introduction-join-our-global-research-network-in-the-service-of-human-rights"]}>
<div className="space-y-6">
<Card>
<h2 className="font-serif text-2xl font-bold text-navy">{editableCopy["text-join-our-global-research-network"]}</h2>
<p className="mt-3 text-slate-700">{editableCopy["text-the-international-human-rights-council-usa-ihrc-usa-invites-resea"]}</p>
{(researchRef||researchClosingDate)&&<p className="mt-3 text-sm font-semibold text-navy">{researchRef&&<span>Ref: {researchRef}</span>}{researchRef&&researchClosingDate&&' | '}{researchClosingDate&&<span>{editableCopy["text-closing-date"]+" "}{researchClosingDate}</span>}</p>}
<p className="mt-3 italic text-slate-700">{editableCopy["text-strengthen-the-knowledge-base-for-human-rights-join-us"]}</p>
<div className="mt-4 flex flex-wrap gap-3"><a href="#apply" className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-navy px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand">{editableCopy["text-apply-online"]}</a></div>
</Card>
<div className="grid gap-4 md:grid-cols-3">
<Card><h3 className="font-bold text-navy">{editableCopy["text-research-areas"]}</h3><Bullets items={researchAreas}/></Card>
<Card><h3 className="font-bold text-navy">{editableCopy["text-who-can-apply"]}</h3><Bullets items={researchWho}/></Card>
<Card><h3 className="font-bold text-navy">{editableCopy["text-benefits"]}</h3><Bullets items={researchBenefits}/></Card>
</div>
<Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-how-to-apply"]}</h2>
<p className="mt-2 text-slate-700">{editableCopy["text-complete-the-researchers-application-form-below-in-full-attach-yo"]+" "}<a className="text-brand hover:underline" href={'mailto:'+siteInfo.email}>{siteInfo.email}</a>.</p></Card>
<section><Heading>{editableCopy["text-research-topics"]}</Heading>
<div className="grid gap-4 md:grid-cols-2">{researchTopics.map(([g,list])=><Card key={g}><h3 className="font-bold text-navy">{g}</h3><ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">{list.map(t=><li key={t}>{t}</li>)}</ol></Card>)}</div></section>
<section id="apply" className="scroll-mt-24"><Heading>{editableCopy["text-researchers-application-form"]}</Heading><RegistrationForm spec={forms.research||researchForm}/></section>
<p className="text-sm italic text-slate-600">{equalOpportunity}</p>
</div></Page>}
