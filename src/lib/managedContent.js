import {websiteContent} from '../content';

export const contentCatalog={};

const presentation=value=>typeof value==='function'||Boolean(value&&typeof value==='object'&&value.$$typeof);
const serializable=value=>presentation(value)?undefined:Array.isArray(value)?value.map(item=>serializable(item)??null):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([,item])=>!presentation(item)).map(([key,item])=>[key,serializable(item)])):value;
const restore=(value,fallback)=>presentation(fallback)?fallback:Array.isArray(value)?value.map((item,index)=>restore(item,Array.isArray(fallback)?fallback[index]??fallback[0]:undefined)):value&&typeof value==='object'?Object.fromEntries([...Object.entries(value).map(([key,item])=>[key,restore(item,fallback?.[key])]),...Object.entries(fallback||{}).filter(([key])=>!(key in value))]):value;

// Data is loaded before the page modules. An explicitly empty value stays empty.
export function managed(key,label,group,fallback){
  contentCatalog[key]={key,label,group,content:{value:serializable(fallback)}};
  return Object.hasOwn(websiteContent,key)?restore(websiteContent[key],fallback):fallback;
}
