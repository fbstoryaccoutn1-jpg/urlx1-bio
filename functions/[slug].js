const GH_API="https://api.github.com";

function esc(v=""){
  return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function iconFor(title="",url=""){
  const s=(title+" "+url).toLowerCase();
  const svg=(body)=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+body+'</svg>';
  if(s.includes("whatsapp")||s.includes("wa.me")) return svg('<path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.8c0 2.1.6 4.2 1.7 6L0 24l6.4-1.7a12 12 0 0 0 5.7 1.5h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.5Zm-8.3 18.3h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.5 4.7Zm5.4-7.4c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.6 0-.2-.7-1.8-1-2.4-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2 2.2.9 3.1 1 4.2.8.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z"/></svg>');
  if(s.includes("facebook")||s.includes("fb.com")||s.includes("facebook.com")) return svg('<path d="M13.6 24v-10h3.4l.5-3.9h-3.9V7.6c0-1.1.3-1.9 2-1.9h2.1V2.2c-.4-.1-1.6-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.3v2.8H6v3.9h3.4v10h4.2Z"/>');
  if(s.includes("instagram")) return svg('<path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm0 2A3.2 3.2 0 0 0 4 7.2v9.6A3.2 3.2 0 0 0 7.2 20h9.6a3.2 3.2 0 0 0 3.2-3.2V7.2A3.2 3.2 0 0 0 16.8 4H7.2Zm10.1 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>');
  if(s.includes("youtube")||s.includes("youtu.be")) return svg('<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/>');
  if(s.includes("telegram")||s.includes("t.me")) return svg('<path d="M23.5 2.2 19.9 21c-.3 1.3-1 1.6-2.1 1l-5.5-4-2.7 2.6c-.3.3-.5.5-1 .5l.4-5.6 10.2-9.2c.4-.4-.1-.6-.7-.2L5.9 14 0 12.1c-1.3-.4-1.3-1.3.3-1.9L22.8 1.5c1-.4 2 .2.7.7Z"/>');
  if(s.includes("tiktok")) return svg('<path d="M16.7 2c.5 2.6 2 4.2 4.6 4.7v3.2a9.1 9.1 0 0 1-4.6-1.3v6.6a7.1 7.1 0 1 1-6.1-7V11a4.2 4.2 0 1 0 3 4V2h3.1Z"/>');
  if(s.includes("mail")||s.includes("@")) return svg('<path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2 9 6 9-6H3Zm18 10V9.4l-9 6-9-6V17h18Z"/>');
  if(s.includes("video")||s.includes("watch")) return svg('<path d="M8 5v14l11-7L8 5Z"/>');
  return svg('<path d="M9.6 14.4a4 4 0 0 0 5.7 0l3.1-3.1a4 4 0 0 0-5.7-5.7l-1.8 1.8 1.4 1.4 1.8-1.8a2 2 0 1 1 2.9 2.9L13.9 13a2 2 0 0 1-2.9 0l-1.4 1.4Zm4.8-4.8a4 4 0 0 0-5.7 0l-3.1 3.1a4 4 0 1 0 5.7 5.7l1.8-1.8-1.4-1.4-1.8 1.8A2 2 0 0 1 7 14.1l3.1-3.1a2 2 0 0 1 2.9 0l1.4-1.4Z"/>');
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
  const buttons=(Array.isArray(c.buttons)?c.buttons:[]).map((b,i)=>`<a class="link-btn" href="${esc(b.url)}" target="_self"><span class="icon">${iconFor(b.title,b.url)}</span><span class="label">${esc(b.title||("Link "+(i+1)))}</span><span class="arrow">→</span></a>`).join("");
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
<style>*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#090b12;color:#fff}body{min-height:100vh;background:radial-gradient(circle at 20% 0%,#2c3158 0,transparent 36%),radial-gradient(circle at 90% 25%,#442957 0,transparent 33%),linear-gradient(145deg,#111523,#080a10 62%);${bg}background-size:cover;background-position:center;background-attachment:fixed}.page{width:min(100%,520px);margin:0 auto;padding:48px 20px 36px;min-height:100vh;display:flex;flex-direction:column;align-items:center}.avatar-wrap{width:112px;height:112px;border-radius:50%;padding:4px;background:linear-gradient(135deg,#fff,rgba(255,255,255,.25));box-shadow:0 18px 45px rgba(0,0,0,.35)}.avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;background:#1d2233}h1{font-size:30px;line-height:1.05;margin:19px 0 7px;letter-spacing:-.7px;text-align:center}.username{font-size:14px;color:rgba(255,255,255,.72);margin-bottom:14px}.bio{font-size:15px;line-height:1.6;color:rgba(255,255,255,.86);text-align:center;max-width:410px;margin:0 0 18px}.redirect{font-size:12px;color:rgba(255,255,255,.63);margin-bottom:19px;padding:8px 12px;border:1px solid rgba(255,255,255,.12);border-radius:99px;background:rgba(255,255,255,.06)}.links{width:100%;display:grid;gap:13px}.link-btn{min-height:66px;width:100%;padding:10px 13px;border-radius:20px;border:1px solid rgba(255,255,255,.17);background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.085));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:#fff;text-decoration:none;font-weight:800;display:grid;grid-template-columns:44px 1fr 34px;align-items:center;gap:12px;box-shadow:0 12px 32px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.07);transition:transform .18s ease,background .18s ease,border-color .18s ease}.link-btn:hover{transform:translateY(-2px);background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.11));border-color:rgba(255,255,255,.28)}.link-btn:active{transform:scale(.985)}.icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}.icon svg{width:22px;height:22px;fill:currentColor}.label{text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.1px}.arrow{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08);font-size:18px;opacity:.84;transition:transform .18s ease}.link-btn:hover .arrow{transform:translateX(2px)}footer{margin-top:auto;padding-top:32px;font-size:12px;color:rgba(255,255,255,.42)}</style></head>
<body><main class="page"><div class="avatar-wrap"><img class="avatar" src="${esc(c.profileImage||"")}" alt="${esc(c.name||"Profile")}"></div><h1>${esc(c.name||"")}</h1><div class="username">${esc(c.username||"")}</div><p class="bio">${esc(c.bio||"")}</p>${dest?`<div class="redirect">Redirecting in <strong id="count">${delay}</strong> seconds…</div>`:""}<section class="links">${buttons}</section><footer>urlx1.site/${esc(slug)}</footer></main>${redirectScript}</body></html>`;
  return new Response(html,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store,max-age=0"}});
}