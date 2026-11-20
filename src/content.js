export const TBD='To be added by the administrator';

export const siteInfo={
email:'info@gmail.com',
whatsappLink:'https://wa.me/94711010031',
whatsappChannel:'https://whatsapp.com/channel/0029VbDiXwg72WTvs9ttGi0r',
phone:'+94 24 2222402',
address:'Jaffna Road, Vavuniya, Sri Lanka.',
mapUrl:'',
social:{facebook:'https://www.facebook.com/IHRC5/',instagram:'',youtube:'',tiktok:'',twitter:'',linkedin:''}
};

export const news=[];
export const events=[];
// ---- How news, events and projects are added -----------------------------
// Items are shown as headings; clicking a heading opens the full article.
// To show an item on a Program, add  program:'<slug>'  (the program page address, e.g. 'environmental-protection')
// or  category:'Education'  (one of the Programs filter tabs) when it is not tied to one program.
//   news     { id, title, type, date:'YYYY-MM-DD', summary, body, image, program }
//   events   { id, title, date, endDate, location, description, body, image, images, program }
//   projects { id, title, date, status:'Ongoing'|'Completed'|'Planned', location, summary, body, image, images, file, program }
export const projects=[];
export const publications=[];
export const partners=[];
export const supporters={donors:[],sponsors:[]};
export const awardCategories=[];
export const leaders={};
// People added in the admin (Members → Shown on website), per Members page: {leadership:[{id,name,role,country,photo,bio,…}]}
export const people={};
export const programDetails={};
// Forms made or edited in the admin Form Builder, keyed by web address (membership, volunteer, research, …)
export const forms={};

export const branches=[];

export const pubCategories=['Official Handbook','Human Rights Awareness Materials','Training Resources','Research','Annual Reports','Newsletters','Conference Reports','Policy Documents','Press Releases','Educational Publications'];
