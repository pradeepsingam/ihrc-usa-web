import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {createServer as createHttpServer} from 'node:http';

test('CMS programs, page text and structured sections reach the rendered website',async()=>{
 const server=await createServer({mode:'production',server:{middlewareMode:true,hmr:{server:createHttpServer()}},appType:'custom'});
 try{
  const content=await server.ssrLoadModule('/src/content.js');
  const helper=await server.ssrLoadModule('/src/lib/managedContent.js');
  Object.assign(content.websiteContent,{
   'copy.Home':{'text-about-ihrc-usa':'Edited home heading'},
   'Home.slides':[],
   'countries.countries':[['us',null]],
   'research.researchAreas':['Edited research area'],
   'coreValues.coreValues':[{name:'Edited core value',text:'Edited value description'}],
   'ihrcBenefits.ihrcBenefits':[['Edited benefit','Edited benefit description',null]],
   'WhatWeDo.purpose':['Edited purpose'],
   'research.researchTopics':[['Edited research group',['Edited nested topic']]],
  });
  content.programCatalog.push({slug:'cms-program',n:32,t:'CMS program title',c:'Learning',d:'CMS program summary',img:'/images/default.jpg'});
  content.programDetails['cms-program']={description:'CMS full program description'};
  content.cmsState.programs=true;
  // These are the same imports and render order used after loadContent in the browser.
  const {default:App}=await server.ssrLoadModule('/src/App.jsx');
  const {renderToString}=await import('react-dom/server');
  const {createElement}=await import('react');
  const {StaticRouter}=await import('react-router-dom/server.js');
  const render=path=>renderToString(createElement(StaticRouter,{location:path},createElement(App)));
  assert.match(render('/'),/Edited home heading/);
  assert.match(render('/programs'),/CMS program title/);
  assert.doesNotMatch(render('/programs'),/Education for Children/);
  assert.match(render('/programs/cms-program'),/CMS full program description/);
  assert.match(render('/research'),/Edited research area/);
  assert.match(render('/research'),/Edited nested topic/);
  assert.match(render('/what-we-do'),/Edited purpose/);
  assert.doesNotThrow(()=>render('/countries'));
  content.websiteContent['test.blank']=null;
  assert.equal(helper.managed('test.blank','Blank','Test','Original text'),'');
  assert.match(render('/membership-benefits'),/Edited benefit description/);
  const core=await server.ssrLoadModule('/src/data/coreValues.js');
  assert.equal(core.coreValues[0].name,'Edited core value');
  assert.ok(core.coreValues[0].icon,'Original display icons survive CMS edits');
  content.websiteContent['test.empty']=[];
  assert.deepEqual(helper.managed('test.empty','Test','Test',['Fallback']),[]);
  assert.ok(Object.keys(helper.contentCatalog).length>=52);
 }finally{await server.close();}
});
