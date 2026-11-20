# IHRC-USA SEO implementation

Primary domain: **https://www.ihrc-usa.org/**. Review date: **20 November 2026**.

The frontend now generates page content and page-specific search/social metadata as static HTML. Builds load the configured CMS before importing the page data, matching browser initialization. Organization, WebSite, WebPage/ContactPage and breadcrumb JSON-LD describe the existing organization and page content without asserting government status, tax exemption or institutional endorsements.

## Build and publication

1. Set `VITE_API_URL` to the public HTTPS backend address in the production build environment. The existing localhost setting is for local development. Leave it empty only when intentionally publishing built-in content.
2. Run `npm run build`, then `npm run seo:check`. A configured API must be reachable; the build stops if it cannot load CMS content rather than quietly publishing an empty snapshot.
3. Publish the complete `dist/` folder. The site needs extensionless route support, directory index files, a root `404.html` served with HTTP 404 for unknown URLs, and the generated permanent path redirects. `_redirects` works for path aliases on Netlify and Cloudflare Pages; Apache/nginx need equivalent host configuration.
4. Set **www.ihrc-usa.org** as the primary host. At the hosting/domain layer permanently redirect HTTP and the apex `ihrc-usa.org` to HTTPS www, preserving paths and query strings. Check for loops. Domain redirects require provider configuration; canonical tags alone do not redirect visitors. Do not point the CMS API host at the frontend.
5. Rebuild and republish after CMS changes. Browser content refreshes from the CMS, but the HTML snapshot, index directives, new detail-page files and sitemap update at build time. Add an authenticated deployment webhook to the CMS publishing workflow if frequent publishing is needed.
6. After publication, verify the domain in Google Search Console and submit `https://www.ihrc-usa.org/sitemap.xml`. No verification, submission or publication was performed by this change.

For Netlify, domain redirect examples to add through host configuration or before the generated path rules are:

```text
https://ihrc-usa.org/* https://www.ihrc-usa.org/:splat 301!
http://ihrc-usa.org/* https://www.ihrc-usa.org/:splat 301!
http://www.ihrc-usa.org/* https://www.ihrc-usa.org/:splat 301!
```

Cloudflare Pages does not support domain-level redirects in `_redirects`; configure these through domain/zone redirect rules. Keep staging/private previews behind host access controls or host-level noindex headers and out of the production sitemap.

## Indexing policy

- Public, substantive informational pages and application pages use their own canonical URLs and are sitemap candidates.
- `/apply` redirects to `/membership`; the other historical aliases also redirect permanently and are excluded from the sitemap.
- Internal search and member verification are `noindex, follow`.
- Member directories with no named profiles, placeholder member profiles, empty news/events/projects/publications/branch/supporter lists and objective-only program pages are `noindex, follow` and excluded from the sitemap.
- Adding named people, published collection entries, or program descriptions/activities through the CMS makes the relevant pages eligible on the next build. This is a content-readiness rule, not a prediction of Google's indexing decisions.
- Filters and query parameters canonicalize to the unfiltered page. No alternative filtered routes are listed in the sitemap.
- Missing pages show a useful error screen and noindex metadata. Their HTTP 404 status depends on the static host serving `404.html` correctly. Vite preview is not a production redirect/status test.

## Evidence and remaining work

Scope: local frontend routes and build output, plus its configured CMS public content endpoint. The live homepage could not be retrieved by the browsing tool (generic access error, no HTTP status established). No whole-site live crawl, rendered-browser inspection, Google indexing data, rankings, backlink data or real-user performance data was available. No SEO score or traffic forecast was calculated.

| ID | Priority | Observation and evidence | Evidence level / confidence | Action, dependency and verification |
| --- | --- | --- | --- | --- |
| T1 | High, fixed locally | Original `index.html` had an empty root; the former `scripts/make-route-folders.js` copied the same HTML into all route folders. | Source HTML/code; high | The build now renders each route with its content and metadata. `npm run seo:check` checks every output page. Publish the new build before treating this as a live fix. |
| T2 | High, fixed locally | The original page shell had one generic title/description and no canonical, social metadata, structured data or frontend sitemap. | Source HTML; high | `src/seo/metadata.js` shares metadata between build and browser navigation. Check generated head tags, JSON-LD and sitemap consistency with `npm run seo:check`. |
| T3 | High, fixed locally | Unknown routes redirected to the home page and missing detail records redirected to their listings; `public/_redirects` returned the app shell with HTTP 200 for all paths. | Source code; high | Missing pages now render an error; the catch-all 200 rewrite was removed. Verify live unknown URLs return HTTP 404 after host configuration. |
| C1 | High, ongoing | Built-in people use “Name to be added”; many content collections are empty; program detail pages initially repeat a single objective sentence. See `src/content.js`, `src/data.js`, `src/data/programs.js` and `reports/seo-build.json`. | Source and generated HTML; high | Noindex/exclusion prevents intentionally promoting placeholders. Publish verified people, useful program detail, project evidence and resources, then rebuild. Confirm the new content is visible in source HTML and included in the sitemap. |
| C2 | High, review before launch | Default contact content includes `info@gmail.com` and a Sri Lankan office. The USA name alone does not establish a US office or audience. See `src/content.js` and the contact/footer templates. | Source content; high | Confirm official email, phone, address and service geography in CMS settings. The implementation preserves supplied information and does not invent a US address. Rebuild and check the contact page and footer. |
| C3 | High, editorial review | Recognition/partner pages display institutional names and logos. See `src/data/recognition.js`, `src/pages/Recognition.jsx` and `src/pages/OurPartners.jsx`. | Source content; high; legitimacy not independently assessed | Have the organization substantiate each claimed registration/relationship and clarify its scope. Basic schema deliberately omits these relationships. |
| D1 | High, launch dependency | Host redirects, live HTTP statuses, HTTPS, primary-host configuration and Search Console ownership were not verified. | Unknown | Follow publication steps, verify response headers, inspect key URLs in Search Console, then submit the sitemap. |
| P1 | Medium, unmeasured | Image and JavaScript delivery may affect loading performance. No field/lab measurement was performed. | Hypothesis; impact unknown | After launch collect PageSpeed/CrUX evidence for home, program and application pages; optimize based on measured LCP/INP/CLS. |

## Content priorities

Working audience: English-speaking people seeking human rights information, organizational membership, volunteering, research and cooperation. No US-only location strategy or keyword volume assumptions were applied.

1. Strengthen the organization and contact pages with verified identity, governance, official contact details and precise service geography.
2. Expand actual program pages with the audience served, location, activities, participation requirements, responsible team and dated evidence of work. Prioritize programs the organization actually operates. Link each page to relevant projects, resources and participation options.
3. Publish original project reports and human rights educational resources with named authors/reviewers, references and actual publication/review dates. Clearly distinguish educational information from professional advice.
4. Add real people and biographies to directories; remove obsolete appointments. Keep membership and private accreditation descriptions precise about what they authorize.
5. Use Search Console query/page evidence after launch to refine titles, descriptions and content. No search volume, position or conversion gains are assumed here.

## Verification

`npm run seo:check` verifies rendered page coverage against the build manifest, one title/canonical/H1 per page, structured-data parseability, social tags, local social-image existence, noindex/sitemap alignment, unique titles among sitemap candidates, alias rules and removal of the old catch-all 200 rewrite. This does not certify rich-result eligibility, Google indexing, browser interactions or live host behavior.

After deployment check:

```sh
curl -I https://www.ihrc-usa.org/
curl -I https://ihrc-usa.org/contact
curl -I http://www.ihrc-usa.org/contact
curl -I https://www.ihrc-usa.org/apply
curl -I https://www.ihrc-usa.org/this-page-does-not-exist
curl https://www.ihrc-usa.org/robots.txt
curl https://www.ihrc-usa.org/sitemap.xml
```

Expected: primary URLs return 200, alternate hosts and aliases permanently redirect, unknown routes return 404, robots and sitemap use the primary domain, and View Source contains page-specific copy and metadata before JavaScript runs. Test browser navigation, filters, forms and the mobile menu separately.

Implementation references checked on 20 November 2026: [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Cloudflare Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/) and [Netlify redirect options](https://docs.netlify.com/manage/routing/redirects/redirect-options/).
