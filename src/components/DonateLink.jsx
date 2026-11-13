import {Link} from 'react-router-dom';
import {DONATE_URL} from '../config';

export default function DonateLink({className='',onClick,children}){
const external=/^https?:\/\//i.test(DONATE_URL);
return external
?<a href={DONATE_URL} onClick={onClick} className={className} target="_blank" rel="noopener noreferrer">{children}</a>
:<Link to="/donation" onClick={onClick} className={className}>{children}</Link>}
