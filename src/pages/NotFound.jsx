import { Page, Btn } from '../components/UI';

export default function NotFound() {
  return <Page title="Page Not Found" sub="The page you requested could not be found."><p className="mb-5 text-slate-700">Explore our programs or return to the home page.</p><div className="flex flex-wrap gap-3"><Btn to="/">Home</Btn><Btn to="/programs" alt>Explore Programs</Btn></div></Page>;
}
