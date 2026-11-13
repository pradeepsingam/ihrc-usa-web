import {useState} from 'react';
import {Mail,FileText,Paperclip,AlertCircle,CheckCircle2} from 'lucide-react';
import {Page,Card,Accordion,Btn} from '../components/UI';
import {submitForm} from '../lib/submitForm';
import {partnershipMeta as meta,partnershipSections as sections,formattingRules,allQuestionItems} from '../data/partnershipForm';

const rules={email:/^\S+@\S+\.\S+$/,tel:/^\+?[\d\s()-]{7,20}$/,url:/^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/i};
const fmtDate=d=>{const x=new Date(d+'T00:00:00');return isNaN(x)?d:x.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})};
const isAllCaps=s=>{const t=s.trim();return t.length>5&&/[A-Z]/.test(t)&&t===t.toUpperCase()};

// every input in the form, flattened: [{key,label,type,req,parent}]
const fields=allQuestionItems.flatMap(q=>q.fileOnly?[]:q.parts?q.parts.map(p=>({...p,parent:q})):[{...q,parent:q}]);

const Input=({f,v,e,set})=>{
  const cl='mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand '+(e[f.id]?'border-red-400':'border-slate-300');
  const common={id:'pa-'+f.id,value:v[f.id]||'',onChange:x=>set(f.id,x.target.value),'aria-invalid':!!e[f.id],className:cl};
  return f.type==='textarea'?<textarea rows={5} {...common}/>:<input type={f.type==='url'?'text':f.type||'text'} inputMode={f.type==='url'?'url':undefined} {...common}/>;
};

export default function PartnershipApplication(){
  const[v,setV]=useState({});const[e,setE]=useState({});const[agree,setAgree]=useState(false);const[done,setDone]=useState(false);const[busy,setBusy]=useState(false);const[sendErr,setSendErr]=useState('');
  const set=(id,x)=>{setV(p=>({...p,[id]:x}));if(e[id])setE(p=>{const n={...p};delete n[id];return n})};

  const validate=()=>{
    const er={};
    fields.forEach(f=>{
      const x=(v[f.id]||'').trim();
      const required=f.req;
      if(required&&!x)er[f.id]='This field is required';
      else if(x&&rules[f.type]&&!rules[f.type].test(x))er[f.id]='Enter a valid '+(f.type==='tel'?'phone number':f.type==='url'?'website address':f.type);
    });
    if(!['orgTel','orgFax','orgEmail','orgWeb'].some(k=>(v[k]||'').trim()))er.orgTel='Please give at least one organization contact (telephone, fax, email or website).';
    if(!er.ngoName&&isAllCaps(v.ngoName||''))er.ngoName='Please do not write the organization name in all capital letters (formatting rule 6).';
    if(!agree)er.agree='Please accept the general formatting rules.';
    return er;
  };

  const submit=async ev=>{
    ev.preventDefault();setSendErr('');
    const er=validate();setE(er);
    if(Object.keys(er).length){const first=Object.keys(er)[0];const el=document.getElementById('pa-'+first)||document.getElementById('pa-agree');el&&el.scrollIntoView({behavior:'smooth',block:'center'});return}
    const flat=allQuestionItems.filter(q=>!q.fileOnly).flatMap(q=>q.parts?q.parts.map(p=>({label:q.n+'. '+q.label+' - '+p.label,value:v[p.id]})):[{label:(q.n?q.n+'. ':'')+q.label,value:q.type==='date'?fmtDate(v[q.id]||''):v[q.id]}]);
    setBusy(true);
    try{const m=await submitForm({form:'NGO Partnership Application',subject:'NGO Partnership Application – '+(v.ngoName||''),to:meta.email,fields:flat});setDone(m);window.scrollTo({top:0,behavior:'smooth'})}
    catch(x){setSendErr('Sorry, we could not send your application. Please try again, or email us at '+meta.email+'.')}
    finally{setBusy(false)}
  };

  const Label=({q,htmlFor})=><label htmlFor={htmlFor} className="block text-sm font-semibold text-navy">{q.n?<span className="mr-1">{q.n}.</span>:null}{q.label}{q.req&&<span className="text-red-600"> *</span>}</label>;
  const Err=({id})=>e[id]?<span role="alert" className="mt-1 block text-xs text-red-600">{e[id]}</span>:null;

  return <Page title="NGO Partnership Application" sub="Apply for CSO status with the Department of Social Affairs and Partnerships (DSAP).">
    <div className="space-y-6">
      {done&&<div role="status" className="rounded-xl bg-green-50 p-5 text-green-800"><div className="flex items-center gap-2 font-semibold"><CheckCircle2 size={20}/>{done==='api'?'Your application has been submitted.':'Your email app has opened.'}</div><p className="mt-2 text-sm">{done==='api'?'Thank you. ':done==='mailto-copy'?'Your answers were copied: paste them into the email body (Ctrl+V) and press Send. ':'Press Send in your email app to complete your application. '}Please also email your partnership request letter, logo and registration copy to <a className="font-semibold underline" href={'mailto:'+meta.email}>{meta.email}</a>.</p></div>}

      <Card>
        <p className="font-serif text-lg font-bold text-navy">{meta.org}</p>
        <p className="italic text-slate-600">“{meta.tagline}”</p>
        <p className="mt-3 text-sm text-slate-700">{meta.subtitle}.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={'mailto:'+meta.email} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-navy px-6 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"><Mail size={16}/>{meta.email}</a>
          <Btn to="/partnerships" alt>Back to Partnerships</Btn>
        </div>
        <p className="mt-3 text-xs text-slate-500">Fill in the form online below. Your answers are sent to the IHRC email address.</p>
      </Card>

      <section><h2 className="mb-3 border-l-4 border-brand pl-3 text-xl font-bold text-navy">General Formatting Rules</h2>
        <Accordion items={[['Read these 13 rules before you fill in the form',formattingRules.map((r,i)=>(i+1)+'. '+r).join('\n\n')]]}/></section>

      <form noValidate onSubmit={submit} className="space-y-6">
        {sendErr&&<div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18}/>{sendErr}</div>}
        {Object.keys(e).length>0&&<div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18}/>Please correct the highlighted fields and try again.</div>}
        {sections.map(s=><Card key={s.title}>
          <h2 className="mb-4 font-serif text-xl font-bold text-navy">{s.title}</h2>
          <div className="space-y-5">
            {s.items.map(q=><div key={q.id}>
              {q.parts?<fieldset><legend className="text-sm font-semibold text-navy">{q.n}. {q.label}{q.req&&<span className="text-red-600"> *</span>}</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">{q.parts.map(p=><div key={p.id}><label htmlFor={'pa-'+p.id} className="block text-sm font-medium text-slate-700">{p.label}{p.req&&<span className="text-red-600"> *</span>}</label><Input f={p} v={v} e={e} set={set}/><Err id={p.id}/></div>)}</div></fieldset>
              :q.fileOnly?<div><span className="block text-sm font-semibold text-navy">{q.n}. {q.label}{q.req&&<span className="text-red-600"> *</span>}</span>{q.hint&&<span className="block text-xs text-slate-500">{q.hint}</span>}</div>
              :<div><Label q={q} htmlFor={'pa-'+q.id}/>{q.hint&&<span className="block text-xs text-slate-500">{q.hint}</span>}<Input f={q} v={v} e={e} set={set}/><Err id={q.id}/></div>}
              {q.attach&&<p className="mt-2 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-slate-700"><Paperclip size={14} className="mt-0.5 shrink-0 text-brand"/><span>{q.fileOnly?'Attach to your email: ':'Attach to your email (if available): '}<b>{q.attach}</b>. Files cannot be uploaded on this page.</span></p>}
            </div>)}
          </div>
        </Card>)}

        <Card>
          <h2 className="mb-2 font-serif text-xl font-bold text-navy">F. General Formatting Rules</h2>
          <label htmlFor="pa-agree" className="flex items-start gap-3 text-sm text-slate-700"><input id="pa-agree" type="checkbox" checked={agree} onChange={x=>{setAgree(x.target.checked);if(x.target.checked)setE(p=>{const n={...p};delete n.agree;return n})}} className="mt-1 h-4 w-4"/><span>I Agree to the 13 general formatting rules above. <span className="text-red-600">*</span></span></label>
          <Err id="agree"/>
          <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-600"><FileText size={14} className="mr-1 inline"/>When you press the button, your application is sent to <b>{meta.email}</b>. Please also email the required documents (letter, logo, registration copy) to the same address.</div>
          <button disabled={busy} className="mt-4 min-h-[48px] w-full rounded-full bg-navy px-8 font-semibold text-white hover:bg-brand disabled:opacity-60 sm:w-auto">{busy?'Sending…':'Submit Application'}</button>
        </Card>
      </form>
    </div>
  </Page>;
}
