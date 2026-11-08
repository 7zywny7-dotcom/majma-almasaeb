const CACHE='majma-v2';
const CORE=[
 './','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
 './cover1.jpg','./cover2.jpg','./cover3.jpg','./cover4.jpg',
 './data1.json','./data2.json','./data3.json','./data4.json',
 './boxes1.json','./boxes2.json','./boxes3.json','./boxes4.json'
];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(hit=>{
      if(hit)return hit;
      return fetch(e.request).then(res=>{
        if(res && res.status===200){
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        }
        return res;
      }).catch(()=>hit);
    })
  );
});
