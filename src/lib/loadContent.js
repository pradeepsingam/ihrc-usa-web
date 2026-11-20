import {API_URL,setPaymentUrl} from '../config';
import * as content from '../content';

// Loads the content managed in the Laravel admin panel and copies it into the objects
// exported by src/content.js, before the rest of the app is loaded (see main.jsx).
// If the backend is not configured or does not answer in time, the built-in content is used.
const LISTS=['news','events','projects','publications','partners','awardCategories','branches'];
const MAPS=['leaders','programDetails','supporters','forms'];

export let remotePages={};

export async function loadContent(timeoutMs=6000){
  if(!API_URL)return false;
  const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),timeoutMs);
  try{
    const res=await fetch(API_URL+'/api/content',{signal:ctrl.signal,headers:{Accept:'application/json'}});
    if(!res.ok)throw new Error('HTTP '+res.status);
    const d=await res.json();
    if(d.siteInfo){const {social,...rest}=d.siteInfo;Object.assign(content.siteInfo,rest);if(social)Object.assign(content.siteInfo.social,social);}
    for(const k of LISTS)if(Array.isArray(d[k]))content[k].splice(0,content[k].length,...d[k]);
    for(const k of MAPS)if(d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k]))Object.assign(content[k],d[k]);
    if(d.pages&&!Array.isArray(d.pages))remotePages=d.pages;
    setPaymentUrl(d.paymentUrl);
    return true;
  }catch(e){
    console.warn('Could not load content from the backend; using built-in content.',e);
    return false;
  }finally{clearTimeout(timer)}
}
