const GH_API="https://api.github.com";
function b64ToUtf8(b64){const raw=atob(b64.replace(/\n/g,""));const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
export async function onRequestGet({env}){
  if(!env.GITHUB_OWNER||!env.GITHUB_REPO)return Response.json({error:"GitHub repo environment variables are missing."},{status:500});
  const branch=env.GITHUB_BRANCH||"main";
  const headers={"Accept":"application/vnd.github+json","User-Agent":"urlx1-bio"};
  if(env.GITHUB_TOKEN)headers["Authorization"]="Bearer "+env.GITHUB_TOKEN;
  const r=await fetch(`${GH_API}/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPO)}/contents/pages.json?ref=${encodeURIComponent(branch)}`,{headers});
  if(!r.ok)return Response.json({error:"GitHub returned "+r.status},{status:502});
  const d=await r.json();
  return Response.json(JSON.parse(b64ToUtf8(d.content)),{headers:{"cache-control":"no-store"}});
}