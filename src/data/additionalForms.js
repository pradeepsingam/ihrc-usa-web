import {accreditationFields} from './accreditationFields';
import {complaintSteps} from './complaintFields';
import {partnershipSections,partnershipMeta,formattingRules} from './partnershipForm';

const block=f=>({t:f.opts?'select':['text','textarea','email','tel','date'].includes(f.type)?f.type:'text',id:f.n||f.id,label:f.label,req:f.req||0,...(f.hint?{hint:f.hint}:{}),...(f.opts?{opts:f.opts}:{})});
const form=(key,name,title,sections,mailbox,intro=[])=>({key,slug:key,name,title,sections,mailbox,intro,successMessage:'Thank you. Your form has been submitted successfully. We will get back to you soon.'});
const contactFields=[{n:'name',label:'Name',req:1},{n:'email',label:'Email',type:'email',req:1},{n:'country',label:'Country',req:1},{n:'subject',label:'Subject',req:1},{n:'message',label:'Message',type:'textarea',req:1}];
const sections=fields=>[{title:'',blocks:fields.map(block)}];
const contactTeams=[['contact','IHRC-USA Website Enquiry','info'],['contact-news','News enquiry','news'],['contact-official','Official message','official'],['contact-secretary','Message to the Secretary','secretary'],['contact-chairman','Message to the Chairman','chairman']];
export const additionalForms=Object.fromEntries([
 ...contactTeams.map(([key,name,mailbox])=>[key,form(key,name,'Contact Form',sections(contactFields),mailbox)]),
 ['award-nomination',form('award-nomination','Award Nomination','Award Nomination Form',sections([{n:'nominee',label:'Nominee name',req:1},{n:'country',label:'Country',req:1},{n:'org',label:'Organization'},{n:'category',label:'Award category',req:1},{n:'achievements',label:'Achievements',type:'textarea',req:1},{n:'documents',label:'Supporting documents',type:'textarea',hint:'Add links to supporting documents.'},{n:'nominator',label:'Nominator name',req:1},{n:'email',label:'Nominator email',type:'email',req:1},{n:'phone',label:'Nominator phone',type:'tel'}]),'award')],
 ['accreditation',form('accreditation','IHRC-USA Accreditation & Recognition Application — Form IHRC-USA/ACC/001','Application Form',sections(accreditationFields),'accreditation')],
 ['event-registration',form('event-registration','Event Registration','Event Registration',sections([{n:'name',label:'Full name',req:1},{n:'email',label:'Email',type:'email',req:1},{n:'phone',label:'Phone',type:'tel'},{n:'event',label:'Event',req:1}]),'event')],
 ['complaint',form('complaint','Complaint Submission','Complaint Submission Form',complaintSteps.map(s=>({title:s.id+'. '+s.title,blocks:s.fields.map(f=>{
  const condition=f.when?.toString().match(/v\.([a-zA-Z0-9_]+)\s*===\s*['"]([^'"]+)['"]/);
  return {t:f.type==='checks'?'multi':f.type==='consent'?'agree':f.type||'text',id:f.n,n:f.no,label:f.label,req:f.req||0,...(f.hint?{hint:f.hint}:{}),...(f.opts?{opts:f.opts}:{}),...(f.other?{other:'Other'}:{}),...(f.type==='consent'?{items:[f.label]}:{}),...(f.n==='behalfExplain'?{showIf:{id:'behalf',eq:'No, I am submitting it on behalf of another person.'}}:{}),...(condition?{showIf:{id:condition[1],eq:condition[2]}}:{})};
 })})),'complaints')],
 ['partnership-application',form('partnership-application','CSO Partnership Application','Application Form',partnershipSections.map(s=>({title:s.title,blocks:s.items.flatMap(q=>q.parts?q.parts.map(p=>({...block(p),id:p.id})):q.fileOnly?[{t:'file',id:q.id,label:q.label,req:q.req||0,file:{kinds:['document','image'],maxMB:10}}]:[{...block(q),id:q.id,...(q.n?{n:q.n}:{})},...(q.attach?[{t:'file',id:q.id+'File',label:q.attach,file:{kinds:['document','image'],maxMB:10}}]:[])])})),'partnership',[partnershipMeta.subtitle])],
 ['formatting-rules',form('formatting-rules','General Formatting Rules','General Formatting Rules Form',[{title:'General Formatting Rules',blocks:[{t:'agree',id:'formattingAgreement',label:'I agree to the general formatting rules',req:1,items:formattingRules}]}],'partnership')],
]);
