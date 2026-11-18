import {Routes,Route,Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import {TextPage,Programs,Benefits,People,Profile} from './pages/Content';
import {Apply,Volunteer,Contact,Verify} from './pages/Forms';
import {HumanRights,GlobalNetwork,Events,EventDetail,NewsList,NewsDetail,Publications,Awards,Partnerships,Donation,ReportConcern,ProgramDetail,SearchPage} from './pages/Extra';
import PartnershipApplication from './pages/PartnershipApplication';
import Roles from './pages/Roles';
import Countries from './pages/Countries';
import Recognition from './pages/Recognition';
import OurPartners from './pages/OurPartners';
import OurSupporters from './pages/OurSupporters';
import WhatWeDo from './pages/WhatWeDo';
import {texts,groups} from './data';

export default function App(){return <Routes><Route element={<Layout/>}>
<Route index element={<Home/>}/>
{Object.keys(texts).map(k=><Route key={k} path={k} element={<TextPage k={k}/>}/>)}
{Object.keys(groups).map(g=><Route key={g} path={g} element={<People g={g}/>}/>)}
<Route path="ambassador-at-large" element={<Navigate to="/ambassadors" replace/>}/><Route path="chief-human-rights-investigation-officer" element={<Navigate to="/human-rights-officers" replace/>}/><Route path="human-rights-officer" element={<Navigate to="/human-rights-officers" replace/>}/>
<Route path="member-profile" element={<Profile/>}/><Route path="member-profile/:id" element={<Profile/>}/>
<Route path="roles-responsibilities" element={<Roles/>}/><Route path="countries" element={<Countries/>}/><Route path="recognition" element={<Recognition/>}/><Route path="our-partners" element={<OurPartners/>}/><Route path="our-supporters" element={<OurSupporters/>}/><Route path="what-we-do" element={<WhatWeDo/>}/>
<Route path="human-rights" element={<HumanRights/>}/>
<Route path="programs" element={<Programs/>}/><Route path="programs/:slug" element={<ProgramDetail/>}/>
<Route path="global-network" element={<GlobalNetwork/>}/>
<Route path="membership" element={<Apply/>}/><Route path="apply" element={<Apply/>}/>
<Route path="membership-benefits" element={<Benefits/>}/>
<Route path="volunteer" element={<Volunteer/>}/>
<Route path="events" element={<Events/>}/><Route path="events/:id" element={<EventDetail/>}/>
<Route path="news" element={<NewsList/>}/><Route path="news/:id" element={<NewsDetail/>}/>
<Route path="publications" element={<Publications/>}/>
<Route path="awards" element={<Awards/>}/>
<Route path="partnerships" element={<Partnerships/>}/><Route path="partnership-application" element={<PartnershipApplication/>}/>
<Route path="donation" element={<Donation/>}/><Route path="donate" element={<Navigate to="/donation" replace/>}/>
<Route path="report-concern" element={<ReportConcern/>}/>
<Route path="verify" element={<Verify/>}/><Route path="contact" element={<Contact/>}/>
<Route path="search" element={<SearchPage/>}/>
<Route path="privacy" element={<Navigate to="/privacy-policy" replace/>}/>
<Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>}
