// Exports the site's built-in structure (pages, member groups, programs, categories)
// to backend/database/data/site-structure.json so the Laravel admin knows about it.
// Run with:  npm run export-structure
import {build} from 'esbuild';
import {writeFileSync,mkdirSync} from 'fs';
const out='node_modules/.cache/site-structure.mjs';
await build({stdin:{contents:"export {texts,groups,programs} from './src/data.js';export {pubCategories,siteInfo} from './src/content.js';export {membershipForm,volunteerForm} from './src/data/registrationForms.js';export {researchForm} from './src/data/researchForm.js';",resolveDir:'.',loader:'js'},bundle:true,platform:'node',format:'esm',outfile:out,loader:{'.js':'jsx','.jsx':'jsx'},external:['lucide-react','react','react-dom'],logLevel:'error',define:{'import.meta.env':'{}'}});
const m=await import('../'+out+'?'+Date.now());
const data={
  pages:Object.fromEntries(Object.entries(m.texts).map(([k,p])=>[k,{title:p.title,subtitle:p.sub||'',sections:(p.b||[]).map(([heading,body])=>({heading,body}))}])),
  groups:Object.fromEntries(Object.entries(m.groups).map(([k,g])=>[k,{title:g.title,roles:g.r}])),
  programs:m.programs.map(p=>({slug:p.slug,title:p.n+'. '+p.t,category:p.c})),
  pubCategories:m.pubCategories,
  siteInfo:m.siteInfo,
  // forms built with the RegistrationForm engine: loaded into the admin Form Builder
  forms:{membership:{...m.membershipForm,slug:'membership'},volunteer:{...m.volunteerForm,slug:'volunteer'},research:{...m.researchForm,slug:'research'}},
};
mkdirSync('backend/database/data',{recursive:true});
writeFileSync('backend/database/data/site-structure.json',JSON.stringify(data,null,1));
console.log('Exported',Object.keys(data.pages).length,'pages,',Object.keys(data.groups).length,'groups,',data.programs.length,'programs');
