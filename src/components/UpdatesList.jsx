import {Link} from 'react-router-dom';
import {Calendar} from 'lucide-react';
import {news,events,projects} from '../content';
import {programs} from '../data';
import {Heading,fmt} from './UI';

// One list for News, Events and Projects. Every row shows the heading; clicking it opens the full article.
const kinds={
  news:{label:'News',to:'/news/',cls:'bg-blue-100 text-blue-800'},
  event:{label:'Event',to:'/events/',cls:'bg-amber-100 text-amber-800'},
  project:{label:'Project',to:'/projects/',cls:'bg-emerald-100 text-emerald-800'}};
const norm=(list,k)=>list.map(x=>({k,id:x.id,title:x.title,date:x.date||'',program:x.program,category:x.category}));
export const allUpdates=()=>[...norm(news,'news'),...norm(events,'event'),...norm(projects,'project')]
  .sort((a,b)=>String(b.date).localeCompare(String(a.date)));

export const UpdatesList=({items})=><ul className="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
  {items.map(u=>{const K=kinds[u.k];return <li key={u.k+u.id}><Link to={K.to+u.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 hover:bg-blue-50">
    <span className={'w-16 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-semibold '+K.cls}>{K.label}</span>
    <span className="min-w-0 flex-1 font-semibold text-navy">{u.title}</span>
    {u.date&&<span className="flex items-center gap-1 text-xs text-slate-500"><Calendar size={14}/>{fmt(u.date)}</span>}
  </Link></li>})}
</ul>;

// Shown under the Programs filter tabs: the latest items of the chosen category (or of all programs).
export const ProgramUpdates=({cat='All'})=>{
  const slugs=programs.filter(p=>cat==='All'||p.c===cat).map(p=>p.slug);
  const items=allUpdates().filter(u=>cat==='All'?(u.program||u.category):(slugs.includes(u.program)||u.category===cat)).slice(0,12);
  if(!items.length)return null;
  return <section className="mt-10"><Heading>{cat==='All'?'Latest News, Events & Projects':'Latest in '+cat}</Heading><UpdatesList items={items}/></section>;
};
