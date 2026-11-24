import { mkdir, cp, copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { books } from '../src/catalog.mjs';
import { layout, policies, cta } from '../src/components.mjs';
import { home } from '../src/home.mjs';
import { shop, detail, services, about, contact, faqPage, shopping, success, policyPage } from '../src/pages.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const development=process.argv.includes('--development');
const output=path.join(root,development?'.preview':'dist');
const staticDir=path.join(output,'assets');
await mkdir(staticDir,{recursive:true});
await cp(path.join(root,'assets'),staticDir,{recursive:true});
await copyFile(path.join(root,'src/app.js'),path.join(staticDir,'app.js'));
await copyFile(path.join(root,'src/catalog.mjs'),path.join(staticDir,'catalog.js'));
await copyFile(path.join(root,'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'),path.join(staticDir,'manrope.woff2'));
const css=await Promise.all(['style.css','layouts.css'].map(f=>readFile(path.join(root,'src',f),'utf8')));
await writeFile(path.join(staticDir,'style.css'),css.join('\n'));
const pages=[
 ['/','Practical eBooks for a Smarter Tomorrow','Discover Digihub eBooks for study, career and personal growth. Browse topic collections at ₹299 per eBook.',home(development)],
 ['/shop/','eBook Shop','Browse, filter and compare the Digihub preview collection.',shop()],
 ['/services/','Services','Digital publishing, curated reading, access information and reader support.',services()],
 ['/about/','About Us','Discover the approach behind Digihub’s digital learning collections.',about()],
 ['/contact/','Contact Us','Send an enquiry to Digihub about titles, purchases or reading access.',contact()],
 ['/faq/','Frequently Asked Questions','Answers about pricing, the checkout preview, digital access and support.',faqPage()],
 ['/cart/','Shopping Cart','Review your selected eBooks and total in Indian rupees.',shopping(false)],
 ['/checkout/','Checkout','Review your selected eBooks and payment availability.',shopping(true)],
 ['/order-success/','Order Status','Check verified purchase and delivery status.',success()],
 ...books.map(b=>[`/books/${b.slug}/`,b.title,b.description,detail(b)]),
 ...policies.map(([id,title])=>[`/policies/${id}/`,title,`Current Digihub storefront information for ${title.toLowerCase()}.`,policyPage(id,title)])
];
for(const [url,title,desc,body] of pages){
 const dir=path.join(output,url);await mkdir(dir,{recursive:true});await writeFile(path.join(dir,'index.html'),layout(url,title,desc,body));
}
await writeFile(path.join(output,'404.html'),layout('/404/','Page not found','Find your way back to the Digihub collection.',`<section class="wrap section empty"><h1>Page not found</h1><p>That page is no longer on the bookshelf.</p>${cta('Browse eBooks')}</section>`));
console.log(`Built ${pages.length} pages and a 404 page in ${output}`);


