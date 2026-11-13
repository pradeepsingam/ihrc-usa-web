import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, ChevronRight, Search,
  Facebook, Youtube, Linkedin, Twitter, Heart,
  Mail, Phone, MapPin
} from 'lucide-react';
import { nav, topNav, legal } from '../data';
import { siteInfo } from '../content';
import Cookie from './Cookie';
import DonateLink from './DonateLink';

export const Logo = () => (
  <Link to="/" className="flex items-center gap-3 sm:gap-4" aria-label="IHRC-USA">
    <img src="/logo.jpeg" alt="IHRC logo" className="h-10 w-10 object-contain mix-blend-multiply sm:h-12 sm:w-12" />
    <span className="hidden h-9 w-px bg-slate-300 sm:block" />
    <span className="font-serif leading-tight">
      <b className="block text-xl text-navy sm:text-2xl">IHRC-USA</b>
      <i className="hidden text-xs sm:block">“Equal Justice for Everyone & Everywhere”</i>
    </span>
  </Link>
);

const SearchBox = ({ cls = '' }) => {
  const [q, setQ] = useState('');
  const go = useNavigate();
  return (
    <form role="search" onSubmit={e => { e.preventDefault(); go('/search?q=' + encodeURIComponent(q.trim())); }} className={'flex ' + cls}>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." aria-label="Search"
        className="min-w-0 flex-1 rounded-l border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand" />
      <button className="rounded-r bg-navy px-3 text-white hover:bg-brand" aria-label="Search">
        <Search size={18} />
      </button>
    </form>
  );
};

const socialIcons = { facebook: Facebook, youtube: Youtube, linkedin: Linkedin, twitter: Twitter };
const Social = () => Object.entries(siteInfo.social).filter(([, u]) => u).map(([k, u]) => {
  const I = socialIcons[k];
  return (
    <a key={k} href={u} target="_blank" rel="noopener noreferrer" aria-label={k}
      className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white hover:bg-brand">
      <I size={16} />
    </a>
  );
});

const DesktopNav = () => (
  <nav className="hidden bg-navy lg:block">
    <div className="mx-auto flex max-w-[1600px] items-center">
      <div className="w-72 shrink-0" />
      <ul className="flex flex-1 items-center">
        {topNav.map(n => {
          const I = n.i;
          return (
            <li key={n.l} className="group relative">
              {n.to ? (
                <NavLink end to={n.to} className={({ isActive }) =>
                  'flex items-center gap-1 px-5 py-3.5 text-sm font-medium text-white hover:bg-blue-900 ' + (isActive ? 'bg-brand' : '')}>
                  {n.to === '/' && <I size={18} className="mr-1" />}
                  {n.l}
                </NavLink>
              ) : (
                <>
                  <button className="flex items-center gap-1 px-5 py-3.5 text-sm font-medium text-white hover:bg-blue-900">
                    {n.l}<ChevronDown size={14} />
                  </button>
                  <ul className="absolute left-0 top-full z-40 hidden w-64 rounded-b bg-white py-2 shadow-xl group-focus-within:block group-hover:block">
                    {n.c.map(([l, to]) => (
                      <li key={to}>
                        <Link to={to} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-brand">{l}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <DonateLink className="mr-4 flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-navy hover:brightness-95">
        <Heart size={16} fill="currentColor" />Donate
      </DonateLink>
    </div>
  </nav>
);

const Items = ({ collapsed, onNav }) => {
  const [open, setOpen] = useState(null);
  return (
    <ul>
      {nav.map(n => {
        const I = n.i;
        const isOpen = open === n.l;
        return (
          <li key={n.l} className="border-b border-slate-100 last:border-0">
            {n.to ? (
              <NavLink end to={n.to} onClick={onNav} title={n.l}
                className={({ isActive }) =>
                  'flex min-h-[48px] items-center gap-3 px-4 py-3.5 text-[15px] font-medium hover:bg-blue-50 ' +
                  (isActive ? 'text-brand' : 'text-navy')
                }>
                <I size={20} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{n.l}</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </NavLink>
            ) : (
              <>
                <button
                  title={n.l}
                  onClick={() => setOpen(isOpen ? null : n.l)}
                  aria-expanded={isOpen}
                  className="flex min-h-[48px] w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] font-medium text-navy hover:bg-blue-50">
                  <I size={20} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{n.l}</span>
                      <ChevronRight size={16} className={'transition ' + (isOpen ? 'rotate-90' : '')} />
                    </>
                  )}
                </button>
                {isOpen && !collapsed && (
                  <ul className="bg-slate-50 py-1">
                    {n.c.map(([l, to]) => (
                      <li key={to}>
                        <Link to={to} onClick={onNav} className="block py-2.5 pl-12 pr-4 text-sm text-slate-600 hover:text-brand">
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={'hidden shrink-0 overflow-y-auto p-4 transition-all lg:block ' + (collapsed ? 'w-24' : 'w-72')}>
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
          {!collapsed && <b className="text-lg">Main Menu</b>}
          <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            <Menu size={22} />
          </button>
        </div>
        <Items collapsed={collapsed} />
      </div>
      {!collapsed && (
        <div className="mt-4 overflow-hidden rounded-xl bg-navy text-center text-white shadow">
          <img src="/images/sidebar-globe.jpg" alt="" className="w-full" />
          <p className="px-4 pt-3 font-serif text-lg font-bold leading-snug">Together for Human Dignity</p>
          <DonateLink className="mx-auto my-3 inline-block rounded-full bg-white px-6 py-2 text-sm font-semibold text-navy">
            Donate Now →
          </DonateLink>
        </div>
      )}
    </aside>
  );
};

const Drawer = ({ open, close }) => (
  <div className={'fixed inset-0 z-50 lg:hidden ' + (open ? '' : 'pointer-events-none')}>
    <div onClick={close} className={'absolute inset-0 bg-black/50 transition-opacity ' + (open ? 'opacity-100' : 'opacity-0')} />
    <aside aria-hidden={!open} className={'absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl transition-transform ' + (open ? 'translate-x-0' : '-translate-x-full')}>
      <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
        <b>Menu</b>
        <button onClick={close} aria-label="Close menu" className="p-2"><X /></button>
      </div>
      <div className="p-3"><SearchBox /></div>
      <div className="flex-1 overflow-y-auto"><Items onNav={close} /></div>
      <div className="p-3">
        <DonateLink onClick={close} className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gold font-bold text-navy">
          <Heart size={16} />Donate
        </DonateLink>
      </div>
    </aside>
  </div>
);

const quick = [['About Us', '/who-we-are'], ['Human Rights', '/human-rights'], ['Programs', '/programs'], ['Leadership', '/leadership'], ['Global Network', '/global-network'], ['Events', '/events'], ['News', '/news'], ['Publications', '/publications']];
const involved = [['Membership', '/membership'], ['Volunteer', '/volunteer'], ['Awards & Recognition', '/awards'], ['Partnerships', '/partnerships'], ['NGO Partnership Application', '/partnership-application'], ['Donation', '/donation'], ['Report a Human Rights Concern', '/report-concern'], ['Contact Us', '/contact']];

const Footer = () => (
  <footer className="mt-8 bg-navy text-blue-100">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Link to="/" className="flex items-center gap-3" aria-label="IHRC-USA home">
          <img src="/logo.jpeg" alt="IHRC logo" className="h-14 w-14 rounded bg-white object-contain p-1" />
          <b className="font-serif text-xl text-white">IHRC-USA</b>
        </Link>
        <p className="mt-3 text-sm">Promoting human rights awareness, humanitarian values, peace, equality and community development. Equal Justice for Everyone &amp; Everywhere.</p>
        <div className="mt-4 flex gap-2"><Social /></div>
      </div>
      <div>
        <b className="text-white">Quick Links</b>
        <ul className="mt-2 space-y-1 text-sm">
          {quick.map(([l, t]) => <li key={t}><Link to={t} className="hover:text-white">{l}</Link></li>)}
        </ul>
      </div>
      <div>
        <b className="text-white">Get Involved</b>
        <ul className="mt-2 space-y-1 text-sm">
          {involved.map(([l, t]) => <li key={t}><Link to={t} className="hover:text-white">{l}</Link></li>)}
        </ul>
      </div>
      <div className="space-y-2 text-sm">
        <b className="text-white">Contact</b>
        {siteInfo.phone && <p className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /><a href={'tel:' + siteInfo.phone.replace(/\s+/g, '')} className="hover:text-white">Office: {siteInfo.phone}</a></p>}
        {siteInfo.whatsapp && <p className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /><a href={siteInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp: {siteInfo.whatsapp}</a></p>}
        <p className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /><a href={'mailto:' + siteInfo.email} className="hover:text-white">{siteInfo.email}</a></p>
        {siteInfo.address && <p className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" />{siteInfo.address}</p>}
      </div>
    </div>
    <div className="border-t border-white/10 px-4 py-4 text-center text-xs">
      © 2026 IHRC-USA. All rights reserved.
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {legal.map(([l, t]) => <Link key={t} to={t} className="hover:text-white">{l}</Link>)}
        <button onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))} className="hover:text-white">Cookie Settings</button>
      </div>
    </div>
  </footer>
);

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="shrink-0 bg-gradient-to-r from-white via-white to-sky-50 shadow-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-1 lg:px-12 lg:py-1.5">
          <Logo />
          <p className="hidden flex-1 text-center font-serif text-lg italic text-slate-700 xl:block">
            "Because what we do, we do for generations"
          </p>
          <div className="hidden items-center gap-2 md:flex">
            <Social /><span className="mx-3 h-8 w-px bg-navy" /><SearchBox cls="w-64" />
          </div>
          <button onClick={() => setOpen(true)} aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-lg bg-navy text-white lg:hidden">
            <Menu />
          </button>
        </div>
      </header>

      <div className="shrink-0 z-40"><DesktopNav /></div>
      <Drawer open={open} close={() => setOpen(false)} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 overflow-hidden">
        <Sidebar />
        <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
          <Footer />
        </main>
      </div>
      <Cookie />
    </div>
  );
}
