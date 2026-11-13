import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';

const KEY='ihrc-cookie-consent';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}};

export default function Cookie(){
const[show,setShow]=useState(false);const[prefs,setPrefs]=useState(false);const[c,setC]=useState({analytics:false,preferences:false});
useEffect(()=>{const v=read();if(v)setC(v);else setShow(true);const open=()=>{setPrefs(true);setShow(true)};window.addEventListener('open-cookie-settings',open);return()=>window.removeEventListener('open-cookie-settings',open)},[]);
const save=v=>{setC(v);write(v);setShow(false);setPrefs(false)};
if(!show)return null;
return <div role="dialog" aria-label="Cookie settings" className="fixed inset-x-0 bottom-0 z-[55] border-t border-slate-200 bg-white p-4 shadow-2xl"><div className="mx-auto max-w-4xl">
<p className="text-sm text-slate-700">This website uses only the storage that is needed for it to work. You can choose whether optional analytics and preference cookies may be used in future. See our <Link to="/privacy-policy" className="font-semibold text-brand underline">Privacy Policy</Link>.</p>
{prefs&&<div className="mt-3 space-y-2 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked disabled/>Essential (always on)</label>
<label className="flex items-center gap-2"><input type="checkbox" checked={c.analytics} onChange={e=>setC({...c,analytics:e.target.checked})}/>Analytics</label>
<label className="flex items-center gap-2"><input type="checkbox" checked={c.preferences} onChange={e=>setC({...c,preferences:e.target.checked})}/>Preferences</label></div>}
<div className="mt-3 flex flex-wrap gap-2">
{prefs?<button onClick={()=>save(c)} className="min-h-[40px] rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-brand">Save settings</button>:<button onClick={()=>setPrefs(true)} className="min-h-[40px] rounded-full border-2 border-navy px-5 text-sm font-semibold text-navy hover:bg-navy hover:text-white">Cookie settings</button>}
<button onClick={()=>save({analytics:false,preferences:false})} className="min-h-[40px] rounded-full border-2 border-navy px-5 text-sm font-semibold text-navy hover:bg-navy hover:text-white">Essential only</button>
<button onClick={()=>save({analytics:true,preferences:true})} className="min-h-[40px] rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-brand">Accept all</button></div></div></div>}
