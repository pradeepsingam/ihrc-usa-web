import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createServer} from 'vite';
import {createServer as createHttpServer} from 'node:http';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server.js';

test('reported menu pages, forms and award detail routes render current admin content',async()=>{
 const server=await createServer({mode:'production',server:{middlewareMode:true,hmr:{server:createHttpServer()}},appType:'custom'});
 try{
  const snapshot=JSON.parse(readFileSync('backend/database/data/site-structure.json','utf8'));
  const content=await server.ssrLoadModule('/src/content.js');
  const loader=await server.ssrLoadModule('/src/lib/loadContent.js');
  for(const [slug,page] of Object.entries(snapshot.pages))if(page.is_composite)loader.remotePages[slug]={title:'Edited '+slug,sub:'Updated introduction',composite:true,published:true,showDefaultContent:true,b:[['Edited section','Content from the page editor.']],images:['/images/editor-gallery.jpg']};
  for(const [slug,form] of Object.entries(snapshot.forms))content.forms[slug]={...form,sections:[{title:'Edited form '+slug,blocks:[{t:'text',id:'edited',label:'Edited question '+slug,req:1}]}],successMessage:'Edited success message'};
  content.awardCategories.push({id:'7',name:'Community Excellence',description:'Full eligibility and nomination details.',image:'/images/full-award.jpg'});
  const {default:App}=await server.ssrLoadModule('/src/App.jsx');
  const metadata=await server.ssrLoadModule('/src/seo/metadata.js');
  const render=path=>renderToString(createElement(StaticRouter,{location:path},createElement(App)));
  for(const [slug,page] of Object.entries(snapshot.pages))if(page.is_composite){
   const html=render('/'+slug);
   assert.match(html,new RegExp('Edited '+slug));
   assert.match(html,/Content from the page editor\./);
   assert.match(html,/editor-gallery\.jpg/);
   assert.equal((html.match(/<h1\b/g)||[]).length,1,slug+' keeps one primary heading');
   assert.equal(metadata.getMetadata('/'+slug).name,'Edited '+slug);
  }
  for(const slug of Object.keys(snapshot.forms))assert.ok(render('/forms/'+slug).includes('Edited question '+slug),slug+' uses its editable questions');
  for(const [path,slug] of [['/volunteer','volunteer'],['/membership','membership'],['/research','research'],['/awards','award-nomination'],['/contact','contact'],['/accreditation','accreditation'],['/report-concern','complaint'],['/partnership-application','partnership-application']])assert.ok(render(path).includes('Edited question '+slug),path+' embeds the builder form');
  assert.match(render('/partnership-application'),/Edited question formatting-rules/);
  assert.match(render('/awards'),/href="\/awards\/7"/);
  assert.match(render('/awards/7'),/Full eligibility and nomination details\./);
  assert.match(render('/awards/7'),/Enlarge image: Community Excellence/);
  assert.equal(metadata.getMetadata('/awards/7').found,true);
  assert.ok(metadata.getRoutes().includes('/awards/7'));
  assert.equal(metadata.getMetadata('/awards/missing').found,false);
  content.forms['award-nomination']={published:false};
  assert.match(render('/awards'),/This form is currently unavailable/);
  loader.remotePages.awards.showDefaultContent=false;
  assert.doesNotMatch(render('/awards'),/This form is currently unavailable/);
  loader.remotePages.awards.published=false;
  assert.match(render('/awards'),/Page Not Found/);
  assert.equal(metadata.getMetadata('/awards').found,false);
 }finally{await server.close();}
});
