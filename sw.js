const V='1.3.0',CORE='son-core-'+V,TEMAS='son-temas',EXT='son-ext';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable.png','./temas.json'];
const JS='https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js',FC='https://fonts.googleapis.com/css2?family=Bangers&family=Patrick+Hand&display=swap';
self.addEventListener('install',e=>{e.waitUntil((async()=>{
 const c=await caches.open(CORE);await Promise.all(FILES.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})));
 const x=await caches.open(EXT);
 try{await x.put(JS,await fetch(new Request(JS,{mode:'no-cors'})))}catch(_){}
 try{const r=await fetch(FC),t=await r.clone().text();await x.put(FC,r);for(const u of new Set(t.match(/https:\/\/[^)\s]+\.woff2/g)||[]))try{await x.add(u)}catch(_){}}catch(_){}
})())});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('son-core-')&&k!=CORE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('message',e=>{if(e.data=='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);
 if(u.origin==location.origin){
  if(/\/tema-[^/]+$/.test(u.pathname))return e.respondWith(first(r,TEMAS));
  if(/\/icon-[^/]+$/.test(u.pathname))return e.respondWith(first(r,CORE));
  return e.respondWith(net(r))}
 if(/cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.hostname))e.respondWith(swr(r,EXT))});
async function first(r,n){const c=await caches.open(n),m=await c.match(r);if(m)return m;const f=await fetch(r);if(f.ok)c.put(r,f.clone());return f}
async function net(r){const c=await caches.open(CORE);try{const f=await Promise.race([fetch(r,{cache:'no-cache'}),new Promise((_,j)=>setTimeout(j,4000))]);if(f&&f.ok)c.put(r,f.clone());return f}
 catch(_){return (await c.match(r,{ignoreSearch:true}))||(r.mode=='navigate'?(await c.match('./index.html'))||(await c.match('./')):null)||Response.error()}}
async function swr(r,n){const c=await caches.open(n),m=await c.match(r),f=fetch(r).then(x=>{if(x.ok||x.type=='opaque')c.put(r,x.clone());return x}).catch(()=>m);return m||f}
