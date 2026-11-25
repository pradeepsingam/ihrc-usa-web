import {Routes,Route,Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Preview from './pages/Preview';
import {TextPage,Programs,Benefits,People,Profile,FormPage} from './pages/Content';
import {Apply,Volunteer,Contact,Verify} from './pages/Forms';
import {HumanRights,GlobalNetwork,Events,EventDetail,NewsList,NewsDetail,Publications,Awards,Partnerships,ReportConcern,ProgramDetail,SearchPage} from './pages/PublicPages';
import PartnershipApplication from './pages/PartnershipApplication';
import Roles from './pages/Roles';
import Research from './pages/Research';
import Countries from './pages/Countries';
import Recognition from './pages/Recognition';
import OurPartners from './pages/OurPartners';
import WhatWeDo from './pages/WhatWeDo';
import Accreditation from './pages/Accreditation';
import {Projects,ProjectDetail} from './pages/Projects';
import {texts,groups} from './data';

// Read when the route is shown (the admin preview adds texts.__preview at that moment).
const PreviewPage=()=>texts.__preview?<TextPage k="__preview"/>:<NotFound/>;

export default function App(){return <Routes><Route element={<Layout/>}>
<Route index element={<Home/>}/>
{Object.keys(texts).map(k=><Route key={k} path={k} element={<TextPage k={k}/>}/>)}
{Object.keys(groups).map(g=><Route key={g} path={g} element={<People g={g}/>}/>)}
<Route path="ambassador-at-large" element={<Navigate to="/ambassadors" replace/>}/><Route path="chief-human-rights-investigation-officer" element={<Navigate to="/human-rights-officers" replace/>}/><Route path="human-rights-officer" element={<Navigate to="/human-rights-officers" replace/>}/>
<Route path="member-profile" element={<Profile/>}/><Route path="member-profile/:id" element={<Profile/>}/>
<Route path="roles-responsibilities" element={<Roles/>}/><Route path="countries" element={<Countries/>}/><Route path="recognition" element={<Recognition/>}/><Route path="our-partners" element={<OurPartners/>}/><Route path="our-supporters" element={<NotFound/>}/><Route path="what-we-do" element={<WhatWeDo/>}/>
<Route path="research" element={<Research/>}/>
<Route path="human-rights" element={<HumanRights/>}/>
<Route path="programs" element={<Programs/>}/><Route path="programs/:slug" element={<ProgramDetail/>}/>
<Route path="global-network" element={<GlobalNetwork/>}/>
<Route path="membership" element={<Apply/>}/><Route path="apply" element={<Navigate to="/membership" replace/>}/>
<Route path="membership-benefits" element={<Benefits/>}/>
<Route path="volunteer" element={<Volunteer/>}/>
<Route path="events" element={<Events/>}/><Route path="events/:id" element={<EventDetail/>}/>
<Route path="news" element={<NewsList/>}/><Route path="news/:id" element={<NewsDetail/>}/>
<Route path="projects" element={<Projects/>}/><Route path="projects/:id" element={<ProjectDetail/>}/>
<Route path="publications" element={<Publications/>}/>
<Route path="awards" element={<Awards/>}/>
<Route path="partnerships" element={<Partnerships/>}/><Route path="partnership-application" element={<PartnershipApplication/>}/>
<Route path="donation" element={<Navigate to="/membership" replace/>}/><Route path="donate" element={<Navigate to="/membership" replace/>}/>
<Route path="accreditation" element={<Accreditation/>}/>
<Route path="report-concern" element={<ReportConcern/>}/>
<Route path="verify" element={<Verify/>}/><Route path="contact" element={<Contact/>}/>
<Route path="search" element={<SearchPage/>}/>
<Route path="forms/:slug" element={<FormPage/>}/>
<Route path="preview/:token" element={<Preview/>}/><Route path="preview-page" element={<PreviewPage/>}/>
<Route path="privacy" element={<Navigate to="/privacy-policy" replace/>}/>
<Route path="*" element={<NotFound/>}/></Route></Routes>}
