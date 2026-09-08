const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const out = path.resolve(process.env.QA_OUTPUT_DIR || path.join(root, '../outputs/pr1-qa'));
fs.mkdirSync(out, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site-source-manifest.json')));
const production = 'https://aries-blackstone.com';
const routes = fs.readFileSync(path.join(root, '_redirects'), 'utf8').trim().split(/\r?\n/).map(x => x.split(/\s+/));
const mime = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.jpeg':'image/jpeg', '.jpg':'image/jpeg', '.svg':'image/svg+xml'};
const server = http.createServer((req, res) => {
  let route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const rule = routes.find(r => r[0] === route);
  if (rule && rule[2] !== '200') { res.writeHead(Number(rule[2]), {Location:rule[1]}); return res.end(); }
  route = rule ? rule[1] : route === '/' ? '/index.html' : route;
  const file = path.join(root, route);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
const norm = s => s.replace(/\s+/g, ' ').trim();
const remoteCache = new Map();
const remote = url => {
 if (!remoteCache.has(url)) remoteCache.set(url, (async()=>{
  const response = await fetch(url,{signal:AbortSignal.timeout(45000)});
  const headers = Object.fromEntries(response.headers);
  delete headers['content-encoding']; delete headers['content-length'];
  return {status:response.status,headers,body:Buffer.from(await response.arrayBuffer())};
 })());
 return remoteCache.get(url);
};
(async () => {
 await new Promise(r => server.listen(3003, '127.0.0.1', r));
 const browser = await chromium.launch({headless:true, ...(process.env.QA_BROWSER_PATH ? {executablePath:process.env.QA_BROWSER_PATH} : {})});
 const previous = process.env.QA_LOCAL_ONLY ? JSON.parse(fs.readFileSync(path.join(out,'report.json'))) : null;
 const report = {date:new Date().toISOString(), results:[], source:[]};
 try {
  for (const file of ['script.js','styles.css','children.html','desktop-fixes.css','quantum-series.html']) {
   const response = await fetch(production + '/' + file);
   const text = await response.text();
   fs.writeFileSync(path.join(out, 'production-' + file.replaceAll('/', '_') + '.txt'), text);
   const local = fs.readFileSync(path.join(root,file),'utf8');
   report.source.push({file,status:response.status,equal:norm(text)===norm(local),productionPinned:(text.match(/pinned/gi)||[]).length,localPinned:(local.match(/pinned/gi)||[]).length});
  }
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
   for (let start=0; start<manifest.routes.length; start+=4) {
   await Promise.all(manifest.routes.slice(start,start+4).map(async entry => {
    const pair = {route:entry.route,viewport,sites:{}};
    for (const [site, base] of [['production',production],['local','http://127.0.0.1:3003']]) {
     if (site==='production' && previous) {
      pair.sites.production=previous.results.find(p=>p.route===entry.route&&p.viewport.width===viewport.width).sites.production;
      continue;
     }
     const context = await browser.newContext({viewport,deviceScaleFactor:1,isMobile:viewport.width<500,hasTouch:viewport.width<500});
     const page = await context.newPage();
     await context.route('https://**/*', async route => {
      try {
       await route.fulfill(await remote(route.request().url()));
      } catch {await route.abort('failed');}
     });
     const errors = [], failed = [], httpErrors = [];
     page.on('pageerror', e => errors.push(e.message));
     page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
     page.on('requestfailed', r => failed.push({url:r.url(),error:r.failure()?.errorText}));
     page.on('response', r => {if(r.status()>=400) httpErrors.push({url:r.url(),status:r.status()});});
     try {
      console.log('Checking',viewport.width,entry.route,site);
      await page.goto(base+entry.route, {waitUntil:'domcontentloaded',timeout:25000});
      await page.waitForTimeout(2000);
      const top = await page.evaluate(() => {
       const body=document.body.cloneNode(true); body.querySelectorAll('script,style').forEach(e=>e.remove());
       return {url:location.href,title:document.title,text:body.textContent.replace(/\s+/g,' ').trim()};
      });
      for (let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=650) {
       await page.evaluate(y=>window.scrollTo(0,y),y); await page.waitForTimeout(70);
       if(y>30000) throw new Error('Unbounded page height');
      }
      await page.waitForFunction(()=>[...document.images].every(i=>i.complete),{},{timeout:45000});
      await page.waitForTimeout(400);
      await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(300);
      const state = await page.evaluate(() => {
       const url = s => {try {const u=new URL(s,location.href); return u.origin===location.origin ? u.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '')+u.hash : u.href;}catch{return s;}};
       return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
        headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>e.textContent.trim()),
        links:[...document.querySelectorAll('a')].map(e=>({text:e.textContent.trim(),href:url(e.href)})),
        images:[...document.images].map(e=>({src:url(e.src),ok:e.complete&&e.naturalWidth>0,alt:e.alt})),
        hiddenReveals:[...document.querySelectorAll('.reveal')].filter(e=>getComputedStyle(e).opacity==='0').length,
        pinned:[...document.querySelectorAll('[class*="pinned"], [class*="storybook-stage"]')].map(e=>e.className),
        iframeCount:document.querySelectorAll('iframe').length};
      });
      const shot = `${viewport.width}-${entry.route==='/'?'home':entry.route.slice(1).replaceAll('/','_')}-${site}.png`;
      await page.screenshot({path:path.join(out,shot),fullPage:true,timeout:15000});
      pair.sites[site] = {...top,...state,errors,failed,httpErrors,screenshot:shot};
     } catch(e) {pair.sites[site]={fatal:e.message,errors,failed,httpErrors};}
     await context.close();
    }
    const a=pair.sites.production,b=pair.sites.local;
    pair.comparison={text:a.text===b.text,headings:JSON.stringify(a.headings)===JSON.stringify(b.headings),links:JSON.stringify(a.links)===JSON.stringify(b.links),images:JSON.stringify(a.images)===JSON.stringify(b.images)};
    report.results.push(pair);
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
    console.log(viewport.width,entry.route,JSON.stringify(pair.comparison),'local errors',b.errors?.length,'missing',b.images?.filter(i=>!i.ok).length,'overflow',b.scrollWidth>b.width);
   }));
   }
  }
  const failures = report.results.filter(p => {
   const s = p.sites.local;
   return s.fatal || s.errors.length || s.httpErrors.length || s.images.some(i=>!i.ok) ||
    s.scrollWidth>s.width || s.hiddenReveals || !p.comparison.headings ||
    !p.comparison.links || !p.comparison.images || (p.route!=='/' && !p.comparison.text);
  });
  if (failures.length || report.results.length!==manifest.routes.length*2) {
   console.error('Regression failures:', failures.map(p=>[p.viewport.width,p.route]));
   process.exitCode=1;
  }
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
