import {Routes,Route,Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import {TextPage,Programs,News,Benefits,People,Profile} from './pages/Content';
import {Apply,Volunteer,Contact,Verify} from './pages/Forms';
import {texts,groups} from './data';

export default function App(){return <Routes><Route element={<Layout/>}>
<Route index element={<Home/>}/>
{Object.keys(texts).map(k=><Route key={k} path={k} element={<TextPage k={k}/>}/>)}
{Object.keys(groups).map(g=><Route key={g} path={g} element={<People g={g}/>}/>)}
<Route path="member-profile" element={<Profile/>}/><Route path="member-profile/:id" element={<Profile/>}/>
<Route path="programs" element={<Programs/>}/><Route path="news" element={<News/>}/>
<Route path="membership-benefits" element={<Benefits/>}/><Route path="apply" element={<Apply/>}/>
<Route path="volunteer" element={<Volunteer/>}/>
<Route path="verify" element={<Verify/>}/><Route path="contact" element={<Contact/>}/>
<Route path="privacy" element={<Navigate to="/privacy-policy" replace/>}/>
<Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>}
