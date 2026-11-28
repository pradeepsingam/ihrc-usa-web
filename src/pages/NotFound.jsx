import {managed} from '../lib/managedContent';
import { Page, Btn } from '../components/UI';
const editableCopy=managed("copy.NotFound","Not Found — headings and text","Page text",{
 "page-title-page-not-found": "Page Not Found",
 "page-introduction-the-page-you-requested-could-not-be-found": "The page you requested could not be found.",
 "text-explore-our-programs-or-return-to-the-home-page": "Explore our programs or return to the home page.",
 "text-explore-programs": "Explore Programs"
});


export default function NotFound() {
  return <Page title={editableCopy["page-title-page-not-found"]} sub={editableCopy["page-introduction-the-page-you-requested-could-not-be-found"]}><p className="mb-5 text-slate-700">{editableCopy["text-explore-our-programs-or-return-to-the-home-page"]}</p><div className="flex flex-wrap gap-3"><Btn to="/">Home</Btn><Btn to="/programs" alt>{editableCopy["text-explore-programs"]}</Btn></div></Page>;
}
