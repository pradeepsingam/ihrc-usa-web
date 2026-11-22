import test from 'node:test';
import assert from 'node:assert/strict';
import {countryCode,membersForCountry} from '../src/lib/countryMembers.js';

test('country names, ISO codes and common member-entered aliases match the directory',()=>{
 for(const value of ['United States of America','United States','U.S.A.','US'])assert.equal(countryCode(value),'us');
 for(const value of ['United Kingdom','UK','Great Britain'])assert.equal(countryCode(value),'gb');
 assert.equal(countryCode('  sri lanka '),'lk');
 assert.equal(countryCode('Turkey'),'tr');
 assert.equal(countryCode('Türkiye'),'tr');
 assert.equal(countryCode('Unknown country'),'');
});

test('country results contain only matching public people, without empty slots or duplicates',()=>{
 const people=[
  {id:'a',name:'Ann',country:'Sri Lanka'},
  {id:'b',name:'Ben',country:'USA'},
  {id:'a',name:'Ann',country:'LK'},
  {id:'empty',name:'Name to be added',country:'Sri Lanka',tbd:true},
 ];
 assert.deepEqual(membersForCountry(people,'lk').map(p=>p.id),['a']);
 assert.deepEqual(membersForCountry(people,'us').map(p=>p.id),['b']);
 assert.deepEqual(membersForCountry(people,'fr'),[]);
 assert.deepEqual(membersForCountry(people,'unknown'),[]);
});
