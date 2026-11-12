import {DONATE_URL} from '../config';

export default function DonateLink({className='',onClick,children}){
const external=/^https?:\/\//i.test(DONATE_URL);
return <a href={DONATE_URL} onClick={onClick} className={className} {...(external?{target:'_blank',rel:'noopener noreferrer'}:{})}>{children}</a>}
