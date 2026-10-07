const GH_API="https://api.github.com";
const RESERVED_SLUGS=new Set(["admin","api","404","favicon.ico","robots.txt","sitemap.xml","assets","functions"]);

function utf8ToBase64(text){
  const bytes=new TextEncoder().encode(text);
  let binary="";
  for(const b of bytes)binary+=String.fromCharCode(b);
  return btoa(binary);
}
function b64ToUtf8(b64){
  const raw=atob(String(b64||"").replace(/\n/g,""));
  const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function cleanUrl(value){
  let s=String(value||"").trim();
  if(!s)return"";
  if(s.startsWith("//"))s="https:"+s;
  if(!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s))s="https://"+s;
  const u=new URL(s);
  if(!["http:","https:"].includes(u.protocol))throw new Error("Only http/https URLs are allowed.");
  return u.toString();
}
function cleanSlug(value){
  return String(value||"").toLowerCase().trim().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}
function legacyPageId(slug){return "legacy:"+slug}

function sanitizePage(input,slug){
  const buttons=Array.isArray(input.buttons)?input.buttons:[];
  const videos=Array.isArray(input.videos)?input.videos:[];
  return{
    pageId:String(input.pageId||legacyPageId(slug)).trim().slice(0,120),
    name:String(input.name||"").trim().slice(0,80),
    username:String(input.username||"").trim().slice(0,80),
    bio:String(input.bio||"").trim().slice(0,500),
    profileImage:cleanUrl(input.profileImage),
    backgroundImage:cleanUrl(input.backgroundImage),
    ogTitle:String(input.ogTitle||"").trim().slice(0,120),
    ogDescription:String(input.ogDescription||"").trim().slice(0,300),
    ogImage:cleanUrl(input.ogImage),
    destinationUrl:cleanUrl(input.destinationUrl),
    redirectMode:String(input.redirectMode)==="302"?"302":"timed",
    redirectDelay:(()=>{const n=Number(input.redirectDelay);return Number.isFinite(n)&&n>=0?n:3})(),
    buttons:buttons.slice(0,30).map(b=>({
      title:String(b.title||"").trim().slice(0,80),
      url:cleanUrl(b.url)
    })).filter(b=>b.title&&b.url),
    videos:videos.slice(0,12).map(v=>({
      image:cleanUrl(v.image)
    })).filter(v=>v.image)
  }
}

async function ghFetch(url,options,retries=2){
  let last=null;
  let lastText="";
  for(let attempt=0;attempt<=retries;attempt++){
    try{
      const r=await fetch(url,options);
      if(r.ok||r.status<500)return r;
      last=r;
      lastText=await r.text();
    }catch(e){
      if(attempt===retries)throw e;
    }
    if(attempt<retries)await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));
  }
  return new Response(lastText,{status:last?.status||502,headers:{"content-type":last?.headers?.get("content-type")||"text/plain"}});
}

export async function onRequestPost({request,env}){
  try{
    if(!env.ADMIN_PASSWORD||!env.GITHUB_TOKEN||!env.GITHUB_OWNER||!env.GITHUB_REPO){
      return Response.json({error:"Server environment is incomplete."},{status:500});
    }

    let body;
    try{body=await request.json()}
    catch{return Response.json({error:"Invalid JSON."},{status:400})}

    if(body.password!==env.ADMIN_PASSWORD){
      return Response.json({error:"Wrong password."},{status:401});
    }

    const branch=env.GITHUB_BRANCH||"main";
    const headers={
      "Accept":"application/vnd.github+json",
      "Authorization":"Bearer "+env.GITHUB_TOKEN,
      "Content-Type":"application/json",
      "User-Agent":"urlx1-bio",
      "X-GitHub-Api-Version":"2022-11-28",
      "Cache-Control":"no-cache"
    };
    const endpoint=`${GH_API}/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPO)}/contents/pages.json`;

    const current=await ghFetch(endpoint+"?ref="+encodeURIComponent(branch)+"&t="+Date.now(),{headers},1);
    if(!current.ok){
      const detail=await current.text();
      return Response.json({error:"Could not load saved data ("+current.status+").",detail:detail.slice(0,1000)},{status:502});
    }

    const meta=await current.json();
    const currentDb=JSON.parse(b64ToUtf8(meta.content));
    const currentPages=currentDb.pages&&typeof currentDb.pages==="object"?currentDb.pages:{};

    const inputPages=body.pages&&typeof body.pages==="object"?body.pages:{};
    const pages={};
    const seen=new Set();
    const seenIds=new Set();

    try{
      for(const [rawSlug,inputPage] of Object.entries(inputPages)){
        const slug=cleanSlug(rawSlug);
        if(!slug)throw new Error("Slug is required.");
        if(RESERVED_SLUGS.has(slug))throw new Error('The slug "'+slug+'" is reserved and cannot be used.');
        if(seen.has(slug))throw new Error('Duplicate slug "'+slug+'" is not allowed.');
        seen.add(slug);

        const page=sanitizePage(inputPage||{},slug);
        if(seenIds.has(page.pageId))throw new Error("Duplicate page identity detected. Reload the admin panel and try again.");
        seenIds.add(page.pageId);
        if(page.redirectMode==="302"&&!page.destinationUrl)throw new Error("Instant 302 Redirect requires a destination URL.");
        const currentAtSlug=currentPages[slug];

        if(currentAtSlug){
          const currentId=String(currentAtSlug.pageId||legacyPageId(slug));
          if(page.pageId!==currentId){
            throw new Error('Slug "'+slug+'" already exists. Delete the old page and save first before reusing this slug.');
          }
        }

        pages[slug]=page;
      }
    }catch(e){
      return Response.json({error:e.message},{status:409});
    }

    const update=await ghFetch(endpoint,{
      method:"PUT",
      headers,
      body:JSON.stringify({
        message:"Update bio pages from admin panel",
        content:utf8ToBase64(JSON.stringify({pages},null,2)+"\n"),
        sha:meta.sha,
        branch
      })
    },2);

    if(!update.ok){
      const detail=await update.text();
      return Response.json({error:"Save failed ("+update.status+")",detail:detail.slice(0,1500)},{status:502});
    }

    const updateJson=await update.json().catch(()=>({}));
    const verify=await ghFetch(endpoint+"?ref="+encodeURIComponent(branch)+"&verify="+Date.now(),{headers},1);

    if(!verify.ok){
      return Response.json({error:"Save verification failed ("+verify.status+")."},{status:502});
    }

    const verifyMeta=await verify.json();
    const savedDb=JSON.parse(b64ToUtf8(verifyMeta.content));

    if(JSON.stringify(savedDb.pages||{})!==JSON.stringify(pages)){
      return Response.json({
        error:"Save verification failed",
        detail:"The saved pages.json does not exactly match the submitted data.",
        commit:updateJson.commit?.sha||null
      },{status:502});
    }

    return Response.json({
      ok:true,
      verified:true,
      message:"Saved successfully.",
      count:Object.keys(pages).length,
      slugs:Object.keys(pages).sort(),
      commit:updateJson.commit?.sha||null
    },{headers:{"cache-control":"no-store"}});
  }catch(e){
    return Response.json({
      error:"Save endpoint crashed",
      detail:String(e&&e.message||e)
    },{status:500,headers:{"cache-control":"no-store"}});
  }
}
