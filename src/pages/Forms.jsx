import {useState} from 'react';
import {BadgeCheck,XCircle,Search} from 'lucide-react';
import {members} from '../data';
import {siteInfo} from '../content';
import {Btn,Pending} from '../components/UI';
import {Page,Card,Form} from '../components/UI';
import RegistrationForm from '../components/RegistrationForm';
import {membershipForm,volunteerForm} from '../data/registrationForms';

const areas=['Education & Awareness','Health & Welfare','Rights & Empowerment','Justice & Governance','Environment'];
const Info=({children})=><Card><h3 className="font-bold text-navy">Contact</h3><p className="mt-2 space-y-1 text-sm text-slate-600"><span className="block">Email: <a className="text-brand hover:underline" href={'mailto:'+siteInfo.email}>{siteInfo.email}</a></span>{siteInfo.phone&&<span className="block">Office: <a className="text-brand hover:underline" href={'tel:'+siteInfo.phone.replace(/\s+/g,'')}>{siteInfo.phone}</a></span>}{siteInfo.whatsapp&&<span className="block">WhatsApp: <a className="text-brand hover:underline" href={siteInfo.whatsappLink} target="_blank" rel="noopener noreferrer">{siteInfo.whatsapp}</a></span>}{siteInfo.address&&<span className="block">Address: {siteInfo.address}</span>}</p>{children}</Card>;
export const Apply=()=><Page title="Membership" sub="Join IHRC-USA and stand for human dignity.">
<div className="grid gap-6 md:grid-cols-3"><div className="space-y-6 md:col-span-2"><Card><h2 className="font-serif text-xl font-bold text-navy">Introduction</h2><p className="mt-2 text-slate-700">IHRC-USA seeks to bring together individuals, volunteers, professionals, community leaders and organizations who share a commitment to human dignity and social responsibility.</p><div className="mt-3"><Btn to="/membership-benefits" alt>View Membership Benefits</Btn></div></Card>
<Card><h2 className="font-serif text-xl font-bold text-navy">Membership Information</h2><p className="mt-2 text-slate-700">Membership categories, eligibility and any fees: <Pending/></p></Card>
<RegistrationForm spec={membershipForm}/></div>
<div><Info/></div></div></Page>;
export const Volunteer=()=><Page title="Volunteer" sub="Give your time to protect human rights.">
<div className="grid gap-6 md:grid-cols-3"><div className="space-y-6 md:col-span-2"><Card><h2 className="font-serif text-xl font-bold text-navy">Introduction</h2><p className="mt-2 text-slate-700">Volunteers are at the heart of our community work. Join us in promoting human rights awareness, education, humanitarian service and community participation.</p></Card>
<Card><h2 className="font-serif text-xl font-bold text-navy">Opportunities</h2><p className="mt-2 text-slate-700">Volunteers can support our work in these areas:</p><ul className="mt-2 grid gap-1 sm:grid-cols-2">{areas.map(a=><li key={a} className="flex gap-2 text-slate-700"><span className="text-brand">•</span>{a}</li>)}</ul></Card>
<RegistrationForm spec={volunteerForm}/></div>
<div><Info/></div></div></Page>;
export const Contact=()=>{const s=Object.entries(siteInfo.social).filter(([,u])=>u);return <Page title="Contact IHRC-USA" sub="We’d love to hear from you."><div className="grid gap-6 md:grid-cols-3"><Card cls="md:col-span-2"><h2 className="mb-4 font-serif text-xl font-bold text-navy">Contact Form</h2><Form button="Send Message" subject="IHRC-USA Website Enquiry" fields={[{n:'name',label:'Name',req:1},{n:'email',label:'Email',type:'email',req:1},{n:'country',label:'Country',req:1},{n:'subject',label:'Subject',req:1},{n:'msg',label:'Message',type:'textarea',req:1}]}/></Card>
<div className="space-y-4"><Card><h3 className="font-bold text-navy">General Enquiries</h3><p className="mt-1 text-sm"><a className="text-brand hover:underline" href={'mailto:'+siteInfo.email}>{siteInfo.email}</a></p><h3 className="mt-4 font-bold text-navy">Office</h3><p className="mt-1 text-sm">{siteInfo.phone?<a className="text-brand hover:underline" href={'tel:'+siteInfo.phone.replace(/\s+/g,'')}>{siteInfo.phone}</a>:<Pending/>}</p>{siteInfo.whatsapp&&<><h3 className="mt-4 font-bold text-navy">WhatsApp</h3><p className="mt-1 text-sm"><a className="text-brand hover:underline" href={siteInfo.whatsappLink} target="_blank" rel="noopener noreferrer">{siteInfo.whatsapp}</a></p></>}<h3 className="mt-4 font-bold text-navy">Office Address</h3><p className="mt-1 text-sm text-slate-700">{siteInfo.address||<Pending/>}</p><h3 className="mt-4 font-bold text-navy">Social Media</h3><p className="mt-1 flex flex-wrap gap-3 text-sm">{s.length?s.map(([n,u])=><a key={n} className="capitalize text-brand hover:underline" href={u} target="_blank" rel="noopener noreferrer">{n}</a>):<Pending/>}</p></Card>
{siteInfo.mapUrl&&<Card><h3 className="mb-2 font-bold text-navy">Office Location</h3><a className="text-sm text-brand hover:underline" href={siteInfo.mapUrl} target="_blank" rel="noopener noreferrer">View on map</a></Card>}
<Card cls="bg-blue-50"><h3 className="font-bold text-navy">Report a Human Rights Concern</h3><p className="mt-1 text-sm text-slate-600">Use our separate confidential form.</p><div className="mt-3"><Btn to="/report-concern">Report a Concern</Btn></div></Card></div></div></Page>};

export const Verify=()=>{const[id,setId]=useState('');const[r,setR]=useState(null);
const go=e=>{e.preventDefault();const x=id.trim().toUpperCase();if(!x)return setR('empty');setR(members.find(m=>m.id===x)||'none')};
return <Page title="Verify Member" sub="Enter a member ID to check membership status. Online verification records are being prepared."><Card><form onSubmit={go} className="flex flex-col gap-3 sm:flex-row"><input value={id} onChange={e=>setId(e.target.value)} placeholder="Enter member ID" aria-label="Member ID" className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5"/>
<button className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-navy px-6 font-semibold text-white hover:bg-brand"><Search size={16}/>Verify</button></form>
{r==='empty'&&<p className="mt-4 text-sm text-red-600">Please enter a member ID.</p>}
{r==='none'&&<p className="mt-4 flex items-center gap-2 text-red-700"><XCircle/>No member found for this ID.</p>}
{r&&typeof r==='object'&&<div className="mt-4 rounded-lg bg-blue-50 p-4"><p className={'flex items-center gap-2 font-bold '+(r.status==='Active'?'text-green-700':'text-amber-700')}><BadgeCheck/>{r.status} member</p>
<dl className="mt-2 grid grid-cols-2 gap-1 text-sm"><dt className="text-slate-500">Name</dt><dd>{r.name}</dd><dt className="text-slate-500">Role</dt><dd>{r.role}</dd><dt className="text-slate-500">Member since</dt><dd>{r.since}</dd></dl></div>}</Card></Page>};
