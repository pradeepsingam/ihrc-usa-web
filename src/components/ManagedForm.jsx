import {forms,awardCategories} from '../content';
import {additionalForms} from '../data/additionalForms';
import RegistrationForm from './RegistrationForm';

export default function ManagedForm({slug,initialValues={}}){
 const source=forms[slug]||additionalForms[slug];
 if(!source||source.published===false)return <p role="status">This form is currently unavailable.</p>;
 const spec=slug==='award-nomination'?{...source,sections:source.sections.map(section=>({...section,blocks:section.blocks.map(b=>b.id==='category'&&b.t==='text'&&awardCategories.length?{...b,t:'select',opts:awardCategories.map(a=>a.name)}:b)}))}:source;
 return <RegistrationForm key={slug} spec={spec} initialValues={initialValues}/>;
}
