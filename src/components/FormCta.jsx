import {UserPlus,HandHeart,Mail,ShieldAlert,Handshake} from 'lucide-react';
import {Btn} from './UI';

// Buttons that lead to the pages that contain forms.
export const FORM_LINKS={
 volunteer:{to:'/volunteer',label:'Become a Volunteer',icon:HandHeart},
 member:{to:'/apply',label:'Apply for Membership',icon:UserPlus},
 contact:{to:'/contact',label:'Contact Us',icon:Mail},
 concern:{to:'/report-concern',label:'Report a Concern',icon:ShieldAlert},
 partner:{to:'/partnership-application',label:'NGO Partnership Application',icon:Handshake}};

// Which buttons each page shows. The first button is the main (filled) one.
export const PAGE_CTA={
 volunteers:['volunteer','member'],
 'general-assembly':['member','contact'],
 ambassadors:['member','contact'],
 'ambassador-at-large':['member','contact'],
 'chief-human-rights-investigation-officer':['concern','contact'],
 'human-rights-officer':['concern','contact'],
 'honorary-members':['member','contact'],
 commissioners:['member','contact'],
 leadership:['member','contact'],
 roles:['member','volunteer'],
 countries:['member','volunteer'],
 recognition:['partner','contact']};

export default function FormCta({page,cls=''}){
 const keys=PAGE_CTA[page]||[];
 if(!keys.length)return null;
 return <div className={'flex flex-wrap gap-3 '+cls}>{keys.map((k,i)=>{const f=FORM_LINKS[k];const I=f.icon;return <Btn key={k} to={f.to} alt={i>0}><I size={16}/>{f.label}</Btn>})}</div>}
