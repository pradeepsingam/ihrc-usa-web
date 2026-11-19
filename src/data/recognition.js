const I='/images/recognition/';
export const recognitionText='The International Human Rights Council–USA (IHRC-USA) is an independent, civil society organization (CSO). It is registered on the United Nations Partner Portal, and its organizational profile is featured on the Office of the United Nations High Commissioner for Human Rights (OHCHR) website in connection with the Universal Periodic Review (UPR). Furthermore, IHRC-USA has completed the procedures for registration with the United Nations NGO Branch and is also registered on the European Commission’s EU Funding & Tenders Portal.';

export const recognitionMarquee=[
['un-partner-portal','UN Partner Portal'],
['un-partner-portal-banner','UN Partner Portal – joint platform of UN agencies'],
['ohchr-logo','UN Human Rights (OHCHR)'],
['ohchr-horizontal','UN Human Rights – Office of the High Commissioner'],
['un-ngo-branch','UN-NGO Branch'],
['european-commission','European Commission'],
['iom','IOM – UN Migration'],
['un-women','UN Women'],
['fao','FAO'],
['unfpa','UNFPA'],
['unicef','UNICEF'],
['unops','UNOPS'],
['wfp','World Food Programme (WFP)'],
['who','World Health Organization'],
['sdg','Sustainable Development Goals']].map(([f,n])=>({src:I+f+'.png',alt:n}));

export const recognitionSections=[
{t:'UN Partner Portal',d:'IHRC-USA is registered on the United Nations Partner Portal. The Portal is a platform for Civil Society Organizations (CSOs) to engage with the UN on partnership opportunities. It was developed jointly by IOM, the UN Secretariat, UN Women, FAO, UNFPA, UNHCR, UNICEF, UNOPS, WFP and WHO to make collaboration between the UN and its partners harmonized, efficient and easy.',
 images:[{src:I+'un-partner-portal.png',c:'UN Partner Portal'},{src:I+'un-partner-portal-banner.png',c:'UN Partner Portal – a joint platform of UN agencies for civil society organizations',wide:true}],
 sub:{h:'UN agencies behind the Partner Portal',items:[
 {src:I+'iom.png',c:'IOM – UN Migration',d:'Migration and the protection of migrants.'},
 {src:I+'un-women.png',c:'UN Women',d:'Gender equality and the empowerment of women and girls.'},
 {src:I+'fao.png',c:'FAO – Food and Agriculture Organization',d:'Food security, agriculture and rural development.'},
 {src:I+'unfpa.png',c:'UNFPA',d:'Reproductive health, population and women’s rights.'},
 {src:I+'unicef.png',c:'UNICEF',d:'The rights, health, education and protection of children.'},
 {src:I+'unops.png',c:'UNOPS',d:'Project management, procurement and infrastructure support for the UN.'},
 {src:I+'wfp.png',c:'WFP – World Food Programme',d:'Emergency food assistance and hunger relief.'},
 {src:I+'who.png',c:'WHO – World Health Organization',d:'Global public health.'}]}},
{t:'OHCHR and the Universal Periodic Review (UPR)',d:'IHRC-USA’s organizational profile is featured on the website of the Office of the United Nations High Commissioner for Human Rights (OHCHR) in connection with the Universal Periodic Review (UPR). OHCHR is the UN office that leads human-rights work worldwide, and the UPR is the process through which the human-rights record of every UN member state is reviewed.',
 images:[{src:I+'ohchr-logo.png',c:'United Nations Human Rights – Office of the High Commissioner'},{src:I+'ohchr-horizontal.png',c:'OHCHR – horizontal logo'}]},
{t:'UN NGO Branch',d:'IHRC-USA has completed the procedures for registration with the United Nations NGO Branch, the UN office that supports civil society organizations in their engagement with the United Nations.',
 images:[{src:I+'un-ngo-branch.png',c:'UN-NGO Branch'}]},
{t:'European Commission – EU Funding & Tenders Portal',d:'IHRC-USA is registered on the European Commission’s EU Funding & Tenders Portal, the European Commission’s online gateway for EU funding opportunities and tenders.',
 images:[{src:I+'european-commission.png',c:'European Commission'}]},
{t:'We Support the Sustainable Development Goals',d:'IHRC-USA’s work supports the 17 United Nations Sustainable Development Goals, from ending poverty and hunger to peace, justice and strong institutions.',
 images:[{src:I+'sdg.png',c:'The 17 Sustainable Development Goals'}]}];
