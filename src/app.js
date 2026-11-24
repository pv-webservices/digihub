import { books, categories, categoryOf, money } from './catalog.js';

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const burger=$('#burger');
function closeMenu(){burger.setAttribute('aria-expanded','false');$('#mobile-nav').classList.remove('open');}
burger.addEventListener('click',()=>{const open=burger.getAttribute('aria-expanded')!=='true';burger.setAttribute('aria-expanded',String(open));$('#mobile-nav').classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&burger.getAttribute('aria-expanded')==='true'){closeMenu();burger.focus();}});
matchMedia('(min-width: 901px)').addEventListener('change',closeMenu);
const dialog=$('#search-dialog');
$('[data-search]').onclick=()=>{closeMenu();dialog.showModal();$('input',dialog).focus();};
$('[data-close]').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const header=$('#header');
const sticky=()=>header.classList.toggle('scrolled',scrollY>16);
sticky(); addEventListener('scroll',sticky,{passive:true});
if('IntersectionObserver' in window&&!reduced.matches){
 const io=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('seen');io.unobserve(target);}}),{threshold:.05});
 $$('.reveal').forEach(el=>{el.classList.add('observe');io.observe(el);});
}

const shelf=$('.shelf');
if(shelf){
 const buttons=[$('.prev'),$('.next')];
 const update=()=>{buttons[0].disabled=shelf.scrollLeft<2;buttons[1].disabled=shelf.scrollLeft+shelf.clientWidth>=shelf.scrollWidth-2;};
 buttons.forEach((b,i)=>b.onclick=()=>shelf.scrollBy({left:(i?1:-1)*(shelf.firstElementChild.offsetWidth+18),behavior:reduced.matches?'instant':'smooth'}));
 shelf.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(shelf);update();
}

const form=$('#filters');
if(form){
 const grid=$('#catalog'),query=$('#query'),category=$('#category'),sort=$('#sort'),more=$('#load-more');
 const cards=new Map($$('.book-card',grid).map(card=>[card.dataset.book,card]));
 let limit=4;
 function read(){
  const p=new URLSearchParams(location.search);
  query.value=p.get('q')||'';category.value=categories.some(c=>c.id===p.get('category'))?p.get('category'):'';
  sort.value=['az','za'].includes(p.get('sort'))?p.get('sort'):'featured';limit=4;
 }
 function render(sync){
  const q=query.value.trim().toLowerCase();
  const matches=books.filter(b=>(!category.value||b.category===category.value)&&[b.title,b.description,categoryOf(b).name].join(' ').toLowerCase().includes(q));
  if(sort.value!=='featured')matches.sort((a,b)=>a.title.localeCompare(b.title)*(sort.value==='az'?1:-1));
  grid.replaceChildren(...matches.slice(0,limit).map(b=>cards.get(b.id)));
  $('#results').textContent=`${matches.length} sample eBook${matches.length===1?'':'s'}${matches.length>limit?' · Showing '+limit:''}`;
  $('#empty-search').hidden=!!matches.length;more.hidden=matches.length<=limit;
  if(sync){const p=new URLSearchParams();if(q)p.set('q',query.value.trim());if(category.value)p.set('category',category.value);if(sort.value!=='featured')p.set('sort',sort.value);history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));}
 }
 form.oninput=()=>{limit=4;render(true);};
 form.onsubmit=e=>{e.preventDefault();render(true);};
 form.onreset=e=>{e.preventDefault();query.value='';category.value='';sort.value='featured';limit=4;render(true);query.focus();};
 $('#clear-filters').onclick=()=>form.reset();
 more.onclick=()=>{const prev=grid.children.length;limit+=4;render(false);grid.children[prev]?.querySelector('a')?.focus({preventScroll:true});};
 addEventListener('popstate',()=>{read();render(false);});read();render(false);
}

const tabs=$$('[role="tab"]');
function selectTab(index){
 tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(index===i));tab.tabIndex=index===i?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=i!==index;});
 tabs[index].focus();
}
tabs.forEach((tab,i)=>{tab.onclick=()=>selectTab(i);tab.onkeydown=e=>{const idx={ArrowLeft:(i+tabs.length-1)%tabs.length,ArrowRight:(i+1)%tabs.length,Home:0,End:tabs.length-1}[e.key];if(idx!==undefined){e.preventDefault();selectTab(idx);}};});

const storageKey='digihub.cart.v1';
const getBook=id=>books.find(b=>b.id===id);
function readCart(){
 try{const ids=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(ids)?[...new Set(ids.filter(id=>getBook(id)))]:[];}catch{return [];}
}
let cart=readCart(),toastTimer;
function toast(message,withCart=false){
 const el=$('.toast');el.replaceChildren(document.createTextNode(message));if(withCart){const a=document.createElement('a');a.href='/cart/';a.textContent='View cart';el.append(a);}
 el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4500);
}
function saveCart(next){
 try{localStorage.setItem(storageKey,JSON.stringify(next));cart=next;syncCart();return true;}catch{toast('Your browser could not save this cart. Enable local storage and try again.');return false;}
}
const purchase=$('#purchase');
function syncCart(){
 $('[data-count]').textContent=cart.length;$('.cart-link').setAttribute('aria-label',`Shopping cart, ${cart.length} items`);
 if(!purchase)return;
 if(!cart.length){purchase.innerHTML='<div class="empty"><h2>Your book bag is empty</h2><p>Choose a title from the collection to start your reading list.</p><a class="btn gold" href="/shop/">Explore eBooks →</a></div>';return;}
 const checkout=purchase.dataset.mode==='checkout',selected=cart.map(getBook);
 const rows=selected.map(b=>`<div class="cart-item">${b.cover?`<img src="${b.cover}" width="65" height="74" alt="">`:'<span class="mini-cover">DG</span>'}<div><small>${categoryOf(b).name}</small><h3><a href="/books/${b.slug}/">${b.title}</a></h3><span>Sample eBook</span></div><div><strong>${money(b.price)}</strong>${checkout?'':`<button class="remove" data-remove="${b.id}" aria-label="Remove ${b.title}">Remove</button>`}</div></div>`).join('');
 const total=money(selected.reduce((sum,b)=>sum+b.price,0));
 const summary=`<aside class="box summary"><h2>Order summary</h2>${checkout?selected.map(b=>`<div class="summary-line"><span>${b.title}</span><strong>${money(b.price)}</strong></div>`).join(''):`<div class="summary-line"><span>${cart.length} eBook${cart.length>1?'s':''}</span><strong>${total}</strong></div>`}<div class="summary-total"><strong>Total</strong><strong>${total}</strong></div>${checkout?'<button class="btn muted" disabled>Payments currently closed</button><a class="text-link" href="/cart/">Return to cart</a>':'<a class="btn gold" href="/checkout/">Proceed to Checkout →</a><a class="text-link" href="/shop/">Continue browsing</a>'}</aside>`;
 purchase.innerHTML=`<div class="purchase-grid">${checkout?`<section class="box"><h2>Contact details</h2><p>Sales are currently closed. Contact details will be collected when payments open.</p><fieldset disabled class="form-grid"><label>Your name<input autocomplete="name"></label><label>Email address<input type="email" autocomplete="email"></label></fieldset><h3>Payment method</h3><div class="notice">No payment provider is active. Your cart will stay saved on this device.</div></section>`:`<div class="box"><h2>Selected eBooks</h2>${rows}</div>`}${summary}</div>`;
}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-add],[data-buy],[data-remove]');if(!button)return;
 cart=readCart();
 if(button.dataset.remove){if(saveCart(cart.filter(id=>id!==button.dataset.remove))){toast('Book removed from your cart.');(purchase.querySelector('.remove')||purchase.querySelector('.btn'))?.focus();}return;}
 const id=button.dataset.add||button.dataset.buy;if(!getBook(id))return;
 const exists=cart.includes(id);if(!exists&&!saveCart([...cart,id]))return;
 if(button.dataset.buy)location.assign('/checkout/');else toast(exists?'This book is already in your cart.':'Book added to your cart.',true);
});
addEventListener('storage',e=>{if(e.key===storageKey||e.key===null){cart=readCart();syncCart();}});addEventListener('pageshow',()=>{cart=readCart();syncCart();});syncCart();

$$('[data-api]').forEach(form=>form.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const button=$('button',form),status=$('.form-status',form),newsletter=form.dataset.api==='newsletter';
 if(button.disabled)return;
 button.disabled=true;button.setAttribute('aria-busy','true');status.textContent='Saving…';
 try{
  const payload=Object.fromEntries(new FormData(form));
  if(!newsletter){
   const draft=JSON.stringify(payload);
   if(form._draft!==draft){form._draft=draft;form._submission=crypto.randomUUID();}
   payload.id=form._submission;
  }
  const res=await fetch('/api/'+form.dataset.api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(12000)});
  const data=await res.json();if(!res.ok||data.ok!==true)throw new Error();
  status.textContent=newsletter?'Your email is on the updates list.':'Your message has been saved for the Digihub team.';form.reset();delete form._draft;
 }catch{status.textContent='Could not confirm your submission. Check your connection and try again.';}
 finally{button.disabled=false;button.removeAttribute('aria-busy');}
}));


