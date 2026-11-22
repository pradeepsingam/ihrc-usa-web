import {countries} from '../data/countries.js';

const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const aliases={usa:'us',us:'us',unitedstates:'us',america:'us',uk:'gb',greatbritain:'gb',britain:'gb',england:'gb',turkey:'tr',czechrepublic:'cz',southkorea:'kr',northkorea:'kp',uae:'ae',ivorycoast:'ci',vaticancity:'va',holysee:'va',easttimor:'tl',swaziland:'sz',capeverde:'cv'};

export function countryCode(value){
 const key=normalize(value);
 return aliases[key]||countries.find(([code,name])=>code===key||normalize(name)===key)?.[0]||'';
}

export function membersForCountry(people,code){
 const selected=countryCode(code);
 if(!selected)return [];
 const seen=new Set();
 return people.filter(person=>!person.tbd&&countryCode(person.country)===selected&&!seen.has(person.id)&&seen.add(person.id))
  .sort((a,b)=>a.name.localeCompare(b.name));
}
