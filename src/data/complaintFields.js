const ORG='IHRC-USA';
const YN=['Yes','No'],YNS=['Yes','No','Not sure'];
const f=(no,n,label,o={})=>({no,n,label,type:'text',...o});

export const complaintSteps=[
{id:'A',title:'Complainant Information',fields:[
f(1,'name','Full Name',{req:1}),
f(2,'gender','Gender (optional)',{type:'select',opts:['Female','Male','Other','Prefer not to say']}),
f(3,'age','Age Group (optional)',{type:'select',opts:['Under 18','18–25','26–40','41–60','Over 60','Prefer not to say']}),
f(4,'country','Country of Residence',{req:1}),
f(5,'city','City / District'),
f(6,'email','Email Address',{type:'email',req:1}),
f(7,'phone','Contact Number (including country code)',{type:'tel'}),
f(8,'comm','Preferred Method of Communication',{type:'radio',opts:['Email','Telephone','Other'],other:1}),
f(9,'behalf','Are you submitting this complaint on your own behalf?',{type:'radio',req:1,opts:['Yes','No, I am submitting it on behalf of another person.']}),
f(9,'behalfExplain','Explain your relationship to the affected person and your authority to submit on their behalf',{type:'textarea',when:v=>(v.behalf||'').startsWith('No'),req:1})]},
{id:'B',title:'Person or Organization You Are Complaining About',fields:[
f(10,'against','Who is the complaint against?',{type:'radio',req:1,other:1,opts:['An individual','An organization','A company or business','A government or public institution','An educational institution','An employer','An association or group','Other']}),
f(11,'againstName','Name of the Individual or Organization',{req:1}),
f(12,'position','Position / Designation (if applicable)'),
f(13,'againstCountry','Country Where the Individual or Organization Operates',{req:1}),
f(14,'againstAddress','Address or Location (if known)'),
f(15,'againstWeb','Website / Official Contact Information (if available)')]},
{id:'C',title:'Type of Complaint',fields:[
f(16,'nature','What is the nature of your complaint?',{type:'checks',req:1,other:1,hint:'Select all applicable categories.',opts:['Human rights violation or concern','Discrimination','Harassment or bullying','Physical abuse or violence','Verbal or psychological abuse','Workplace misconduct','Unfair treatment','Abuse of authority','Exploitation or coercion','Fraud or misleading conduct','Financial misconduct','Child protection concern',"Women's rights concern",'Educational institution-related concern','Organizational misconduct','Threats or intimidation','Privacy or confidentiality concern','Other']})]},
{id:'D',title:'Incident Details',fields:[
f(17,'incidentDate','Date of Incident or Beginning of the Problem',{type:'date',req:1}),
f(18,'incidentPlace','Location Where the Incident Occurred',{req:1}),
f(19,'ongoing','Is the problem ongoing?',{type:'radio',req:1,opts:YNS}),
f(20,'description','Please explain what happened',{type:'textarea',rows:7,req:1,hint:'Provide a clear and detailed description of the incident, including what occurred, how you were affected, and any relevant circumstances.'}),
f(21,'affected','How has this incident affected you or the affected person?',{type:'checks',other:1,opts:['Physical well-being','Emotional or psychological well-being','Employment or professional life','Education','Financial circumstances','Family or personal life','Safety or security','Reputation or dignity','Other']}),
f(21,'affectedExtra','Additional explanation',{type:'textarea'})]},
{id:'E',title:'Witnesses and Supporting Evidence',fields:[
f(22,'witnesses','Were there any witnesses?',{type:'radio',opts:YNS}),
f(22,'witnessDetails','Provide their names or relevant details only where appropriate and safe',{type:'textarea',when:v=>v.witnesses==='Yes'}),
f(23,'evidence','Do you have supporting evidence?',{type:'checks',opts:['Emails or written communication','Letters or official documents','Photographs','Videos','Audio recordings','Screenshots or messages','Medical or professional reports','Witness statements','Other supporting materials','No supporting evidence currently available']}),
f(24,'evidenceDesc','Please provide a brief description of the available evidence',{type:'textarea'}),
f(25,'canProvide','Can you provide supporting documents if requested?',{type:'radio',opts:YNS})]},
{id:'F',title:'Previous Actions Taken',fields:[
f(26,'reported','Have you previously reported this matter to another authority or organization?',{type:'radio',req:1,opts:YN}),
f(26,'reportedTo','Identify the authority or organization',{when:v=>v.reported==='Yes'}),
f(27,'response','Have you received any response or assistance?',{type:'radio',other:1,opts:['Yes','No','Pending','Other']}),
f(28,'legalCase','Is there an ongoing legal case, police investigation, or official proceeding related to this matter?',{type:'radio',opts:YNS}),
f(28,'legalExplain','Provide a brief explanation without sharing confidential legal information',{type:'textarea',when:v=>v.legalCase==='Yes'})]},
{id:'G',title:'Assistance Requested',fields:[
f(29,'assistance','What kind of assistance or action are you requesting from '+ORG+'?',{type:'checks',req:1,other:1,opts:['Review of my complaint','Guidance about appropriate reporting channels','Human rights awareness or information','Referral to an appropriate authority or organization','Guidance on available support services','Assistance identifying relevant resources','Other']}),
f(30,'outcome','What outcome are you hoping to achieve?',{type:'textarea',req:1})]},
{id:'H',title:'Safety and Confidentiality',fields:[
f(31,'danger','Are you or the affected person currently in danger?',{type:'radio',req:1,opts:YNS}),
f(32,'safeContact','Is it safe for '+ORG+' to contact you using the contact details provided?',{type:'radio',req:1,opts:YN}),
f(33,'safeTime','Is there a safe time or method for contacting you?',{type:'textarea'}),
f(34,'retaliation','Do you have any concerns about retaliation, threats, or further harm if the complaint becomes known?',{type:'radio',opts:YNS}),
f(34,'retaliationExplain','Explain only what is safe to disclose',{type:'textarea',when:v=>v.retaliation==='Yes'})]},
{id:'I',title:'Declaration and Consent',fields:[
f(35,'declared','I have read and understood the above declaration and confirm that the information submitted is accurate to the best of my knowledge.',{type:'consent',req:1,group:'Declaration'}),
f(36,'consented','I consent to '+ORG+' collecting and using the information I provide for the purpose of reviewing and responding to this complaint, in accordance with its privacy policy and applicable law.',{type:'consent',req:1,group:'Consent to the handling of my information'}),
f(37,'signName','Name of Complainant / Authorized Representative'),
f(38,'submitDate','Date of Submission',{type:'date'})]}];
