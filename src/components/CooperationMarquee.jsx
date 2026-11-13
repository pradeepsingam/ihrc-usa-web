import {Wrap,Heading} from './UI';

const orgs=[
['European Commission','european-commission','Promotes European cooperation and partnership'],
['UN DESA','un-desa','Supports the implementation of the UN Sustainable Development Goals'],
['ECOSOC','ecosoc','Works to support sustainable development, inclusive dialogue and international cooperation'],
['UNESCO','unesco','Promotes peace through education, science, culture and communication'],
['World Health Organization','who','Supporting global health cooperation'],
['Association of Southeast Asian Nations (ASEAN)','asean','Supporting regional cooperation and shared prosperity'],
['Caribbean Community (CARICOM)','caricom','Supporting Caribbean integration and sustainable development'],
['Organization of American States (OAS)','oas','Supporting democracy, peace and regional cooperation'],
['African Union','african-union','Supports unity and progress of African states'],
['African Development Bank (AfDB)','afdb','Supporting sustainable economic growth and poverty reduction'],
['League of Arab States','arab-league','Promoting Arab cooperation and regional solidarity'],
['World Bank Group','world-bank','Supporting inclusive development and poverty reduction'],
['United Nations Office for Partnerships','un-partnerships','In support of the work of the United Nations'],
['Multilateral Cooperation','multilateral-cooperation','Dialogue • Partnership • Solidarity • Sustainability']];

const Item=({o,hide})=><li aria-hidden={hide?'true':undefined} className="mr-4 flex w-64 shrink-0 flex-col items-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
<img src={'/images/partners/'+o[1]+'.png'} alt={o[0]+' logo'} loading="lazy" className="h-20 w-auto max-w-[9rem] object-contain"/>
<h3 className="mt-3 text-sm font-bold leading-snug text-navy">{o[0]}</h3>
<p className="mt-1 text-xs leading-snug text-slate-600">{o[2]}</p></li>;

export default function CooperationMarquee(){
return <Wrap>
<Heading>In Support of Multilateral Cooperation</Heading>
<p className="-mt-3 mb-5 font-serif italic text-slate-600">Stronger Together for a Peaceful, Inclusive &amp; Sustainable World</p>
<div className="marquee overflow-hidden" aria-label="Organizations we support">
<ul className="marquee-track">
{orgs.map(o=><Item key={o[1]} o={o}/>)}
{orgs.map(o=><Item key={o[1]+'-2'} o={o} hide/>)}
</ul></div></Wrap>}
