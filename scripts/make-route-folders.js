import {mkdirSync,copyFileSync} from 'fs';
const routes=['privacy-policy','terms','refund'];
for(const r of routes){mkdirSync('dist/'+r,{recursive:true});copyFileSync('dist/index.html','dist/'+r+'/index.html');}
console.log('Created folders:',routes.join(', '));
