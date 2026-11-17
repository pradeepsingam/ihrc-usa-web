import {Link} from 'react-router-dom';

// Every "Donate" button opens the donation form first; the payment step comes after the form (see PayButton).
export default function DonateLink({className='',onClick,children}){
return <Link to="/donation" onClick={onClick} className={className}>{children}</Link>}
