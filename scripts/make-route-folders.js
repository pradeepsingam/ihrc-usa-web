import {mkdirSync,copyFileSync} from 'fs';
const routes=['privacy-policy','terms','refund','disclaimer','who-we-are','chairman-message','vision-mission','objectives','constitution','human-rights','programs','leadership','general-assembly','commissioners','ambassadors','volunteers','global-network','membership','apply','membership-benefits','verify','volunteer','events','news','publications','awards','partnerships','partnership-application','donation','report-concern','contact','search'];
for(const r of routes){mkdirSync('dist/'+r,{recursive:true});copyFileSync('dist/index.html','dist/'+r+'/index.html');}
console.log('Created folders:',routes.length);
