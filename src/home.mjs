import { categories, books } from './catalog.mjs';
import { icon, cta, eyebrow, heading, card, promo, newsletter } from './components.mjs';

const benefits=[
  ['book-open','Curated eBooks','Selected for curious minds'],
  ['download','Digital access','Books made for your screen'],
  ['shield-check','Secure purchase','Payment before access'],
  ['infinity','Convenient reading','Learn wherever you are']
];
const reasons=[
  ['zap','Curated & practical','Reading with real-world relevance.'],
  ['refresh-cw','Regular updates','Discover additions to the collection.'],
  ['headphones','Dedicated support','A place for your reading questions.'],
  ['tablet-smartphone','Read on any device','Browse on mobile, tablet or desktop.']
];
function home(development) {
return `<section class="hero"><div class="hero-art"><img src="/assets/library.webp" fetchpriority="high" width="585" height="290" alt="Digihub tablet beside a stack of learning books in a sunlit library"></div><div class="hero-curve"></div><div class="wrap hero-inner"><div class="hero-copy"><div class="hero-kicker">Read <i>›</i> Learn <i>›</i> Grow <b></b></div><h1>Discover High-Quality<br><em>eBooks to Learn,<br>Upskill &amp; Grow</em></h1><p>A curated collection of practical, easy-to-read eBooks for your learning, career and personal growth journey.</p><div class="hero-actions">${cta('Explore eBooks')}<a class="btn outline" href="/services/#how-it-works">${icon('circle-play',18)} How It Works</a></div><div class="hero-perks"><span>${icon('zap',17)} Instant access</span><span>${icon('shield-check',17)} Secure checkout</span><span>${icon('book-open',17)} Easy digital reading</span></div></div></div></section>
<section aria-label="Digihub benefits" class="wrap benefits">${benefits.map(([i,t,s])=>`<div>${icon(i,33)}<section><h3>${t}</h3><p>${s}</p></section></div>`).join('')}</section>
<section class="wrap categories-section">${heading('Browse by category','Explore eBooks for Every Goal','Find a collection that matches your interests and ambitions.')}<div class="category-grid">${categories.map((c,i)=>`<a class="category reveal" style="--accent:${c.color};--tint:${c.tint};--delay:${i*35}ms" href="/shop/?category=${c.id}">${icon(c.icon,35)}<strong>${c.name.replace(/ &amp; | & /,'<br>&amp; ')}</strong></a>`).join('')}</div></section>
<section class="why"><div class="wrap why-grid"><div class="why-intro reveal">${eyebrow('Why choose Digihub')}<h2>A Smarter Way to <em>Learn with eBooks</em></h2><p>Practical, affordable eBooks that help you learn a skill, explore an interest or take the next step in your career.</p>${cta('Know More About Us','/about/')}</div><div class="reader-art reveal"><img src="/assets/reader.webp" width="346" height="232" loading="lazy" alt="A reader in a gold sweater enjoying an eBook on her tablet"></div><div class="reasons">${reasons.map(([i,t,s])=>`<div><span>${icon(i,23)}</span><section><h3>${t}</h3><p>${s}</p></section></div>`).join('')}</div></div></section>
<section class="wrap featured">${heading('Featured eBooks','Popular eBooks You’ll Love','Explore sample titles from the upcoming collection.')}<div class="shelf-wrap"><button class="shelf-arrow prev" aria-label="Previous books">${icon('chevron-left')}</button><div class="shelf" aria-label="Featured eBooks" tabindex="0">${books.map(card).join('')}</div><button class="shelf-arrow next" aria-label="Next books">${icon('chevron-right')}</button></div><div class="center">${cta('Browse all eBooks','/shop/','light')}</div></section>
${development?`<section class="review-section"><div class="wrap reviews"><div>${eyebrow('Development preview')}<h2>What Our<br>Readers Say</h2></div>${[['A','Student reader','A clear starting point for choosing what to read next.'],['B','Professional reader','I like being able to browse topics around my work.']].map(([a,t,s])=>`<article><span class="avatar">${a}</span><div><small>Sample review</small><h3>${t}</h3><p>“${s}”</p></div></article>`).join('')}</div></section>`:''}
${promo()}${newsletter()}`;
}

export { home };
