import http from 'node:http';
import path from 'node:path';
import { mkdirSync, statSync, existsSync, createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const root=path.dirname(fileURLToPath(import.meta.url));
const site=path.join(root,process.argv.includes('--development')?'.preview':'dist');
if(!existsSync(path.join(site,'index.html')))throw new Error('Build the storefront with npm run build before starting the server.');
const data=path.resolve(process.env.DIGIHUB_DATA_DIR||path.join(root,'.data'));
if(data===site||data.startsWith(site+path.sep))throw new Error('The data directory must be outside the public site.');
mkdirSync(data,{recursive:true});
const db=new DatabaseSync(path.join(data,'digihub.sqlite'));
db.exec(`PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS subscriptions(email TEXT PRIMARY KEY, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS enquiries(id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, subject TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
const subscribe=db.prepare('INSERT INTO subscriptions(email) VALUES(?) ON CONFLICT(email) DO NOTHING');
const enquiry=db.prepare('INSERT INTO enquiries(id,name,email,phone,subject,message) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING');
const subjects=['Catalog enquiry','Order enquiry','Reading access','Other'];
const emailOK=v=>typeof v==='string'&&v.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const field=(v,max,min=1)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max;
const json=(res,status,ok=false)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({ok}));};
const hits=new Map();
setInterval(()=>{const now=Date.now();for(const [ip,v] of hits)if(v.until<=now)hits.delete(ip);},60000).unref();
async function submission(req,res,route){
 if(req.method!=='POST')return json(res,405);
 if(req.headers['content-type']?.split(';')[0]!=='application/json')return json(res,415);
 if(req.headers['sec-fetch-site']==='cross-site')return json(res,403);
 const ip=req.socket.remoteAddress, now=Date.now();
 let limit=hits.get(ip);if(!limit||limit.until<now){limit={n:0,until:now+60000};hits.set(ip,limit);}
 if(++limit.n>30)return json(res,429);
 const chunks=[];let length=0;
 for await(const chunk of req){length+=chunk.length;if(length>24576)return json(res,413);chunks.push(chunk);}
 let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return json(res,400);}
 if(!body||!emailOK(body.email))return json(res,422);
 const email=body.email.trim().toLowerCase();
 if(route==='/api/newsletter')subscribe.run(email);
 else{
  const {id,name,phone='',subject,message}=body;
  if(!field(id,36,36)||!/^[a-f0-9-]{36}$/i.test(id)||!field(name,100)||!field(phone,30,0)||!subjects.includes(subject)||!field(message,4000,5))return json(res,422);
  enquiry.run(id,name.trim(),email,phone.trim(),subject,message.trim());
 }
 json(res,200,true);
}
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 try{
  const url=new URL(req.url,'http://localhost'),route=decodeURIComponent(url.pathname);
  if(route==='/api/contact'||route==='/api/newsletter')return await submission(req,res,route);
  if(!['GET','HEAD'].includes(req.method))return json(res,405);
  if(route.includes('\\')||route.includes('\0')||route.includes(':')||route.split('/').some(s=>s.startsWith('.')))return json(res,404);
  let file=path.resolve(site,'.'+route);
  if(file!==site&&!file.startsWith(site+path.sep))return json(res,404);
  if(statSync(file,{throwIfNoEntry:false})?.isDirectory()){
   if(!route.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});return res.end();}
   file=path.join(file,'index.html');
  }
  const found=statSync(file,{throwIfNoEntry:false})?.isFile();
  if(!found)file=path.join(site,'404.html');
  res.writeHead(found?200:404,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});
  if(req.method==='HEAD')return res.end();
  createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 }catch(error){if(!res.headersSent)json(res,error instanceof URIError?400:500);else res.end();}
});
server.listen(Number(process.env.PORT||4173),process.env.HOST||'127.0.0.1',()=>{const {address,port}=server.address();console.log(`Digihub is listening at http://${address}:${port}`);});


