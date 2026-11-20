import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import './index.css';
import {loadContent} from './lib/loadContent';

// Content from the Laravel admin panel is loaded first, then the app (which reads it) is imported.
loadContent().finally(async()=>{
  const {default:App}=await import('./App');
  createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
});
