const GH_API="https://api.github.com";
function utf8ToBase64(text){const bytes=new TextEncoder().encode(text);let binary="";for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary)}
function cleanUrl(value){const s=String(value||"").trim();if(!s)return"";const u=new URL(s);if(!["http:","https:"].includes(u.protocol))throw new Error("Only http/https URLs are allowed.");return u.toString()}
function sanitizeConfig(input){
  const buttons=Array.isArray(input.buttons)?input.buttons:[];
  return{
    name:String(input.name||"").trim().slice(0,80),
    username:String(input.username||"").trim().slice(0,80),
    bio:String(input.bio||"").trim().slice(0,500),
    profileImage:cleanUrl(input.profileImage),
    backgroundImage:cleanUrl(input.backgroundImage),
    ogTitle:String(input.ogTitle||"").trim().slice(0,120),
    ogDescription:String(input.ogDescription||"").trim().slice(0,300),
    ogImage:cleanUrl(input.ogImage),
    buttons:buttons.slice(0,30).map(b=>({title:String(b.title||"").trim().slice(0,80),url:cleanUrl(b.url)})).filter(b=>b.title&&b.url)
  }
}
export async function onRequestPost({request,env}){
  if(!env.ADMIN_PASSWORD||!env.GITHUB_TOKEN||!env.GITHUB_OWNER||!env.GITHUB_REPO)return Response.json({error:"Server environment is incomplete."},{status:500});
  let body;try{body=await request.json()}catch{return Response.json({error:"Invalid JSON."},{status:400})}
  if(body.password!==env.ADMIN_PASSWORD)return Response.json({error:"Wrong password."},{status:401});
  let config;try{config=sanitizeConfig(body.config||{})}catch(e){return Response.json({error:e.message},{status:400})}
  const branch=env.GITHUB_BRANCH||"main";
  const headers={"Accept":"application/vnd.github+json","Authorization":"Bearer "+env.GITHUB_TOKEN,"Content-Type":"application/json","User-Agent":"urlx1-bio"};
  const endpoint=`${GH_API}/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPO)}/contents/config.json`;
  const current=await fetch(endpoint+"?ref="+encodeURIComponent(branch),{headers});
  if(!current.ok)return Response.json({error:"Could not read config.json ("+current.status+")."},{status:502});
  const meta=await current.json();
  const update=await fetch(endpoint,{method:"PUT",headers,body:JSON.stringify({message:"Update bio page from admin panel",content:utf8ToBase64(JSON.stringify(config,null,2)+"\n"),sha:meta.sha,branch})});
  if(!update.ok){const detail=await update.text();return Response.json({error:"GitHub save failed ("+update.status+")",detail},{status:502})}
  return Response.json({ok:true,message:"Saved successfully."},{headers:{"cache-control":"no-store"}});
}