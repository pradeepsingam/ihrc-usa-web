import {CreditCard} from 'lucide-react';
import {PAYMENT_URL} from '../config';

export const paymentReady=/^https?:\/\//i.test(PAYMENT_URL);

// "Pay Online" button. The link comes from PAYMENT_URL in src/config.js.
export default function PayButton({label='Pay Online'}){
 const base='inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold ';
 if(paymentReady)return <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" className={base+'bg-gold text-navy hover:brightness-95'}><CreditCard size={16}/>{label}</a>;
 return <span className="inline-flex flex-col items-start gap-1"><button type="button" disabled aria-disabled="true" className={base+'cursor-not-allowed bg-slate-200 text-slate-500'}><CreditCard size={16}/>{label}</button><span className="text-xs text-slate-500">Online payment link coming soon.</span></span>}
