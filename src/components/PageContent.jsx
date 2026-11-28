import {Card,RichText,Gallery} from './UI';
import {forms} from '../content';
import RegistrationForm from './RegistrationForm';

export default function PageContent({page}){
 return <>{page.b?.length>0&&<div className="mb-8 space-y-5">{page.b.map(([heading,body],index)=><Card key={index}><h2 className="font-serif text-xl font-bold text-navy">{heading}</h2><RichText text={body} cls="mt-3"/></Card>)}</div>}{page.images?.length>0&&<div className="mb-8"><Gallery images={page.images} alt={page.title}/></div>}{page.form&&forms[page.form]&&<div className="mb-8"><RegistrationForm spec={forms[page.form]}/></div>}</>;
}
