const GH_API="https://api.github.com";
function utf8ToBase64(text){const bytes=new TextEncoder().encode(text);let binary="";for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary)}
function cleanUrl(value){let s=String(value||"").trim();if(!s)return"";if(s.startsWith("//"))s="https:"+s;if(!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s))s="https://"+s;const u=new URL(s);if(!["http:","https:"].includes(u.protocol))throw new Error("Only http/https URLs are allowed.");return u.toString()}
function cleanSlug(value){return String(value||"").toLowerCase().trim().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}
function sanitizePage(input){
  const buttons=Array.isArray(input.buttons)?input.buttons:[];
  const videos=Array.isArray(input.videos)?input.videos:[];
  return{
    name:String(input.name||"").trim().slice(0,80),
    username:String(input.username||"").trim().slice(0,80),
    bio:String(input.bio||"").trim().slice(0,500),
    profileImage:cleanUrl(input.profileImage),
    backgroundImage:cleanUrl(input.backgroundImage),
    ogTitle:String(input.ogTitle||"").trim().slice(0,120),
    ogDescription:String(input.ogDescription||"").trim().slice(0,300),
    ogImage:cleanUrl(input.ogImage),
    destinationUrl:cleanUrl(input.destinationUrl),
    redirectDelay:Math.max(1,Math.min(30,Number(input.redirectDelay)||3)),
    buttons:buttons.slice(0,30).map(b=>({title:String(b.title||"").trim().slice(0,80),url:cleanUrl(b.url)})).filter(b=>b.title&&b.url),
    videos:videos.slice(0,12).map(v=>({image:cleanUrl(v.image)})).filter(v=>v.image)
  }
}
export async function onRequestPost({request,env}){try{
  if(!env.ADMIN_PASSWORD||!env.GITHUB_TOKEN||!env.GITHUB_OWNER||!env.GITHUB_REPO)return Response.json({error:"Server environment is incomplete."},{status:500});
  let body;try{body=await request.json()}catch{return Response.json({error:"Invalid JSON."},{status:400})}
  if(body.password!==env.ADMIN_PASSWORD)return Response.json({error:"Wrong password."},{status:401});
  const inputPages=body.pages&&typeof body.pages==="object"?body.pages:{};
  const pages={};
  try{
    for(const [rawSlug,page] of Object.entries(inputPages)){
      const slug=cleanSlug(rawSlug);
      if(!slug)continue;
      pages[slug]=sanitizePage(page||{});
    }
  }catch(e){return Response.json({error:e.message},{status:400})}
  const branch=env.GITHUB_BRANCH||"main";
  const headers={"Accept":"application/vnd.github+json","Authorization":"Bearer "+env.GITHUB_TOKEN,"Content-Type":"application/json","User-Agent":"urlx1-bio"};
  const endpoint=`${GH_API}/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPO)}/contents/pages.json`;
  const current=await fetch(endpoint+"?ref="+encodeURIComponent(branch),{headers});
  if(!current.ok)return Response.json({error:"Could not read pages.json ("+current.status+")."},{status:502});
  const meta=await current.json();
  const update=await fetch(endpoint,{method:"PUT",headers,body:JSON.stringify({message:"Update bio pages from admin panel",content:utf8ToBase64(JSON.stringify({pages},null,2)+"\n"),sha:meta.sha,branch})});
  if(!update.ok){const detail=await update.text();return Response.json({error:"GitHub save failed ("+update.status+")",detail},{status:502})}
  const updateJson=await update.json().catch(()=>({}));
  const verifyUrl=endpoint+"?ref="+encodeURIComponent(branch)+"&verify="+Date.now();
  const verifyResp=await fetch(verifyUrl,{headers:{...headers,"Cache-Control":"no-cache"}});
  if(!verifyResp.ok)return Response.json({error:"GitHub verification read failed ("+verifyResp.status+")."},{status:502});
  const verifyMeta=await verifyResp.json();
  const raw=atob(String(verifyMeta.content||"").replace(/\n/g,""));
  const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
  const savedDb=JSON.parse(new TextDecoder().decode(bytes));
  const expectedSlugs=Object.keys(pages).sort();
  const savedSlugs=Object.keys(savedDb.pages||{}).sort();
  if(JSON.stringify(expectedSlugs)!==JSON.stringify(savedSlugs)){
    return Response.json({
      error:"GitHub verification failed",
      detail:"Expected: "+expectedSlugs.join(", ")+" | Saved: "+savedSlugs.join(", "),
      commit:updateJson.commit?.sha||null
    },{status:502,headers:{"cache-control":"no-store"}});
  }
  return Response.json({
    ok:true,
    verified:true,
    message:"Saved and verified.",
    count:expectedSlugs.length,
    slugs:savedSlugs,
    commit:updateJson.commit?.sha||null
  },{headers:{"cache-control":"no-store"}});
}catch(e){return Response.json({error:"Save endpoint crashed",detail:String(e&&e.message||e)},{status:500,headers:{"cache-control":"no-store"}})}}