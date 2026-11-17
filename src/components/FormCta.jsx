import {UserPlus,HandHeart,Mail,ShieldAlert,Handshake} from 'lucide-react';
import {Btn} from './UI';

// Buttons that lead to the pages that contain forms.
export const FORM_LINKS={
 volunteer:{to:'/volunteer',label:'Become a Volunteer',icon:HandHeart},
 member:{to:'/apply',label:'Apply for Membership',icon:UserPlus},
 contact:{to:'/contact',label:'Contact Us',icon:Mail},
 concern:{to:'/report-concern',label:'Report a Concern',icon:ShieldAlert},
 partner:{to:'/partnership-application',label:'CSO Partnership Application',icon:Handshake}};

// Which buttons each page shows. The first button is the main (filled) one.
export const PAGE_CTA={
 volunteers:['volunteer','member'],
 'general-assembly':['member','contact'],
 ambassadors:['member','contact'],
 'board-of-directors':['member','contact'],
 'president-chairperson':['member','contact'],
 'secretary-general-chief-executive':['member','contact'],
 'deputy-secretary-general':['member','contact'],
 'international-executive-council':['member','contact'],
 'advisory-council':['member','contact'],
 'standing-committees':['member','contact'],
 'community-partners':['member','contact'],
 'our-partners':['partner','contact'],
 'what-we-do':['member','volunteer'],
 directors:['member','contact'],
 coordinators:['member','contact'],
 'human-rights-officers':['concern','contact'],
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
