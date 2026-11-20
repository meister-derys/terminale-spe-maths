/* Hors ligne : la page, les démonstrations et KaTeX sont gardés sur l'appareil. Le serveur Google n'est jamais mis en cache. */
const V='ts-v1';
const FILES=['./','index.html','demonstrations.html','katex/katex.min.css','katex/katex.min.js','katex/auto-render.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;   // appels au serveur : toujours en direct
  // réseau d'abord pour les pages (dernière version), cache en secours ; cache d'abord pour KaTeX
  if(/\.html$|\/$/.test(u.pathname)){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const c=x.clone();caches.open(V).then(y=>y.put(e.request,c));return x})));
  }
});
