import {useEffect,useState} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {API_URL} from '../config';
import {news,events,projects,forms} from '../content';
import {texts,pageBgs} from '../data';
import {Page} from '../components/UI';

// Admin "Preview" button: shows unsaved changes on the real page layout.
// The backend keeps the preview for 30 minutes under a random token (GET /api/preview/<token>).
const ID='__preview';
const put=(list,item)=>{const i=list.findIndex(x=>x.id===ID);if(i>=0)list.splice(i,1);list.unshift({...item,id:ID})};

export default function Preview(){
  const{token}=useParams();const nav=useNavigate();const[err,setErr]=useState('');
  useEffect(()=>{let live=true;
    fetch(API_URL+'/api/preview/'+encodeURIComponent(token),{headers:{Accept:'application/json'}})
      .then(r=>r.ok?r.json():Promise.reject(r.status))
      .then(({type,item})=>{if(!live)return;
        if(type==='news'){put(news,item);nav('/news/'+ID+'?preview=1',{replace:true})}
        else if(type==='event'){put(events,item);nav('/events/'+ID+'?preview=1',{replace:true})}
        else if(type==='project'){put(projects,item);nav('/projects/'+ID+'?preview=1',{replace:true})}
        else if(type==='form'){forms[ID]=item;nav('/forms/'+ID+'?preview=1',{replace:true})}
        else if(type==='page'){texts[ID]=item;if(item.image)pageBgs['preview-page']=item.image;else delete pageBgs['preview-page'];nav('/preview-page?preview=1',{replace:true})}
        else setErr('Unknown preview type.')})
      .catch(s=>live&&setErr(s===404?'This preview has expired. Press Preview again in the admin panel.':'The preview could not be loaded.'));
    return()=>{live=false}},[token]);
  return <Page title="Preview" sub={err||'Loading preview…'}/>;
}
