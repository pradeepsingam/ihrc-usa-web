import {Link} from 'react-router-dom';

// Membership calls to action share the same destination.
export default function JoinLink({className='',onClick,children}){
return <Link to="/membership" onClick={onClick} className={className}>{children}</Link>}
