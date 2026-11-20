import {Component} from 'react';
import {AlertTriangle} from 'lucide-react';
import {siteInfo} from '../content';

// If something on a page fails, show a clear message (the menu and footer stay) instead of a white screen.
export default class ErrorBoundary extends Component{
  constructor(p){super(p);this.state={error:null}}
  static getDerivedStateFromError(error){return {error}}
  componentDidCatch(error,info){console.error('Page error:',error,info&&info.componentStack)}
  render(){
    if(!this.state.error)return this.props.children;
    return <div role="alert" className="mx-auto my-12 max-w-xl rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-red-100">
      <AlertTriangle className="mx-auto mb-2 text-red-600" size={32}/>
      <h1 className="font-serif text-xl font-bold text-navy">Something went wrong on this page</h1>
      <p className="mt-2 text-sm text-slate-600">Please reload the page and try again. If it keeps happening, email us at <a className="text-brand underline" href={'mailto:'+siteInfo.email}>{siteInfo.email}</a>.</p>
      <p className="mt-2 break-words text-xs text-slate-400">Details: {String(this.state.error&&this.state.error.message||this.state.error)}</p>
      <button onClick={()=>location.reload()} className="mt-4 rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-brand">Reload page</button>
    </div>;
  }
}
