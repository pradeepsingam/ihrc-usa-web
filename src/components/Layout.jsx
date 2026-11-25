import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, ChevronRight, Search,
  Facebook, Youtube, Linkedin, Twitter, Instagram, Megaphone, Heart,
  Mail, Phone, MapPin
} from 'lucide-react';
import { nav, topNav, legal } from '../data';
import { siteInfo } from '../content';
import Subscribe from './Subscribe';
import ErrorBoundary from './ErrorBoundary';
import Cookie from './Cookie';
import Seo from '../seo/Seo';
import JoinLink from './JoinLink';

export const Logo = () => (
  <Link to="/" className="flex items-center gap-3 sm:gap-4" aria-label="IHRC-USA">
    <img src="/logo.jpeg" alt="IHRC-USA logo" width="48" height="48" className="h-10 w-10 object-contain mix-blend-multiply sm:h-12 sm:w-12" />
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

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z" />
  </svg>
);
const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.6 2h-3.1v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .8.1V9.4a6 6 0 1 0 5.2 5.9V8.6a7.4 7.4 0 0 0 4.3 1.4V6.9a4.3 4.3 0 0 1-4.3-4.9z" />
  </svg>
);

const socialIcons = {
  facebook: Facebook, instagram: Instagram, youtube: Youtube, twitter: Twitter,
  linkedin: Linkedin, tiktok: TikTokIcon, whatsapp: WhatsAppIcon, whatsappChannel: Megaphone
};
const socialNames = {
  facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', twitter: 'X (Twitter)',
  linkedin: 'LinkedIn', tiktok: 'TikTok', whatsapp: 'WhatsApp', whatsappChannel: 'WhatsApp Channel'
};
// Every social link that has a URL in content.js (siteInfo.social plus the WhatsApp links).
export const socialLinks = () => Object.entries({
  ...siteInfo.social,
  whatsapp: siteInfo.whatsappLink,
  whatsappChannel: siteInfo.whatsappChannel
}).filter(([, u]) => u);
const socialColors = {
  facebook: '#1877F2', instagram: 'linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)', youtube: '#FF0000',
  twitter: '#000000', linkedin: '#0A66C2', tiktok: '#000000', whatsapp: '#25D366', whatsappChannel: '#25D366'
};
export const socialBg = k => ({ background: socialColors[k] || '#0B2A5B' });
export const socialIcon = (k, size = 16) => { const I = socialIcons[k]; return <I size={size} />; };
const Social = () => socialLinks().map(([k, u]) => {
  const I = socialIcons[k];
  return (
    <a key={k} href={u} target="_blank" rel="noopener noreferrer" aria-label={socialNames[k]} title={socialNames[k]}
      className="grid h-9 w-9 place-items-center rounded-full text-white ring-1 ring-white/30 transition hover:scale-110" style={socialBg(k)}>
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
      <JoinLink className="mr-4 flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-navy hover:brightness-95">
        <Heart size={16} fill="currentColor" />Join
      </JoinLink>
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
          <JoinLink className="mx-auto my-3 inline-block rounded-full bg-white px-6 py-2 text-sm font-semibold text-navy">
            Join Now →
          </JoinLink>
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
        <JoinLink onClick={close} className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gold font-bold text-navy">
          <Heart size={16} />Join
        </JoinLink>
      </div>
    </aside>
  </div>
);

const quick = [['About Us', '/who-we-are'], ['Human Rights', '/human-rights'], ['Programs', '/programs'], ['Leadership(P5)', '/leadership'], ['Global Network', '/global-network'], ['Events', '/events'], ['News', '/news'], ['Publications', '/publications']];
const involved = [['Volunteer', '/volunteer'], ['Membership', '/membership'], ['Awards & Recognition', '/awards'], ['CSO Partnership', '/partnership-application'], ['Accreditation', '/accreditation'], ['Report a Human Rights Concern', '/report-concern'], ['Contact Us', '/contact']];

const Footer = () => (
  <footer className="mt-8 bg-navy text-blue-100">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Link to="/" className="flex items-center gap-3" aria-label="IHRC-USA home">
          <img src="/logo.jpeg" alt="IHRC-USA logo" width="56" height="56" className="h-14 w-14 rounded bg-white object-contain p-1" />
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
        {siteInfo.phone && <p className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" style={{ color: '#34D399' }} /><a href={'tel:' + siteInfo.phone.replace(/\s+/g, '')} className="hover:text-white">Office: {siteInfo.phone}</a></p>}
        {siteInfo.whatsappLink && <p className="flex gap-2"><span className="mt-0.5 shrink-0" style={{ color: '#25D366' }}><WhatsAppIcon size={16} /></span><a href={siteInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></p>}
        {siteInfo.whatsappChannel && <p className="flex gap-2"><span className="mt-0.5 shrink-0" style={{ color: '#25D366' }}><WhatsAppIcon size={16} /></span><a href={siteInfo.whatsappChannel} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp Channel</a></p>}
        <p className="flex gap-2"><img src="/images/icons/mail.png" alt="" aria-hidden="true" className="h-5 w-5 shrink-0" /><a href={'mailto:' + siteInfo.email} className="hover:text-white">{siteInfo.email}</a></p>
      </div>
    </div>
    <div className="mx-auto max-w-6xl px-4 pb-8"><div className="max-w-md"><Subscribe /></div></div>
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
  const { pathname, hash, search } = useLocation();
  const preview = /[?&]preview=1/.test(search);
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    setOpen(false);
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 100);
      return () => clearTimeout(t);
    }
  }, [pathname, hash, search]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Seo />
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
          {preview && <div role="status" className="mb-4 rounded-lg bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-900">Preview – these changes are not saved or published yet.</div>}
          <ErrorBoundary key={pathname}><Outlet /></ErrorBoundary>
          <Footer />
        </main>
      </div>
      <Cookie />
    </div>
  );
}
