import {useState} from 'react';
import {API_URL} from '../config';

// Newsletter sign-ups are saved immediately; no confirmation click is required.
export default function Subscribe(){
 const[email,setEmail]=useState('');const[name,setName]=useState('');
 const[state,setState]=useState({busy:false,msg:'',ok:false});
 if(!API_URL)return null;
 const submit=async e=>{e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email.trim()))return setState({msg:'Please enter a valid email address.',ok:false});
  setState({busy:true,msg:'',ok:false});
  try{const res=await fetch(API_URL+'/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email:email.trim(),name:name.trim()})});
   const b=await res.json().catch(()=>({}));
   setState({busy:false,ok:res.ok,msg:res.ok?(b.message||'You are subscribed to IHRC-USA news and updates.'):res.status===429?'Too many attempts. Please try again later.':(b.message||'Sorry, something went wrong.')});
   if(res.ok){setEmail('');setName('')}}catch(err){setState({busy:false,ok:false,msg:'Sorry, something went wrong. Please try again.'})}};
 return <form onSubmit={submit} noValidate className="space-y-2" aria-label="Subscribe to our newsletter">
  <b className="text-white">Newsletter</b>
  <p className="text-sm">Get news and updates from IHRC-USA by email.</p>
  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)" aria-label="Your name" className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-blue-200 outline-none focus:border-white"/>
  <div className="flex gap-2"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-blue-200 outline-none focus:border-white"/>
  <button disabled={state.busy} className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-blue-50 disabled:opacity-60">{state.busy?'…':'Subscribe'}</button></div>
  {state.msg&&<p role="status" className={'text-sm '+(state.ok?'text-green-300':'text-red-300')}>{state.msg}</p>}
 </form>;
}
