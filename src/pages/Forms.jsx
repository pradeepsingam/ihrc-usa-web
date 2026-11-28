import {managed} from '../lib/managedContent';
import {useState} from 'react';
import {BadgeCheck,XCircle,Search} from 'lucide-react';
import {members} from '../data';
import {siteInfo,forms} from '../content';
import {API_URL} from '../config';
import {Btn,Pending} from '../components/UI';
import {Page,Card,Form} from '../components/UI';
import {socialLinks,socialIcon,socialBg} from '../components/Layout';
import RegistrationForm from '../components/RegistrationForm';
import {membershipForm,volunteerForm} from '../data/registrationForms';
const editableCopy=managed("copy.Forms","Forms — headings and text","Page text",{
 "text-contact": "Contact",
 "text-email": "Email:",
 "text-office": "Office:",
 "page-title-membership": "Membership",
 "page-introduction-join-ihrc-usa-and-stand-for-human-dignity": "Join IHRC-USA and stand for human dignity.",
 "text-introduction": "Introduction",
 "text-ihrc-usa-seeks-to-bring-together-individuals-volunteers-professio": "IHRC-USA seeks to bring together individuals, volunteers, professionals, community leaders and organizations who share a commitment to human dignity and social responsibility.",
 "text-view-membership-benefits": "View Membership Benefits",
 "text-membership-information": "Membership Information",
 "text-membership-categories-eligibility-and-any-fees": "Membership categories, eligibility and any fees:",
 "page-title-volunteer": "Volunteer",
 "page-introduction-give-your-time-to-protect-human-rights": "Give your time to protect human rights.",
 "text-volunteers-are-at-the-heart-of-our-community-work-join-us-in-prom": "Volunteers are at the heart of our community work. Join us in promoting human rights awareness, education, humanitarian service and community participation.",
 "text-opportunities": "Opportunities",
 "text-volunteers-can-support-our-work-in-these-areas": "Volunteers can support our work in these areas:",
 "page-title-contact-ihrc-usa": "Contact IHRC-USA",
 "page-introduction-we-d-love-to-hear-from-you": "We’d love to hear from you.",
 "text-contact-form": "Contact Form",
 "text-enquiry-type": "Enquiry type",
 "text-general-enquiries": "General Enquiries",
 "text-office-1": "Office",
 "text-whatsapp": "WhatsApp",
 "text-whatsapp-channel": "WhatsApp Channel",
 "text-join-our-whatsapp-channel": "Join our WhatsApp Channel",
 "text-social-media": "Social Media",
 "text-report-a-human-rights-concern": "Report a Human Rights Concern",
 "text-use-our-separate-confidential-form": "Use our separate confidential form.",
 "text-report-a-concern": "Report a Concern",
 "page-title-verify-member": "Verify Member",
 "page-introduction-enter-a-member-id-for-example-ihrc-m-00012-to-check-membership-st": "Enter a member ID (for example IHRC-M-00012) to check membership status.",
 "text-please-enter-a-member-id": "Please enter a member ID.",
 "text-no-member-found-for-this-id": "No member found for this ID.",
 "text-too-many-checks-please-wait-a-minute-and-try-again": "Too many checks. Please wait a minute and try again.",
 "text-verification-is-not-available-right-now-please-try-again-later": "Verification is not available right now. Please try again later.",
 "text-member": "member",
 "text-member-id": "Member ID",
 "text-title": "Title",
 "text-country": "Country"
});


const areas=['Education & Awareness','Health & Welfare','Rights & Empowerment','Justice & Governance','Environment'];
const Info=({children})=><Card><h3 className="font-bold text-navy">{editableCopy["text-contact"]}</h3><p className="mt-2 space-y-1 text-sm text-slate-600"><span className="block">{editableCopy["text-email"]+" "}<a className="text-brand hover:underline" href={'mailto:'+siteInfo.email}>{siteInfo.email}</a></span>{siteInfo.phone&&<span className="block">{editableCopy["text-office"]+" "}<a className="text-brand hover:underline" href={'tel:'+siteInfo.phone.replace(/\s+/g,'')}>{siteInfo.phone}</a></span>}</p>{children}</Card>;
export const Apply=()=><Page title={editableCopy["page-title-membership"]} sub={editableCopy["page-introduction-join-ihrc-usa-and-stand-for-human-dignity"]}>
<div className="grid gap-6 md:grid-cols-3"><div className="space-y-6 md:col-span-2"><Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-introduction"]}</h2><p className="mt-2 text-slate-700">{editableCopy["text-ihrc-usa-seeks-to-bring-together-individuals-volunteers-professio"]}</p><div className="mt-3"><Btn to="/membership-benefits" alt>{editableCopy["text-view-membership-benefits"]}</Btn></div></Card>
<Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-membership-information"]}</h2><p className="mt-2 text-slate-700">{editableCopy["text-membership-categories-eligibility-and-any-fees"]+" "}<Pending/></p></Card>
<RegistrationForm spec={forms.membership||membershipForm}/></div>
<div><Info/></div></div></Page>;
export const Volunteer=()=><Page title={editableCopy["page-title-volunteer"]} sub={editableCopy["page-introduction-give-your-time-to-protect-human-rights"]}>
<div className="grid gap-6 md:grid-cols-3"><div className="space-y-6 md:col-span-2"><Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-introduction"]}</h2><p className="mt-2 text-slate-700">{editableCopy["text-volunteers-are-at-the-heart-of-our-community-work-join-us-in-prom"]}</p></Card>
<Card><h2 className="font-serif text-xl font-bold text-navy">{editableCopy["text-opportunities"]}</h2><p className="mt-2 text-slate-700">{editableCopy["text-volunteers-can-support-our-work-in-these-areas"]}</p><ul className="mt-2 grid gap-1 sm:grid-cols-2">{areas.map(a=><li key={a} className="flex gap-2 text-slate-700"><span className="text-brand">•</span>{a}</li>)}</ul></Card>
<RegistrationForm spec={forms.volunteer||volunteerForm}/></div>
<div><Info/></div></div></Page>;
const contactTeams={'General enquiry':'IHRC-USA Website Enquiry','News / media':'News enquiry','Official correspondence':'Official message','Secretary':'Message to the Secretary','Chairman':'Message to the Chairman'};
export const Contact=()=>{const s=socialLinks();const[team,setTeam]=useState('General enquiry');return <Page title={editableCopy["page-title-contact-ihrc-usa"]} sub={editableCopy["page-introduction-we-d-love-to-hear-from-you"]}><div className="grid gap-6 md:grid-cols-3"><Card cls="md:col-span-2"><h2 className="mb-4 font-serif text-xl font-bold text-navy">{editableCopy["text-contact-form"]}</h2><label className="mb-4 block text-sm font-medium">{editableCopy["text-enquiry-type"]}<select value={team} onChange={e=>setTeam(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5">{Object.keys(contactTeams).map(name=><option key={name}>{name}</option>)}</select></label><Form button="Send Message" subject={contactTeams[team]} fields={[{n:'name',label:'Name',req:1},{n:'email',label:'Email',type:'email',req:1},{n:'country',label:'Country',req:1},{n:'subject',label:'Subject',req:1},{n:'msg',label:'Message',type:'textarea',req:1}]}/></Card>
<div className="space-y-4"><Card><h3 className="font-bold text-navy">{editableCopy["text-general-enquiries"]}</h3><p className="mt-1 text-sm"><a className="text-brand hover:underline" href={'mailto:'+siteInfo.email}>{siteInfo.email}</a></p><h3 className="mt-4 font-bold text-navy">{editableCopy["text-office-1"]}</h3><p className="mt-1 text-sm">{siteInfo.phone?<a className="text-brand hover:underline" href={'tel:'+siteInfo.phone.replace(/\s+/g,'')}>{siteInfo.phone}</a>:<Pending/>}</p>{siteInfo.whatsappLink&&<><h3 className="mt-4 font-bold text-navy">{editableCopy["text-whatsapp"]}</h3><p className="mt-2"><a href={siteInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-semibold text-white shadow hover:opacity-90">{socialIcon('whatsapp',18)}{editableCopy["text-whatsapp"]}</a></p></>}{siteInfo.whatsappChannel&&<><h3 className="mt-4 font-bold text-navy">{editableCopy["text-whatsapp-channel"]}</h3><p className="mt-1 text-sm"><a className="text-brand hover:underline" href={siteInfo.whatsappChannel} target="_blank" rel="noopener noreferrer">{editableCopy["text-join-our-whatsapp-channel"]}</a></p></>}<h3 className="mt-4 font-bold text-navy">{editableCopy["text-social-media"]}</h3><p className="mt-1 flex flex-wrap gap-3 text-sm">{s.length?<span className="mt-2 flex flex-wrap gap-2">{s.map(([n,u])=><a key={n} href={u} target="_blank" rel="noopener noreferrer" aria-label={n} title={n} className="grid h-9 w-9 place-items-center rounded-full text-white ring-1 ring-white/30 transition hover:scale-110" style={socialBg(n)}>{socialIcon(n)}</a>)}</span>:<Pending/>}</p></Card>
<Card cls="bg-blue-50"><h3 className="font-bold text-navy">{editableCopy["text-report-a-human-rights-concern"]}</h3><p className="mt-1 text-sm text-slate-600">{editableCopy["text-use-our-separate-confidential-form"]}</p><div className="mt-3"><Btn to="/report-concern">{editableCopy["text-report-a-concern"]}</Btn></div></Card></div></div></Page>};

// Query parameters preserve member IDs containing slashes on shared hosting.
export const Verify=()=>{const[id,setId]=useState('');const[r,setR]=useState(null);const[busy,setBusy]=useState(false);
const go=async e=>{e.preventDefault();const x=id.trim().toUpperCase();if(!x)return setR('empty');
 if(!API_URL){setR(members.find(m=>m.id===x)||'none');return}
 setBusy(true);try{const res=await fetch(API_URL+'/api/verify?'+new URLSearchParams({memberId:x}),{headers:{Accept:'application/json'}});
  if(res.status===429)setR('busy');else{const result=await res.json();if(res.status===404&&result.found===false)setR('none');else if(!res.ok||result.found!==true)setR('error');else setR(result)}}catch(err){setR('error')}finally{setBusy(false)}};
const ok=r&&typeof r==='object'&&r.status==='Active';
return <Page title={editableCopy["page-title-verify-member"]} sub={editableCopy["page-introduction-enter-a-member-id-for-example-ihrc-m-00012-to-check-membership-st"]}><Card><form onSubmit={go} className="flex flex-col gap-3 sm:flex-row"><input value={id} onChange={e=>setId(e.target.value)} placeholder="Enter member ID" aria-label="Member ID" className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5"/>
<button disabled={busy} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-navy px-6 font-semibold text-white hover:bg-brand disabled:opacity-60"><Search size={16}/>{busy?'Checking…':'Verify'}</button></form>
{r==='empty'&&<p className="mt-4 text-sm text-red-600">{editableCopy["text-please-enter-a-member-id"]}</p>}
{r==='none'&&<p className="mt-4 flex items-center gap-2 text-red-700"><XCircle/>{editableCopy["text-no-member-found-for-this-id"]}</p>}
{r==='busy'&&<p className="mt-4 text-sm text-red-600">{editableCopy["text-too-many-checks-please-wait-a-minute-and-try-again"]}</p>}
{r==='error'&&<p className="mt-4 text-sm text-red-600">{editableCopy["text-verification-is-not-available-right-now-please-try-again-later"]}</p>}
{r&&typeof r==='object'&&<div className={'mt-4 flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center '+(ok?'bg-green-50':'bg-amber-50')}>
{r.photo&&<img src={r.photo} alt={r.name} className="h-24 w-24 shrink-0 rounded-full object-cover"/>}
<div className="flex-1"><p className={'flex items-center gap-2 font-bold '+(ok?'text-green-700':'text-amber-700')}>{ok?<BadgeCheck/>:<XCircle/>}{r.status}{" "+editableCopy["text-member"]}</p>
<dl className="mt-2 grid grid-cols-[7rem_1fr] gap-1 text-sm"><dt className="text-slate-500">{editableCopy["text-member-id"]}</dt><dd className="font-mono">{r.memberId||r.id}</dd><dt className="text-slate-500">Name</dt><dd>{r.name}</dd><dt className="text-slate-500">{editableCopy["text-title"]}</dt><dd>{r.title||r.role||'—'}</dd>{r.country&&<><dt className="text-slate-500">{editableCopy["text-country"]}</dt><dd>{r.country}</dd></>}</dl></div></div>}</Card></Page>};
