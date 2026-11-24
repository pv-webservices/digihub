import { readFileSync } from 'node:fs';
import { categories, books, categoryOf, money, faqs } from './catalog.mjs';

const cache = new Map();
function icon(name, size=20) {
  if (!cache.has(name)) cache.set(name,readFileSync(new URL(`../node_modules/lucide-static/icons/${name}.svg`,import.meta.url),'utf8').match(/<svg[\s\S]*?<\/svg>/)[0]);
  return cache.get(name).replace('<svg ', '<svg aria-hidden="true" focusable="false" ').replace('width="24"',`width="${size}"`).replace('height="24"',`height="${size}"`);
}
const logo = '<img class="logo" src="/assets/digihub.webp" width="540" height="160" alt="Digihub — eBooks for a Smarter Tomorrow">';
const links=[['/','Home'],['/shop/','eBooks'],['/services/','Services'],['/about/','About Us'],['/contact/','Contact']];
const policies = [['privacy','Privacy Policy'],['terms','Terms & Conditions'],['refund','Refund & Cancellation'],['delivery','Digital Delivery Policy']];
const cta=(label,url='/shop/',style='gold')=>`<a class="btn ${style}" href="${url}">${label}${icon('arrow-right',17)}</a>`;
const eyebrow=label=>`<div class="eyebrow">${label}</div>`;
const heading=(label,title,subtitle='')=>`<div class="section-heading">${eyebrow(label)}<h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div>`;
const crumb=(name,parent='')=>`<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a>${icon('chevron-right',14)}${parent?`<a href="/shop/">eBooks</a>${icon('chevron-right',14)}`:''}<span>${name}</span></nav>`;
const pageIntro=(label,title,copy)=>`<section class="intro"><div class="wrap">${crumb(label)}${eyebrow(label)}<h1>${title}</h1><p>${copy}</p></div></section>`;
function header(path){
 const nav=links.map(([url,title])=>`<a ${path===url||(url==='/shop/'&&path.startsWith('/books/'))?'aria-current="page"':''} href="${url}">${title}</a>`).join('');
 return `<a class="skip" href="#main">Skip to content</a><header id="header"><div class="wrap nav-row"><a href="/" class="brand">${logo}</a><nav class="primary" aria-label="Main">${nav}</nav><div class="nav-tools"><button class="icon-btn" data-search aria-label="Search eBooks">${icon('search',22)}</button><a class="icon-btn cart-link" href="/cart/" aria-label="Shopping cart">${icon('shopping-cart',22)}<span data-count>0</span></a>${cta('Get eBooks Now')}<button class="icon-btn burger" id="burger" aria-label="Toggle navigation" aria-controls="mobile-nav" aria-expanded="false">${icon('menu',24)}</button></div></div><nav id="mobile-nav" aria-label="Mobile">${nav}</nav></header>
 <dialog id="search-dialog"><div class="dialog-head"><h2>Search the collection</h2><button class="icon-btn" data-close aria-label="Close search">${icon('x')}</button></div><form action="/shop/" class="search-box">${icon('search')}<input name="q" type="search" aria-label="Search by title or topic" placeholder="Search by title or topic" autofocus><button class="btn navy">Search</button></form></dialog>`;
}
function footer(){
 return `<footer><div class="wrap foot-grid"><div><a class="foot-brand" href="/"><img src="/assets/icon.png" alt="" width="42" height="42">Digihub</a><p>eBooks for a Smarter Tomorrow</p><p>Practical digital reading for learning, work and everyday life.</p></div><div><h3>Quick links</h3>${links.map(([u,t])=>`<a href="${u}">${t}</a>`).join('')}</div><div><h3>eBook categories</h3>${categories.map(c=>`<a href="/shop/?category=${c.id}">${c.name}</a>`).join('')}</div><div><h3>Services & support</h3><a href="/services/">Digital publishing</a><a href="/services/#how-it-works">How it works</a><a href="/faq/">Frequently asked questions</a><a href="/contact/">Contact Digihub</a></div></div><div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} Digihub</span><div>${policies.map(([u,t])=>`<a href="/policies/${u}/">${t}</a>`).join('')}</div></div></footer>`;
}
function cover(b, eager=false){
 return b.cover?`<img class="book-cover" src="${b.cover}" width="148" height="155" alt="${b.title} cover" ${eager?'':'loading="lazy"'}>`:`<div class="drawn-cover" aria-label="${b.title} cover"><small>DIGIHUB</small><strong>Small Steps,<br>Lasting Growth</strong>${icon('sprout',54)}</div>`;
}
function card(b) {
 const cat=categoryOf(b);
 return `<article class="book-card" data-book="${b.slug}" data-category="${b.category}"><a class="book-art tone-${b.category}" href="/books/${b.slug}/" aria-label="View ${b.title}">${cover(b)}</a><div class="book-info"><span class="meta">${cat.name}</span><h3><a href="/books/${b.slug}/">${b.title}</a></h3><p>${b.description}</p><div class="price-row"><strong>${money(b.price)}</strong><span>Sample title</span></div><div class="book-actions"><a href="/books/${b.slug}/">View details ${icon('arrow-up-right',14)}</a><button type="button" data-add="${b.id}" aria-label="Add ${b.title} to cart">${icon('shopping-cart',15)} Add</button></div></div></article>`;
}
function faq(items=faqs){
 return `<div class="accordion">${items.map(([q,a])=>`<details><summary>${q}${icon('plus',18)}</summary><p>${a}</p></details>`).join('')}</div>`;
}
function promo(){
 return `<section class="wrap promo"><div class="promo-art" aria-hidden="true"></div><div>${eyebrow('The Digihub collection')}<h2>Premium eBooks <span>₹299 each.</span></h2></div>${cta('Explore eBooks Now')}</section>`;
}
function newsletter(){
 return `<section class="newsletter wrap"><div class="news-label">${icon('mail-open',34)}<div><h3>Stay updated with new eBooks</h3><p>Get news about new titles and collections.</p></div></div><form data-api="newsletter"><div class="news-input"><label class="sr" for="news-email">Email address</label><input required id="news-email" type="email" name="email" maxlength="254" autocomplete="email" placeholder="Enter your email address"><button class="btn gold">Subscribe ${icon('arrow-right',15)}</button></div><span class="form-status" role="status"></span></form></section>`;
}
function layout(path,title,description,body){
 return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Digihub</title><meta name="description" content="${description}"><meta name="theme-color" content="#071d3b"><link rel="icon" href="/assets/icon.png"><link rel="preload" href="/assets/manrope.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/style.css"><script type="module" src="/assets/app.js"></script></head><body>${header(path)}<main id="main">${body}</main>${footer()}<div class="toast" role="status" aria-live="polite"></div></body></html>`;
}

export { icon, logo, cta, eyebrow, heading, crumb, pageIntro, cover, card, faq, promo, newsletter, layout, policies };
