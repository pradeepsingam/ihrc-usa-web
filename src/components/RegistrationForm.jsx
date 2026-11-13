import {useState} from 'react';
import {Paperclip,AlertCircle,CheckCircle2,Upload} from 'lucide-react';
import {Card} from './UI';
import {FORM_ENDPOINT} from '../config';
import {siteInfo} from '../content';
import {submitForm} from '../lib/submitForm';

const EXT={image:['jpg','jpeg','png','gif','webp','heic','bmp'],pdf:['pdf'],document:['pdf','doc','docx','odt','rtf','txt']};
const KIND_LABEL={image:'image',pdf:'PDF',document:'document'};
const phone=/^\+?[\d\s()-]{7,20}$/;
const mail=/^\S+@\S+\.\S+$/;
const ext=n=>(n.split('.').pop()||'').toLowerCase();
const fmtDate=d=>{const x=new Date(d+'T00:00:00');return isNaN(x)?d:x.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})};
const list=a=>a.length<3?a.join(' or '):a.slice(0,-1).join(', ')+' or '+a[a.length-1];
const fileHint=f=>'Upload 1 supported file: '+list(f.kinds.map(k=>KIND_LABEL[k]))+'. Max '+f.maxMB+' MB.';

export default function RegistrationForm({spec}){
  const[v,setV]=useState({});const[files,setFiles]=useState({});const[ticks,setTicks]=useState({});
  const[e,setE]=useState({});const[busy,setBusy]=useState(false);const[sendErr,setSendErr]=useState('');const[done,setDone]=useState(null);

  const blocks=spec.sections.flatMap(s=>s.blocks);
  const shown=b=>!b.showIf||v[b.showIf.id]===b.showIf.eq;
  const clear=id=>setE(p=>{if(!p[id])return p;const n={...p};delete n[id];return n});
  const set=(id,x)=>{setV(p=>({...p,[id]:x}));clear(id)};
  const tick=(id,i,x)=>{setTicks(p=>({...p,[id]:{...(p[id]||{}),[i]:x}}));clear(id)};
  const pick=(b,file)=>{setFiles(p=>({...p,[b.id]:file||null}));clear(b.id)};

  const validate=()=>{
    const er={};
    blocks.forEach(b=>{
      if(b.t==='info'||!shown(b))return;
      const x=(v[b.id]||'').trim();
      if(['text','textarea','date','email','tel'].includes(b.t)){
        if(b.req&&!x)er[b.id]='This field is required';
        else if(x&&b.t==='email'&&!mail.test(x))er[b.id]='Enter a valid email address';
        else if(x&&b.t==='tel'&&!phone.test(x))er[b.id]='Enter a valid phone number, including the country code';
      }else if(b.t==='radio'||b.t==='select'){
        if(b.req&&!x)er[b.id]='Please choose an option';
        else if(b.other&&x===b.other&&!(v[b.id+'__other']||'').trim())er[b.id]='Please specify';
        else if(b.mustAgree&&x&&x!==b.mustAgree)er[b.id]='You must accept this to submit the application.';
      }else if(b.t==='agree'){
        if(b.req&&!b.items.every((_,i)=>ticks[b.id]?.[i]))er[b.id]='Please tick every box to continue';
      }else if(b.t==='file'){
        const f=files[b.id];
        if(!f){if(b.req&&FORM_ENDPOINT)er[b.id]='Please choose a file'}
        else{
          const ok=b.file.kinds.some(k=>EXT[k].includes(ext(f.name)));
          if(!ok)er[b.id]='Unsupported file type. Allowed: '+list(b.file.kinds.map(k=>KIND_LABEL[k]))+'.';
          else if(f.size>b.file.maxMB*1024*1024)er[b.id]='File is larger than '+b.file.maxMB+' MB.';
        }
      }
    });
    return er;
  };

  const submit=async ev=>{
    ev.preventDefault();setSendErr('');
    const er=validate();setE(er);
    const first=Object.keys(er)[0];
    if(first){const el=document.getElementById('rf-'+first);el&&el.scrollIntoView({behavior:'smooth',block:'center'});return}
    const fields=[],up=[];
    blocks.forEach(b=>{
      if(b.t==='info'||!shown(b))return;
      const label=(b.n?b.n+'. ':'')+b.label;
      if(b.t==='file'){const f=files[b.id];if(f)up.push({id:b.id,label,file:f});return}
      if(b.t==='agree'){fields.push({label,value:'All statements accepted'});return}
      let value=v[b.id]||'';
      if(b.t==='date')value=fmtDate(value);
      if(b.other&&value===b.other)value=b.other+': '+(v[b.id+'__other']||'');
      fields.push({label,value});
    });
    const name=(v.fullName||'').trim();
    setBusy(true);
    try{
      const m=await submitForm({form:spec.name,subject:spec.name+(name?' – '+name:''),to:siteInfo.email,fields,files:up});
      setDone({mode:m,files:up.map(f=>f.label+' ('+f.file.name+')')});window.scrollTo({top:0,behavior:'smooth'});
    }catch(x){setSendErr('Sorry, we could not send your form. Please try again, or email us at '+siteInfo.email+'.')}
    finally{setBusy(false)}
  };

  if(done)return <div role="status" className="rounded-xl bg-green-50 p-6 text-green-800"><div className="flex items-center gap-2 font-semibold"><CheckCircle2 size={20}/>{done.mode==='api'?'Your application has been submitted.':'Your email app has opened.'}</div>
    <p className="mt-2 text-sm">{done.mode==='api'?'Thank you. We will review your application and get back to you.':done.mode==='mailto-copy'?'Your answers were copied: paste them into the email body (Ctrl+V) and press Send.':'Press Send in your email app to complete your application.'}</p>
    {done.mode!=='api'&&done.files.length>0&&<div className="mt-3 text-sm"><p className="font-semibold">Please attach these files to the email:</p><ul className="mt-1 list-disc pl-5">{done.files.map(f=><li key={f}>{f}</li>)}</ul></div>}
    <button onClick={()=>{setDone(null);setV({});setFiles({});setTicks({});setE({})}} className="mt-4 text-sm font-semibold underline">Fill again</button></div>;

  const cl=id=>'mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-brand '+(e[id]?'border-red-400':'border-slate-300');
  const Star=({b})=>b.req?<span className="text-red-600"> *</span>:null;
  const Err=({id})=>e[id]?<span role="alert" className="mt-1 block text-xs text-red-600">{e[id]}</span>:null;
  const Title=({b})=><span className="block text-sm font-semibold text-navy">{b.n?<span className="mr-1">{b.n}.</span>:null}{b.label}<Star b={b}/></span>;
  const Hint=({b})=><>{b.hint&&<span className="block text-xs text-slate-500">{b.hint}</span>}{b.lines&&<span className="mt-2 block space-y-2 text-sm text-slate-700">{b.lines.map(l=><span key={l} className="block">{l}</span>)}</span>}</>;

  const render=b=>{
    const id='rf-'+b.id;
    if(b.t==='info')return <p key={b.lines[0]} className="text-sm text-slate-700">{b.lines.join(' ')}</p>;
    if(['text','date','email','tel'].includes(b.t))return <div key={b.id}><label htmlFor={id}><Title b={b}/><Hint b={b}/></label><input id={id} type={b.t==='tel'?'tel':b.t} value={v[b.id]||''} onChange={x=>set(b.id,x.target.value)} aria-invalid={!!e[b.id]} className={cl(b.id)+(b.t==='date'?' sm:max-w-xs':'')}/><Err id={b.id}/></div>;
    if(b.t==='textarea')return <div key={b.id}><label htmlFor={id}><Title b={b}/><Hint b={b}/></label><textarea id={id} rows={4} value={v[b.id]||''} onChange={x=>set(b.id,x.target.value)} aria-invalid={!!e[b.id]} className={cl(b.id)}/><Err id={b.id}/></div>;
    if(b.t==='select')return <div key={b.id}><label htmlFor={id}><Title b={b}/><Hint b={b}/></label><select id={id} value={v[b.id]||''} onChange={x=>set(b.id,x.target.value)} aria-invalid={!!e[b.id]} className={cl(b.id)+' sm:max-w-sm'}><option value="">Choose</option>{b.opts.map(o=><option key={o}>{o}</option>)}</select><Err id={b.id}/></div>;
    if(b.t==='radio')return <fieldset key={b.id} id={id} tabIndex={-1}><legend><Title b={b}/><Hint b={b}/></legend>
      <div className={'mt-2 grid gap-1 '+(b.opts.length>8?'sm:grid-cols-2':'')}>{b.opts.map(o=><div key={o}><label className="flex items-center gap-2 py-1 text-sm text-slate-700"><input type="radio" name={b.id} checked={v[b.id]===o} onChange={()=>set(b.id,o)} className="h-4 w-4"/>{o}{b.other===o&&':'}</label>
        {b.other===o&&v[b.id]===o&&<input aria-label="Please specify" value={v[b.id+'__other']||''} onChange={x=>{setV(p=>({...p,[b.id+'__other']:x.target.value}));clear(b.id)}} className="ml-6 w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"/>}</div>)}</div><Err id={b.id}/></fieldset>;
    if(b.t==='agree')return <fieldset key={b.id} id={id} tabIndex={-1}><legend><Title b={b}/></legend><div className="mt-2 space-y-2">{b.items.map((t,i)=><label key={t} className="flex items-start gap-3 text-sm text-slate-700"><input type="checkbox" checked={!!ticks[b.id]?.[i]} onChange={x=>tick(b.id,i,x.target.checked)} className="mt-1 h-4 w-4 shrink-0"/><span>{t}</span></label>)}</div><Err id={b.id}/></fieldset>;
    if(b.t==='file')return <div key={b.id}><Title b={b}/>{b.hint&&<span className="block text-xs italic text-slate-600">{b.hint}</span>}
      {b.notes&&<ol className="mt-2 list-decimal space-y-0.5 pl-5 text-xs font-semibold text-slate-700">{b.notes.map(n=><li key={n}>{n}</li>)}</ol>}
      <p className="mt-2 text-xs text-slate-500">{fileHint(b.file)}</p>
      <label htmlFor={id} className={'mt-2 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-brand hover:bg-blue-50 '+(e[b.id]?'border-red-400':'border-slate-300')}><Upload size={16}/>{files[b.id]?'Change file':'Add File'}</label>
      <input id={id} type="file" className="sr-only" accept={b.file.kinds.flatMap(k=>EXT[k].map(x=>'.'+x)).join(',')} onChange={x=>pick(b,x.target.files[0])}/>
      {files[b.id]&&<span className="ml-3 inline-flex items-center gap-1 text-sm text-slate-700"><Paperclip size={14}/>{files[b.id].name}<button type="button" onClick={()=>pick(b,null)} className="ml-2 text-xs text-red-600 underline">Remove</button></span>}
      <Err id={b.id}/></div>;
    return null;
  };

  return <form noValidate onSubmit={submit} className="space-y-5">
    <Card><h2 className="font-serif text-xl font-bold text-navy">{spec.title} <span className="text-red-600">*</span></h2>
      <div className="mt-2 space-y-2 text-sm text-slate-700">{spec.intro.map(t=><p key={t}>{t}</p>)}</div></Card>
    {(sendErr||Object.keys(e).length>0)&&<div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18}/>{sendErr||'Please correct the highlighted fields and try again.'}</div>}
    {spec.sections.map((s,i)=><Card key={i}>
      {s.title&&<><h3 className="font-serif text-lg font-bold uppercase tracking-wide text-navy">{s.title}</h3>{s.note&&<p className="text-sm font-semibold text-slate-700">{s.note}</p>}</>}
      <div className={'space-y-5 '+(s.title?'mt-4':'')}>{s.blocks.filter(shown).map(render)}</div></Card>)}
    {!FORM_ENDPOINT&&<p className="rounded-lg bg-blue-50 p-3 text-xs text-slate-600"><Paperclip size={14} className="mr-1 inline"/>Files cannot be sent from this page by email alone. After you press Submit, your email app opens: attach your documents there, then press Send.</p>}
    <button disabled={busy} className="min-h-[48px] w-full rounded-full bg-navy px-8 font-semibold text-white hover:bg-brand disabled:opacity-60 sm:w-auto">{busy?'Sending…':'Submit'}</button>
  </form>;
}
