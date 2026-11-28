import {managed} from '../lib/managedContent';
import {Link} from 'react-router-dom';
import {Page,Card,Btn} from '../components/UI';
import FormCta from '../components/FormCta';
import {programs} from '../data/programs';
import {researchAreas,researchWho,researchBenefits} from '../data/research';
const editableCopy=managed("copy.WhatWeDo","What We Do — headings and text","Page text",{
 "page-title-what-we-do": "What We Do",
 "page-introduction-education-awareness-research-community-participation-and-humanita": "Education, awareness, Research, community participation and humanitarian service for human dignity.",
 "text-ihrc-usa-works-to-promote-human-rights-awareness-research-humanit": "IHRC-USA works to promote human-rights awareness, Research, humanitarian values, peace, equality and community empowerment through education, advocacy, service, partnerships and responsible action.",
 "text-our-purpose": "Our Purpose",
 "text-research": "Research",
 "text-ihrc-usa-invites-researchers-academics-legal-experts-and-field-in": "IHRC-USA invites researchers, academics, legal experts and field investigators to join its global research network in the service of human rights.",
 "text-research-areas": "Research Areas",
 "text-who-can-apply": "Who Can Apply",
 "text-benefits": "Benefits",
 "text-how-to-apply": "How to Apply",
 "text-complete-the-researchers-application-form-in-full-and-attach-your": "Complete the Researchers Application Form in full and attach your CV, a one-page research proposal abstract and copies of your certificates.",
 "text-research-application": "Research Application",
 "text-call-for-researchers": "Call for Researchers",
 "text-our-programme-areas": "Our Programme Areas",
 "text-our-work-is-organised-across-these-eight-programme-areas-supporte": "Our work is organised across these eight programme areas, supported by",
 "text-specific-objectives": "specific objectives.",
 "text-view-all-programs": "View all programs"
});


const purpose=managed("WhatWeDo.purpose","Purpose",'Website content',['Promote understanding of human rights.','Encourage equality and dignity.','Support vulnerable communities.','Promote peaceful coexistence.','Encourage humanitarian service.','Promote educational awareness.','Encourage women’s and children’s empowerment.','Support youth participation.','Promote environmental responsibility.','Encourage international cooperation.']);
const areas=managed("WhatWeDo.areas","Areas",'Website content',[['Human Rights Protection and Advocacy',[['Human Rights Protection','/programs/prevention-of-human-rights-violations'],['Human Rights Defenders','/programs/advice-and-assistance'],['Fundamental Freedoms','/programs/universal-rights'],['Anti-Discrimination','/programs/non-discrimination'],['Human Rights Monitoring','/programs/investigations']]],['Justice, Law and Accountability',[['Legal Assistance','/programs/legal-aid'],['Access to Justice','/programs/rule-of-law'],['Prevention of Torture','/programs/prevention-of-human-rights-violations'],['Anti-Corruption','/programs/eradication'],['Institutional Accountability','/programs/accountability']]],['Education, Research and Capacity Building',[['Human Rights Education','/programs?cat=Education'],['Literacy and Research','/programs/education-for-children'],['Training and Development','/events'],['Publications and Reports','/news'],['Institutional Capacity Building','/events']]],['Women, Children and Vulnerable Groups',[['Women’s Empowerment','/programs/women-s-empowerment'],['Child Protection','/programs/prevention-of-human-trafficking'],['Disability Rights','/programs/right-to-information'],['Elderly Rights','/programs/help-for-the-poor'],['Refugee and Migrant Protection','/programs/minority-rights']]],['Humanitarian Assistance and Social Development',[['Humanitarian Support','/programs?cat=Humanitarian'],['Emergency Relief','/news'],['Victim Assistance','/programs/advice-and-assistance'],['Health Awareness','/programs/health'],['Community Development','/programs/healthy-society']]],['Peace, Reconciliation and Social Harmony',[['Peacebuilding','/programs/the-speed-of-trust'],['Conflict Resolution','/programs/police-public-relations'],['Transitional Justice','/programs/accountability'],['Intercultural Dialogue','/programs/indigenous-values'],['Social Cohesion','/programs/equality']]],['Environmental and Sustainable Development',[['Environmental Protection','/programs/environmental-protection'],['Climate Awareness','/programs?cat=Environment'],['Biodiversity Conservation','/programs/connecting-with-nature'],['Sustainable Communities','/programs/sustainable-agriculture'],['Environmental Justice','/programs/waste-management']]],['Global Cooperation and International Relations',[['International Advocacy','/news'],['Global Partnerships','/events'],['International Human Rights Cooperation','/programs/universal-rights'],['Policy Development','/programs/government-schemes'],['Cross-Border Humanitarian Initiatives','/programs?cat=Humanitarian']]]]);

export default function WhatWeDo(){
 return <Page title={editableCopy["page-title-what-we-do"]} sub={editableCopy["page-introduction-education-awareness-research-community-participation-and-humanita"]}>
  <div className="space-y-4">
   <Card><h2 className="font-serif text-xl font-bold text-navy">Our Work</h2>
    <p className="mt-2 text-slate-700">{editableCopy["text-ihrc-usa-works-to-promote-human-rights-awareness-research-humanit"]}</p></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-our-purpose"]}</h2>
    <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">{purpose.map((i,n)=><li key={n} className="flex gap-2 text-slate-700"><span className="text-brand">•</span><span>{i}</span></li>)}</ul></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-research"]}</h2>
    <p className="mt-2 text-slate-700">{editableCopy["text-ihrc-usa-invites-researchers-academics-legal-experts-and-field-in"]}</p>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
     <div className="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100"><h3 className="font-bold text-navy">{editableCopy["text-research-areas"]}</h3><ul className="mt-2 space-y-1 text-sm text-slate-700">{researchAreas.map(i=><li key={i} className="flex gap-2"><span className="text-brand">•</span><span>{i}</span></li>)}</ul></div>
     <div className="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100"><h3 className="font-bold text-navy">{editableCopy["text-who-can-apply"]}</h3><ul className="mt-2 space-y-1 text-sm text-slate-700">{researchWho.map(i=><li key={i} className="flex gap-2"><span className="text-brand">•</span><span>{i}</span></li>)}</ul></div>
     <div className="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100"><h3 className="font-bold text-navy">{editableCopy["text-benefits"]}</h3><ul className="mt-2 space-y-1 text-sm text-slate-700">{researchBenefits.map(i=><li key={i} className="flex gap-2"><span className="text-brand">•</span><span>{i}</span></li>)}</ul></div>
    </div>
    <div className="mt-5 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100"><h3 className="font-bold text-navy">{editableCopy["text-how-to-apply"]}</h3>
     <p className="mt-1 text-slate-700">{editableCopy["text-complete-the-researchers-application-form-in-full-and-attach-your"]}</p>
     <div className="mt-3 flex flex-wrap gap-3"><Btn to="/research#apply">{editableCopy["text-research-application"]}</Btn><Btn to="/research" alt>{editableCopy["text-call-for-researchers"]}</Btn></div></div></Card>
   <Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-our-programme-areas"]}</h2>
    <p className="mt-2 text-slate-700">{editableCopy["text-our-work-is-organised-across-these-eight-programme-areas-supporte"]+" "}{programs.length}{" "+editableCopy["text-specific-objectives"]}</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{areas.map(([t,list],n)=><div key={t} className="h-full rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100"><h3 className="font-bold text-navy">{n+1}. {t}</h3><ul className="mt-2 space-y-1 text-sm text-slate-700">{list.map(([i,to])=><li key={i} className="flex gap-2"><span className="text-brand">•</span><Link to={to} className="hover:text-brand hover:underline">{i}</Link></li>)}</ul></div>)}</div>
    <div className="mt-5"><Btn to="/programs">{editableCopy["text-view-all-programs"]}</Btn></div></Card>
  </div>
  <FormCta page="what-we-do" cls="mt-8"/>
 </Page>}