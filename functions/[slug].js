const GH_API="https://api.github.com";

function esc(v=""){
  return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
async function loadPages(env){
  const branch=env.GITHUB_BRANCH||"main";
  const headers={"Accept":"application/vnd.github+json","User-Agent":"urlx1-bio"};
  if(env.GITHUB_TOKEN) headers["Authorization"]="Bearer "+env.GITHUB_TOKEN;
  const r=await fetch(`${GH_API}/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPO)}/contents/pages.json?ref=${encodeURIComponent(branch)}`,{headers});
  if(!r.ok) throw new Error("Could not load pages.json ("+r.status+")");
  const d=await r.json();
  const raw=atob(d.content.replace(/\n/g,""));
  const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function onRequestGet({params,env}){
  const slug=String(params.slug||"").toLowerCase();
  let db; try{db=await loadPages(env)}catch(e){return new Response("Site configuration error.\n"+e.message,{status:500,headers:{"content-type":"text/plain;charset=UTF-8"}})}
  const c=db.pages?.[slug];
  if(!c) return new Response("<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>Not found</title><style>body{background:#090b12;color:#fff;font-family:system-ui;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center}</style><div><h1>Page not found</h1><p>This bio link does not exist.</p></div>",{status:404,headers:{"content-type":"text/html;charset=UTF-8"}});
  const delay=Math.max(1,Math.min(30,Number(c.redirectDelay)||3));
  const dest=String(c.destinationUrl||"");
  const buttons=(Array.isArray(c.buttons)?c.buttons:[]).map((b,i)=>`<a class="link-btn" href="${esc(b.url)}" target="_self"><span>${esc(b.title||("Link "+(i+1)))}</span><span class="arrow">↗</span></a>`).join("");
  const title=esc(c.ogTitle||c.name||"Bio");
  const desc=esc(c.ogDescription||c.bio||"");
  const og=esc(c.ogImage||c.profileImage||"");
  const bg=c.backgroundImage?`background-image:linear-gradient(180deg,rgba(7,10,18,.42),rgba(7,10,18,.9)),url('${esc(c.backgroundImage)}');`:"";
  const redirectScript=dest?`<script>let n=${delay};const el=document.getElementById("count");const t=setInterval(()=>{n--;if(el)el.textContent=n;if(n<=0){clearInterval(t);location.href=${JSON.stringify(dest)}}},1000);</script>`:"";
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title><meta name="description" content="${desc}">
<meta property="og:type" content="website"><meta property="og:url" content="https://urlx1.site/${esc(slug)}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${og}">
<style>*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#090b12;color:#fff}body{min-height:100vh;background:radial-gradient(circle at 20% 0%,#2c3158 0,transparent 36%),radial-gradient(circle at 90% 25%,#442957 0,transparent 33%),linear-gradient(145deg,#111523,#080a10 62%);${bg}background-size:cover;background-position:center;background-attachment:fixed}.page{width:min(100%,520px);margin:0 auto;padding:48px 20px 36px;min-height:100vh;display:flex;flex-direction:column;align-items:center}.avatar-wrap{width:112px;height:112px;border-radius:50%;padding:4px;background:linear-gradient(135deg,#fff,rgba(255,255,255,.25));box-shadow:0 18px 45px rgba(0,0,0,.35)}.avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;background:#1d2233}h1{font-size:30px;line-height:1.05;margin:19px 0 7px;letter-spacing:-.7px;text-align:center}.username{font-size:14px;color:rgba(255,255,255,.72);margin-bottom:14px}.bio{font-size:15px;line-height:1.6;color:rgba(255,255,255,.86);text-align:center;max-width:410px;margin:0 0 18px}.redirect{font-size:12px;color:rgba(255,255,255,.63);margin-bottom:19px;padding:8px 12px;border:1px solid rgba(255,255,255,.12);border-radius:99px;background:rgba(255,255,255,.06)}.links{width:100%;display:grid;gap:12px}.link-btn{min-height:60px;width:100%;padding:14px 18px;border-radius:18px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.11);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);color:#fff;text-decoration:none;font-weight:700;display:flex;align-items:center;justify-content:space-between;box-shadow:0 12px 30px rgba(0,0,0,.17)}.arrow{font-size:20px;opacity:.72}footer{margin-top:auto;padding-top:32px;font-size:12px;color:rgba(255,255,255,.42)}</style></head>
<body><main class="page"><div class="avatar-wrap"><img class="avatar" src="${esc(c.profileImage||"")}" alt="${esc(c.name||"Profile")}"></div><h1>${esc(c.name||"")}</h1><div class="username">${esc(c.username||"")}</div><p class="bio">${esc(c.bio||"")}</p>${dest?`<div class="redirect">Redirecting in <strong id="count">${delay}</strong> seconds…</div>`:""}<section class="links">${buttons}</section><footer>urlx1.site/${esc(slug)}</footer></main>${redirectScript}</body></html>`;
  return new Response(html,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store,max-age=0"}});
}