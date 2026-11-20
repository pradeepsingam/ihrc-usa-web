import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { loadContent } from './lib/loadContent';
import { API_URL } from './config';

export async function prepare() {
  if (API_URL && !await loadContent()) throw new Error('SEO build stopped: configured content API is unavailable. Start the backend or configure VITE_API_URL before rebuilding.');
  // Import after loading the CMS, as in the browser entry point.
  const { default: App } = await import('./App');
  const { getRoutes, getMetadata, headMarkup, aliases, SITE_URL } = await import('./seo/metadata');
  return { getRoutes, getMetadata, headMarkup, aliases, SITE_URL, render: path => renderToString(<StaticRouter location={path}><App/></StaticRouter>) };
}
