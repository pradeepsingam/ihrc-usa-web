// Safe text for prerendering when the browser DOM sanitizer is unavailable.
export function htmlText(html){
 const entities={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
 return String(html).replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'')
  .replace(/<br\s*\/?\s*>|<\/(?:p|h[1-6]|li|blockquote|tr|div)\s*>/gi,'\n')
  .replace(/<[^>]*>/g,'')
  .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(entity,key)=>{
   if(key[0]!=='#')return entities[key.toLowerCase()];
   const value=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):parseInt(key.slice(1),10);
   return value>0&&value<=0x10ffff?String.fromCodePoint(value):'�';
  }).replace(/\n{3,}/g,'\n\n').trim();
}
