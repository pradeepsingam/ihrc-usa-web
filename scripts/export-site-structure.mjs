// Exports the site's built-in structure (pages, member groups, programs, categories)
// to backend/database/data/site-structure.json so the Laravel admin knows about it.
// Run with:  npm run export-structure
import {build} from 'esbuild';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server.js';
import {writeFileSync,mkdirSync} from 'fs';
const out='node_modules/.cache/site-structure.mjs';
await build({stdin:{contents:"export {htmlText} from './src/lib/htmlText.js';export {additionalForms} from './src/data/additionalForms.js';export {default as App} from './src/App.jsx';export {contentCatalog} from './src/lib/managedContent.js';export {texts,groups,programs} from './src/data.js';export {pubCategories,siteInfo,partners} from './src/content.js';export {membershipForm,volunteerForm} from './src/data/registrationForms.js';export {researchForm} from './src/data/researchForm.js';",resolveDir:'.',loader:'js'},bundle:true,jsx:'automatic',platform:'node',format:'esm',outfile:out,loader:{'.js':'jsx','.jsx':'jsx'},external:['lucide-react','react','react-dom','react-router-dom','react-router-dom/server','dompurify'],logLevel:'error',define:{'import.meta.env':'{"SSR":true}'}});
const m=await import('../'+out+'?'+Date.now());
const compositeSlugs=['volunteer','global-network','research','membership','membership-benefits','awards','partnership-application','accreditation','what-we-do','roles-responsibilities','our-partners','recognition','countries','human-rights','events','news','projects','publications','contact','report-concern','partnerships'];
const compositePages=Object.fromEntries(compositeSlugs.map(slug=>{const html=renderToString(React.createElement(StaticRouter,{location:'/'+slug},React.createElement(m.App)));const title=m.htmlText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||slug);const subtitle=m.htmlText(html.match(/<h1[^>]*>[\s\S]*?<\/h1><p[^>]*>([\s\S]*?)<\/p>/)?.[1]||'');return [slug,{title,subtitle,sections:[],is_composite:true,show_default_content:true}]}));
const data={
  pages:{...compositePages,...Object.fromEntries(Object.entries(m.texts).map(([k,p])=>[k,{title:p.title,subtitle:p.sub||'',sections:(p.b||[]).map(([heading,body])=>({heading,body}))}]))},
  groups:Object.fromEntries(Object.entries(m.groups).map(([k,g])=>[k,{title:g.title,roles:g.r}])),
  programs:m.programs.map(p=>({slug:p.slug,title:p.t,number:p.n,category:p.c,summary:p.d,image_url:p.img})),
  websiteContent:[...Object.values(m.contentCatalog),{key:'content.pubCategories',label:'Publication categories',group:'Website content',content:{value:m.pubCategories}}],
  partners:m.partners,
  pubCategories:m.pubCategories,
  siteInfo:m.siteInfo,
  // forms built with the RegistrationForm engine: loaded into the admin Form Builder
  forms:{...m.additionalForms,membership:{...m.membershipForm,slug:'membership'},volunteer:{...m.volunteerForm,slug:'volunteer'},research:{...m.researchForm,slug:'research'}},
};
mkdirSync('backend/database/data',{recursive:true});
writeFileSync('backend/database/data/site-structure.json',JSON.stringify(data,null,1));
console.log('Exported',Object.keys(data.pages).length,'pages,',Object.keys(data.groups).length,'groups,',data.programs.length,'programs');
