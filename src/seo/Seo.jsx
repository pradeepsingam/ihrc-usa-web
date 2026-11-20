import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMetadata, headMarkup } from './metadata';

export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const template = document.createElement('template');
    template.innerHTML = headMarkup(getMetadata(pathname));
    document.head.querySelectorAll('[data-seo], title, meta[name="description"], meta[name="robots"], link[rel="canonical"]').forEach(node => node.remove());
    document.head.append(template.content);
  }, [pathname]);
  return null;
}
