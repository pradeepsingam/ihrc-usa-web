import {FORM_ENDPOINT} from '../config';

// fields: [{label, value}]   files: [{id, label, file}]
// With a backend (FORM_ENDPOINT):
//   no files  -> JSON body   { form, subject, submittedAt, data }
//   with files -> multipart/form-data: form, subject, submittedAt, data (JSON string) + one part per file named by its field id
// Returns 'api' (sent to backend), 'mailto-copy' or 'mailto' (email fallback, files cannot be attached).
export async function submitForm({form,subject,fields,to,files=[]}){
  const data={};fields.forEach(f=>{data[f.label]=(f.value||'').toString().trim()});
  const submittedAt=new Date().toISOString();
  if(FORM_ENDPOINT){
    let res;
    if(files.length){
      const fd=new FormData();fd.append('form',form);fd.append('subject',subject);fd.append('submittedAt',submittedAt);fd.append('data',JSON.stringify(data));
      files.forEach(f=>fd.append(f.id,f.file,f.file.name));
      res=await fetch(FORM_ENDPOINT,{method:'POST',body:fd});
    }else{
      res=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({form,subject,submittedAt,data})});
    }
    if(!res.ok)throw new Error('Request failed ('+res.status+')');
    return 'api';
  }
  let body=fields.map(f=>f.label+': '+data[f.label]).join('\n');
  if(files.length)body+='\n\nFiles to attach to this email:\n'+files.map(f=>'- '+f.label+' ('+f.file.name+')').join('\n');
  const url='mailto:'+to+'?subject='+encodeURIComponent(subject)+'&body=';
  if((url+encodeURIComponent(body)).length<=1800){window.location.href=url+encodeURIComponent(body);return 'mailto'}
  // too long for a mailto link: copy the answers so the visitor can paste them into the email
  let copied=false;
  try{await navigator.clipboard.writeText(subject+'\n\n'+body);copied=true}catch(e){}
  window.location.href=url+encodeURIComponent(copied?'Please paste my application here (Ctrl+V / paste).':body.slice(0,900)+'\n...');
  return copied?'mailto-copy':'mailto';
}
