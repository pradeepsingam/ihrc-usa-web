import { texts, groups, people, allPeople, programs } from '../data';
import { news, events, projects, publications, branches, programDetails } from '../content';

export const SITE_URL = 'https://www.ihrc-usa.org';
export const SITE_NAME = 'IHRC-USA';
export const SITE_DESCRIPTION = 'Learn about IHRC-USA’s human rights education, advocacy and humanitarian initiatives. Explore our programs, membership and volunteer opportunities.';
export const aliases = {
  '/apply': '/membership', '/donate': '/membership', '/donation': '/membership', '/privacy': '/privacy-policy',
  '/ambassador-at-large': '/ambassadors',
  '/chief-human-rights-investigation-officer': '/human-rights-officers',
  '/human-rights-officer': '/human-rights-officers',
};
const pages = {
  '/': ['Human Rights Education & Humanitarian Action', SITE_DESCRIPTION],
  '/what-we-do': ['What We Do', 'Explore IHRC-USA’s work in human rights education, advocacy, humanitarian service, equality, peace and community empowerment.'],
  '/human-rights': ['Human Rights Education & Resources', 'Learn about universal human rights, equality, children’s rights and human rights education. Explore educational resources from IHRC-USA.'],
  '/programs': ['Human Rights & Community Programs', 'Explore IHRC-USA’s 31 program objectives in protection, education, advocacy, humanitarian service, inclusion and environmental sustainability.'],
  '/membership': ['Become a Member', 'Explore IHRC-USA membership and complete the application form to participate in human rights awareness and community initiatives.'],
  '/membership-benefits': ['Membership Benefits', 'Explore IHRC-USA membership benefits, training opportunities, community participation and ways to support human rights awareness.'],
  '/volunteer': ['Volunteer for Human Rights', 'Apply to volunteer with IHRC-USA and contribute your skills to human rights education, community awareness and humanitarian initiatives.'],
  '/research': ['Human Rights Research Opportunities', 'Join IHRC-USA’s research network. Explore research areas, eligibility and the application form for academics, researchers and field investigators.'],
  '/contact': ['Contact IHRC-USA', 'Contact IHRC-USA with questions about membership, volunteering, partnerships and human rights awareness initiatives.'],
  '/report-concern': ['Report a Human Rights Concern', 'Read IHRC-USA’s guidance and submit a human rights concern for initial review and possible referral through the concern reporting form.'],
  '/partnership-application': ['CSO Partnership Application', 'Review the requirements and apply for a civil society organization partnership with IHRC-USA.'],
  '/partnerships': ['Partnerships', 'Explore opportunities to cooperate with IHRC-USA on human rights education, advocacy and community initiatives.'],
  '/accreditation': ['Recognition & Accreditation Application', 'Read the scope, limitations and requirements of IHRC-USA’s private recognition and programme review services before applying.'],
  '/awards': ['Awards & Recognition', 'Learn about IHRC-USA awards and recognition and submit a nomination with supporting information.'],
  '/roles-responsibilities': ['Roles & Responsibilities', 'Read the roles, responsibilities and conduct expectations for IHRC-USA members, officers, representatives and volunteers.'],
  '/countries': ['Countries', 'Explore country information and IHRC-USA’s international cooperation and representation framework.'],
  '/recognition': ['Recognition & Registrations', 'Read IHRC-USA’s information about organizational registrations, recognition and cooperation.'],
  '/our-partners': ['Our Partners', 'Explore organizations cooperating with IHRC-USA in human rights awareness and community initiatives.'],
  '/global-network': ['Global Network', 'Find published information about authorized IHRC branches and representatives in the global network.'],
  '/news': ['News & Updates', 'Read published IHRC-USA news and updates on human rights awareness, programs and community initiatives.'],
  '/events': ['Events', 'Explore published IHRC-USA events, workshops and opportunities to participate in human rights awareness initiatives.'],
  '/projects': ['Projects', 'Explore published IHRC-USA project updates and community initiatives.'],
  '/publications': ['Publications & Resources', 'Browse published IHRC-USA handbooks, human rights awareness materials, training resources and reports.'],
  '/verify': ['Verify a Member', 'Use the IHRC-USA member verification service to check membership details.'],
  '/search': ['Search', 'Search IHRC-USA pages, programs, news, events and projects.'],
};

export const cleanText = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const snippet = value => { const text = cleanText(value); return text.length > 160 ? text.slice(0, 157).replace(/\s+\S*$/, '') + '…' : text; };
export const normalizePath = path => ('/' + path.split(/[?#]/)[0].split('/').filter(Boolean).join('/'));
export const absoluteUrl = path => new URL(path, SITE_URL + '/').href;

export function getMetadata(pathname) {
  const requested = normalizePath(pathname);
  const path = aliases[requested] || requested;
  const key = path.slice(1);
  let entry = pages[path];
  let noindex = ['/search', '/verify'].includes(path);
  let image = '/logo.jpeg';
  let type = 'website';
  if (texts[key]) entry = [texts[key].title, texts[key].sub];
  if (groups[key]) {
    entry = [groups[key].title, groups[key].sub];
    noindex = !people[key]?.some(person => !person.tbd);
  }
  const emptyLists = { '/news': news, '/events': events, '/projects': projects, '/publications': publications, '/global-network': branches };
  if (emptyLists[path]?.length === 0) noindex = true;
  const [family] = key.split('/');
  const id = key.slice(family.length + 1);
  if (id && family === 'programs') {
    const program = programs.find(item => item.slug === id);
    if (program) {
      const detail = programDetails[id];
      entry = [program.t, detail?.description || program.d];
      image = program.img || image;
      // Keep objective-only pages available while richer program content is prepared.
      noindex = !detail?.description && !detail?.activities?.length;
    }
  } else if (id && ['news', 'events', 'projects'].includes(family)) {
    const item = ({ news, events, projects })[family].find(item => String(item.id) === id);
    if (item) {
      entry = [item.title+' – '+({news:'News',events:'Event',projects:'Project'})[family], item.summary || item.description || item.body];
      image = item.image || image;
      if (family === 'news') type = 'article';
    }
  } else if (family === 'member-profile') {
    const person = allPeople.find(item => String(item.id) === id || String(item.memberId || '') === id);
    if (person) { entry = [person.name+' – '+(person.memberId||person.id), person.bio || person.role]; image = person.photo || image; }
  }
  if (family === 'preview' || path === '/preview-page') { entry = ['Content Preview', 'Preview of unpublished IHRC-USA content.']; noindex = true; }
  if (id === '__preview') noindex = true;
  const found = Boolean(entry) && (family === 'member-profile' || key.split('/').length <= 2);
  if (!found) { entry = ['Page Not Found', 'This page could not be found. Explore IHRC-USA programs, membership and contact information.']; noindex = true; }
  return { path, found, title: `${entry[0]} | ${SITE_NAME}`, name: entry[0], description: snippet(entry[1]), canonical: absoluteUrl(path), robots: noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large', noindex, image: absoluteUrl(image), type };
}

export function getRoutes() {
  return [...new Set([
    ...Object.keys(pages), ...Object.keys(texts).map(key => '/' + key), ...Object.keys(groups).map(key => '/' + key),
    ...programs.map(program => '/programs/' + program.slug),
    ...Object.entries({ news, events, projects }).flatMap(([family, items]) => items.map(item => `/${family}/${item.id}`)),
    // Member IDs can be typed freely in the admin; only IDs that are safe as folder names are pre-rendered.
    // Any other profile still opens, rendered in the browser.
    ...allPeople.map(person => '/member-profile/' + person.id).filter(path => /^\/member-profile(?:\/[a-zA-Z0-9_-]+)+$/.test(path)),
  ])];
}

export function structuredData(meta) {
  const organization = { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: 'International Human Rights Council – USA', alternateName: SITE_NAME, url: SITE_URL + '/', logo: SITE_URL + '/logo.jpeg', description: 'Promoting human rights awareness, humanitarian values, peace, equality and community development.' };
  const website = { '@type': 'WebSite', '@id': SITE_URL + '/#website', url: SITE_URL + '/', name: SITE_NAME, inLanguage: 'en', publisher: { '@id': organization['@id'] } };
  const page = { '@type': meta.path === '/contact' ? 'ContactPage' : 'WebPage', '@id': meta.canonical + '#webpage', url: meta.canonical, name: meta.name, description: meta.description, inLanguage: 'en', isPartOf: { '@id': website['@id'] }, about: { '@id': organization['@id'] } };
  const graph = [organization, website, page];
  if (meta.path !== '/' && meta.found) {
    const family = meta.path.split('/')[1];
    const parent = meta.path.split('/').length > 2 && pages['/' + family] ? { '@type': 'ListItem', position: 2, name: pages['/' + family][0], item: absoluteUrl('/' + family) } : null;
    graph.push({ '@type': 'BreadcrumbList', '@id': meta.canonical + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      ...(parent ? [parent] : []), { '@type': 'ListItem', position: parent ? 3 : 2, name: meta.name, item: meta.canonical },
    ] });
    page.breadcrumb = { '@id': meta.canonical + '#breadcrumb' };
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export function headMarkup(meta) {
  const tag = (name, content, property = false) => `<meta ${property ? 'property' : 'name'}="${name}" content="${escapeHtml(content)}" data-seo/>`;
  return `<title data-seo>${escapeHtml(meta.title)}</title>\n` + [
    tag('description', meta.description), tag('robots', meta.robots),
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" data-seo/>`,
    tag('og:site_name', SITE_NAME, true), tag('og:locale', 'en_US', true), tag('og:type', meta.type, true),
    tag('og:title', meta.title, true), tag('og:description', meta.description, true), tag('og:url', meta.canonical, true), tag('og:image', meta.image, true), tag('og:image:alt', meta.name, true),
    tag('twitter:card', 'summary'), tag('twitter:title', meta.title), tag('twitter:description', meta.description), tag('twitter:image', meta.image),
    `<script type="application/ld+json" data-seo>${JSON.stringify(structuredData(meta)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n');
}
