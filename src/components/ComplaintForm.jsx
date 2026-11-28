import RegistrationForm from './RegistrationForm';
import {complaintSteps as steps} from '../data/complaintFields';
import {managed} from '../lib/managedContent';
import {useState,useRef} from 'react';
import {AlertCircle,CheckCircle2,Copy,Download,Mail,ChevronLeft,ChevronRight,Pencil,ShieldAlert,Send} from 'lucide-react';
import {siteInfo,forms} from '../content';
import {FORM_ENDPOINT} from '../config';
import {submitForm} from '../lib/submitForm';
import {Reference} from './UI';

// Change this one line to rename the organization everywhere in the form text.
export const ORG='IHRC-USA';

// ---------- Text shown on the Report a Concern page (from the official complaint form document) ----------
export const complaintInfo=managed("ComplaintForm.complaintInfo","Complaint Info",'Website content',{
intro:[
ORG+' provides this complaint submission form as a channel for individuals who wish to report concerns, alleged misconduct, unfair treatment, harassment, discrimination, abuse, exploitation, or other matters affecting their rights, dignity, safety, or well-being.',
'This form is intended for individuals who have experienced harm or believe they have been affected by the actions, conduct, decisions, or omissions of another person, organization, institution, company, or other entity.',
'Every complaint should be treated respectfully, confidentially, impartially, and with appropriate care.'],
notice:[
'Submitting a complaint does not automatically establish that an allegation is true.',
ORG+' may review submissions within its organizational mandate and available capacity.',
'Submission of this form does not constitute a police report, court filing, or formal legal proceeding.',
ORG+' does not replace police, courts, government authorities, emergency services, or qualified legal professionals.',
'If someone is in immediate danger, contact the appropriate local emergency services or law-enforcement authority without waiting for a response to this form.'],
who:[
'Individuals who have personally experienced alleged misconduct or unfair treatment.',
'Individuals affected by the actions of another person.',
'Employees or former employees reporting workplace-related concerns.',
'Students or parents reporting concerns involving educational institutions.',
'Individuals reporting alleged discrimination, harassment, or exploitation.',
'Individuals affected by the conduct of an organization or institution.',
'Family members or authorized representatives submitting a complaint on behalf of an affected person, where appropriate.',
"Witnesses reporting concerns with the affected person's knowledge or where permitted by applicable procedures."],
types:[
'Human rights violations and concerns.','Discrimination and unequal treatment.','Harassment, intimidation, and bullying.','Workplace misconduct and unfair treatment.','Abuse of authority or position.','Alleged exploitation or coercion.','Child protection and safeguarding concerns.',"Women's rights and gender-based discrimination.",'Educational institution-related complaints.','Organizational misconduct.','Community-related disputes involving rights or dignity.','Alleged fraud or misleading conduct.','Other matters involving human dignity, equality, safety, or welfare.'],
outside:"Complaints outside the organization's mandate may be referred to an appropriate authority where lawful and suitable.",
declaration:[
'I confirm that the information provided in this complaint is accurate to the best of my knowledge.',
'I understand that submitting a complaint does not automatically establish that the allegations are proven.',
'I understand that '+ORG+' may review the information within its organizational mandate and available capacity.',
'I understand that '+ORG+' is not a court, police authority, or government enforcement agency.',
'I understand that further information may be requested where appropriate.',
'I understand that confidentiality will be handled in accordance with applicable privacy requirements and organizational policies, but absolute confidentiality cannot be guaranteed in every circumstance.',
'I confirm that I am authorized to provide the information submitted, where I am acting on behalf of another person.']});

// ---------- Form definition: Sections A–I, questions numbered as in the document ----------
const today=()=>new Date().toISOString().slice(0,10);
const rules={email:/^\S+@\S+\.\S+$/,tel:/^\+?[\d\s()-]{7,20}$/};
const visible=(s,v)=>s.fields.filter(x=>!x.when||x.when(v));
const empty=(x,v)=>{const a=v[x.n];return x.type==='checks'?!(a&&a.length):x.type==='consent'?!a:!String(a||'').trim()};
const validate=(s,v)=>{const e={};visible(s,v).forEach(x=>{const a=String(v[x.n]||'').trim();
if(x.req&&empty(x,v))e[x.n]=x.type==='consent'?'This confirmation is required':x.type==='checks'||x.type==='radio'||x.type==='select'?'Please choose an option':'This field is required';
else if(a&&rules[x.type]&&!rules[x.type].test(a))e[x.n]='Enter a valid '+(x.type==='tel'?'phone number':'email address')});return e};

const ans=(x,v)=>{const a=v[x.n];if(x.type==='checks'){const l=(a||[]).map(o=>o==='Other'&&(v[x.n+'Other']||'').trim()?'Other: '+v[x.n+'Other'].trim():o);return l.join('; ')}
if(x.type==='consent')return a?'Yes – confirmed':'';
let s=String(a||'').trim();if(s==='Other'&&(v[x.n+'Other']||'').trim())s='Other: '+v[x.n+'Other'].trim();return s};
// Answers as [{label, value}] for the backend (one entry per answered question).
const buildFields=v=>steps.flatMap(s=>visible(s,v).map(x=>({label:'Section '+s.id+(x.no?' · '+x.no:'')+'. '+(x.group?x.group+' – ':'')+x.label,value:ans(x,v)})).filter(f=>f.value));
export const buildText=v=>{const out=['COMPLAINT SUBMISSION – '+ORG,'Submitted via website on: '+today(),''];
steps.forEach(s=>{const lines=visible(s,v).map(x=>[x,ans(x,v)]).filter(([,a])=>a).map(([x,a])=>(x.no?x.no+'. ':'')+x.label+(/[?:.]$/.test(x.label)?'':':')+'\n   '+a.replace(/\n/g,'\n   '));
if(lines.length){out.push('SECTION '+s.id+' – '+s.title.toUpperCase(),...lines,'')}});
return out.join('\n').trim()};

// ---------- Component ----------
const inp=(err)=>'mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand '+(err?'border-red-400':'border-slate-300');
const btn='inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition ';
const primary=btn+'bg-navy text-white hover:bg-brand',ghost=btn+'border-2 border-navy text-navy hover:bg-navy hover:text-white';

function Field({x,v,set,err}){
const id='cf-'+x.n,label=<>{x.label}{x.req&&<span aria-hidden="true"> *</span>}</>;
const hint=x.hint&&<span className="block text-xs font-normal text-slate-500">{x.hint}</span>;
const msg=err&&<span role="alert" className="mt-1 block text-xs text-red-600">{err}</span>;
const other=(on)=>on&&<input aria-label={x.label+' – please specify'} placeholder="Please specify" value={v[x.n+'Other']||''} onChange={e=>set(x.n+'Other',e.target.value)} className={inp(false)}/>;
if(x.type==='radio'||x.type==='checks'){const multi=x.type==='checks',cur=v[x.n]||(multi?[]:'');
const toggle=o=>set(x.n,multi?(cur.includes(o)?cur.filter(i=>i!==o):[...cur,o]):o);
return <fieldset data-err={err?1:undefined} className="sm:col-span-2"><legend className="text-sm font-medium">{x.no&&<span className="mr-1 text-slate-400">{x.no}.</span>}{label}</legend>{hint}
<div className="mt-2 grid gap-2 sm:grid-cols-2">{x.opts.map(o=><label key={o} className={'flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm '+((multi?cur.includes(o):cur===o)?'border-brand bg-blue-50':'border-slate-200 bg-white hover:bg-slate-50')}>
<input type={multi?'checkbox':'radio'} name={id} checked={multi?cur.includes(o):cur===o} onChange={()=>toggle(o)} className="h-4 w-4 accent-[#1d4ed8]"/><span>{o}</span></label>)}</div>
{x.other&&(multi?cur.includes('Other'):cur==='Other')&&<div className="mt-2">{other(true)}</div>}{msg}</fieldset>}
if(x.type==='consent')return <div data-err={err?1:undefined} className="sm:col-span-2"><p className="text-sm font-semibold text-navy"><span className="mr-1 text-slate-400">{x.no}.</span>{x.group} <span aria-hidden="true">*</span></p>
<label className="mt-2 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"><input type="checkbox" checked={!!v[x.n]} onChange={e=>set(x.n,e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1d4ed8]"/><span>{x.label}</span></label>{msg}</div>;
const wide=x.type==='textarea';
return <div data-err={err?1:undefined} className={wide?'sm:col-span-2':''}><label htmlFor={id} className="block text-sm font-medium">{x.no&&<span className="mr-1 text-slate-400">{x.no}.</span>}{label}</label>{hint}
{x.type==='select'?<select id={id} value={v[x.n]||''} onChange={e=>set(x.n,e.target.value)} className={inp(err)}><option value="">Select…</option>{x.opts.map(o=><option key={o}>{o}</option>)}</select>
:wide?<textarea id={id} rows={x.rows||4} value={v[x.n]||''} onChange={e=>set(x.n,e.target.value)} className={inp(err)}/>
:<input id={id} type={x.type} value={v[x.n]||''} aria-invalid={!!err} onChange={e=>set(x.n,e.target.value)} max={x.type==='date'?today():undefined} className={inp(err)}/>}{msg}</div>}

function LegacyComplaintForm(){
const[v,setV]=useState({submitDate:today()});const[step,setStep]=useState(0);const[err,setErr]=useState({});const[review,setReview]=useState(false);const[status,setStatus]=useState('');const[sent,setSent]=useState(false);const[busy,setBusy]=useState(false);const[sendErr,setSendErr]=useState('');
const top=useRef(null);const set=(n,x)=>setV(p=>({...p,[n]:x}));
const go=i=>{setStep(i);setErr({});setReview(false);setTimeout(()=>top.current&&top.current.scrollIntoView({behavior:'smooth',block:'start'}),0)};
const s=steps[step],last=step===steps.length-1;
const next=()=>{const e=validate(s,v);setErr(e);if(Object.keys(e).length){setTimeout(()=>{const el=top.current&&top.current.querySelector('[data-err]');el&&el.scrollIntoView({behavior:'smooth',block:'center'})},0);return}
if(last){setReview(true);setStatus('');setTimeout(()=>top.current&&top.current.scrollIntoView({behavior:'smooth',block:'start'}),0)}else go(step+1)};
const text=buildText(v);const subject='Complaint Submission – '+(v.name||'').trim();
const copy=async()=>{try{await navigator.clipboard.writeText(text);return true}catch{return false}};
const send=async()=>{setBusy(true);setSendErr('');try{await submitForm({form:'Complaint Submission',subject,to:siteInfo.email,fields:buildFields(v)});setSent(true);setTimeout(()=>top.current&&top.current.scrollIntoView({behavior:'smooth',block:'start'}),0)}catch(e){setSendErr(e.userMessage||'Sorry, your complaint could not be sent. Please try again, or use one of the options below to email it to '+siteInfo.email+'.')}finally{setBusy(false)}};
const doCopy=async()=>setStatus(await copy()?'Complaint text copied. You can paste it into an email or message.':'Copying was blocked by your browser. Please use “Download as text file” instead.');
const download=()=>{const b=new Blob([text],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='complaint-submission.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);setStatus('Downloaded to your device. Attach it to an email to '+siteInfo.email+'.')};
const openMail=async()=>{const full='mailto:'+siteInfo.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(text);
if(full.length<=1800){window.location.href=full;setStatus('Your email app should now be open. Nothing is sent until you press Send there.');return}
const ok=await copy();window.location.href='mailto:'+siteInfo.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent('Please paste my complaint here (Ctrl+V / paste). If nothing was copied, attach the downloaded text file instead.');
setStatus((ok?'Your complaint is long, so it was copied to your clipboard. Paste it into the email body.':'Your complaint is too long for an email link. Download the text file and attach it to the email.')+' Nothing is sent until you press Send in your email app.')};

if(sent)return <div ref={top} role="status" className="scroll-mt-24 rounded-xl bg-green-50 p-6 text-center text-green-800"><CheckCircle2 className="mx-auto mb-2"/><p className="font-semibold">Your complaint has been submitted to {ORG}.</p><p className="mt-1 text-sm">It will be reviewed confidentially. We will contact you using the details you provided.</p><Reference/>{v.danger==='Yes'&&<p className="mt-3 text-sm text-red-800">If someone is in immediate danger, contact your local emergency services or police now.</p>}<button type="button" onClick={()=>{setV({submitDate:today()});setSent(false);setReview(false);setStep(0)}} className="mt-3 text-sm font-semibold underline">Submit another complaint</button></div>;
if(review)return <div ref={top} className="scroll-mt-24">
<h3 className="font-serif text-xl font-bold text-navy">Review your complaint</h3>
<p className="mt-1 text-sm text-slate-600">Check your answers. Your complaint has <b>not</b> been sent yet.{FORM_ENDPOINT?' Press “Submit complaint” to send it securely to '+ORG+'.':' This website does not store your answers.'}</p>
{v.danger==='Yes'&&<div role="alert" className="mt-4 flex gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800"><ShieldAlert className="shrink-0"/><p>You said someone is currently in danger. Please contact your local emergency services or police now, without waiting for a reply to this form.</p></div>}
<pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 ring-1 ring-slate-200">{text}</pre>
{sendErr&&<p role="alert" className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18}/>{sendErr}</p>}
<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{FORM_ENDPOINT&&<button type="button" onClick={send} disabled={busy} className={primary+'disabled:opacity-60'}><Send size={16}/>{busy?'Sending…':'Submit complaint'}</button>}<button type="button" onClick={openMail} className={FORM_ENDPOINT?ghost:primary}><Mail size={16}/>Open email draft</button><button type="button" onClick={doCopy} className={ghost}><Copy size={16}/>Copy complaint text</button><button type="button" onClick={download} className={ghost}><Download size={16}/>Download as text file</button><button type="button" onClick={()=>go(0)} className={ghost}><Pencil size={16}/>Edit answers</button></div>
{status&&<p role="status" className="mt-4 flex gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0"/>{status}</p>}
<p className="mt-4 text-xs text-slate-500">Safety tip: if another person can read your email, phone or computer, consider using a device and account only you can access.</p></div>;

const pct=Math.round((step+1)/steps.length*100);
return <div ref={top} className="scroll-mt-24">
<div className="mb-5"><div className="flex items-center justify-between text-sm"><p className="font-semibold text-navy">Section {s.id} of {steps[steps.length-1].id}: {s.title}</p><p className="text-slate-500">Step {step+1} / {steps.length}</p></div>
<div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step+1}><div className="h-full rounded-full bg-brand transition-all" style={{width:pct+'%'}}/></div>
<p className="mt-2 text-xs text-slate-500">Fields marked * are required.</p></div>
{Object.keys(err).length>0&&<div role="alert" className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18}/>Please correct the highlighted fields and try again.</div>}
{s.id==='H'&&v.danger==='Yes'&&<div role="alert" className="mb-4 flex gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800"><ShieldAlert className="shrink-0"/><p>If someone is in immediate danger, contact your local emergency services or police now. Do not wait for a response to this form.</p></div>}
{s.id==='I'&&<div className="mb-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200"><p className="font-semibold text-navy">Please read the following statements carefully.</p><ul className="mt-2 list-disc space-y-1 pl-5">{complaintInfo.declaration.map(d=><li key={d}>{d}</li>)}</ul></div>}
<div className="grid gap-4 sm:grid-cols-2">{visible(s,v).map(x=><Field key={x.n} x={x} v={v} set={set} err={err[x.n]}/>)}</div>
<div className="mt-6 flex items-center justify-between gap-3"><button type="button" onClick={()=>go(step-1)} disabled={step===0} className={ghost+'disabled:invisible'}><ChevronLeft size={16}/>Back</button>
<button type="button" onClick={next} className={primary}>{last?'Review complaint':'Next'}<ChevronRight size={16}/></button></div></div>}

export default function ComplaintForm(){return Object.hasOwn(forms,'complaint')?(forms.complaint?.published===false?<p>This form is currently unavailable.</p>:<RegistrationForm spec={forms.complaint}/>):<LegacyComplaintForm/>;}
