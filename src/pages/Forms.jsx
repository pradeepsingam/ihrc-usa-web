import {useState} from 'react';
import {BadgeCheck,XCircle,Search} from 'lucide-react';
import {members} from '../data';
import {Page,Card,Form} from '../components/UI';

const base=[{n:'name',label:'Full name',req:1},{n:'email',label:'Email',type:'email',req:1},{n:'phone',label:'Phone',type:'tel',req:1}];
export const Apply=()=><Page img="26" title="Apply for Membership" sub="Join the International Human Rights Council–USA."><Card><Form button="Submit Application" fields={[...base,{n:'nic',label:'ID number',req:1},{n:'type',label:'Membership type',req:1,opts:['Individual','Student','Organisation']},{n:'why',label:'Why do you want to join?',type:'textarea',req:1}]}/></Card></Page>;
export const Volunteer=()=><Page img="27" title="Volunteer" sub="Give your time to protect human rights."><Card><Form button="Register Interest" fields={[...base,{n:'area',label:'Area of interest',req:1,opts:['Education','Legal clinics','Humanitarian relief','Events']},{n:'note',label:'Availability',type:'textarea'}]}/></Card></Page>;
export const Contact=()=><Page img="29" title="Contact IHRC–USA" sub="We’d love to hear from you."><div className="grid gap-6 md:grid-cols-3"><Card cls="md:col-span-2"><h2 className="mb-4 font-serif text-xl font-bold text-navy">Contact Form</h2><Form button="Send Message" subject="IHRC–USA Website Enquiry" fields={[{n:'name',label:'Name',req:1},{n:'email',label:'Email',type:'email',req:1},{n:'country',label:'Country',req:1},{n:'subject',label:'Subject',req:1},{n:'msg',label:'Message',type:'textarea',req:1}]}/></Card>
<Card><h3 className="font-bold text-navy">General Enquiries</h3><p className="mt-1 text-sm"><a className="text-brand hover:underline" href="mailto:globalihrc@gmail.com">globalihrc@gmail.com</a></p><h3 className="mt-4 font-bold text-navy">WhatsApp</h3><p className="mt-1 text-sm"><a className="text-brand hover:underline" href="https://wa.me/94711010031" target="_blank" rel="noopener noreferrer">+94 71 101 0031</a></p><h3 className="mt-4 font-bold text-navy">Facebook</h3><p className="mt-1 text-sm text-slate-600">IHRC–USA</p></Card></div></Page>;

export const Verify=()=>{const[id,setId]=useState('');const[r,setR]=useState(null);
const go=e=>{e.preventDefault();const x=id.trim().toUpperCase();if(!x)return setR('empty');setR(members.find(m=>m.id===x)||'none')};
return <Page img="30" title="Verify Member" sub="Enter a member ID to check membership status."><Card><form onSubmit={go} className="flex flex-col gap-3 sm:flex-row"><input value={id} onChange={e=>setId(e.target.value)} placeholder="Enter member ID" aria-label="Member ID" className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5"/>
<button className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-navy px-6 font-semibold text-white hover:bg-brand"><Search size={16}/>Verify</button></form>
{r==='empty'&&<p className="mt-4 text-sm text-red-600">Please enter a member ID.</p>}
{r==='none'&&<p className="mt-4 flex items-center gap-2 text-red-700"><XCircle/>No member found for this ID.</p>}
{r&&typeof r==='object'&&<div className="mt-4 rounded-lg bg-blue-50 p-4"><p className={'flex items-center gap-2 font-bold '+(r.status==='Active'?'text-green-700':'text-amber-700')}><BadgeCheck/>{r.status} member</p>
<dl className="mt-2 grid grid-cols-2 gap-1 text-sm"><dt className="text-slate-500">Name</dt><dd>{r.name}</dd><dt className="text-slate-500">Role</dt><dd>{r.role}</dd><dt className="text-slate-500">Member since</dt><dd>{r.since}</dd></dl></div>}</Card></Page>};
