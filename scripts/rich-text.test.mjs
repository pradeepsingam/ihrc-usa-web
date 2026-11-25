import test from 'node:test';
import assert from 'node:assert/strict';
import {htmlText} from '../src/lib/htmlText.js';

test('formatted articles have readable prerendered content without a browser DOM',()=>{
 assert.equal(htmlText('<h2>News &amp; updates</h2><p>First paragraph.</p><p>Human rights &#8212; for everyone.</p>'),'News & updates\nFirst paragraph.\nHuman rights — for everyone.');
});

test('prerendered text excludes scripts and active markup',()=>{
 assert.equal(htmlText('<script>alert(1)</script><p onclick="bad()">Visible</p><img src=x onerror="bad()"><style>body{display:none}</style>'),'Visible');
 assert.equal(htmlText('&lt;img src=x onerror=bad()&gt;'),'<img src=x onerror=bad()>');
});
