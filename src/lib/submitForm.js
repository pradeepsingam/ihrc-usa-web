import {FORM_ENDPOINT} from '../config';

// Details of the last successful submission sent to the backend: { reference, message }.
export let lastSubmission = null;

// fields: [{label, value}]   files: [{id, label, file}]
// With a backend (FORM_ENDPOINT):
//   no files  -> JSON body   { form, subject, submittedAt, data, _hp }
//   with files -> multipart/form-data: form, subject, submittedAt, data (JSON string), _hp + one part per file named by its field id
//   The backend answers { reference, message } — the reference number is shown to the visitor.
//   On an error the backend's message is thrown (err.userMessage) so the form can show it.
// Returns 'api' (sent to backend), 'mailto-copy' or 'mailto' (email fallback, files cannot be attached).
export async function submitForm({form,formKey,subject,fields,to,files=[]}){
  const data={};fields.forEach(f=>{data[f.label]=(f.value||'').toString().trim()});
  const submittedAt=new Date().toISOString();
  if(FORM_ENDPOINT){
    let res;
    if(files.length){
      const fd=new FormData();fd.append('form',form);if(formKey)fd.append('formKey',formKey);fd.append('subject',subject);fd.append('submittedAt',submittedAt);fd.append('data',JSON.stringify(data));fd.append('_hp','');
      files.forEach(f=>fd.append(f.id,f.file,f.file.name));
      res=await fetch(FORM_ENDPOINT,{method:'POST',headers:{Accept:'application/json'},body:fd});
    }else{
      res=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({form,formKey,subject,submittedAt,data,_hp:''})});
    }
    let body={};try{body=await res.json()}catch(e){}
    if(!res.ok){
      const err=new Error('Request failed ('+res.status+')');
      err.userMessage=res.status===429?'Too many submissions from your connection. Please wait a minute and try again.':res.status===413?'Your files are too large to send together. Please use smaller files.':body.message||'';
      throw err;
    }
    lastSubmission={reference:body.reference||'',message:body.message||'',confirmationSent:!!body.confirmationSent};
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
