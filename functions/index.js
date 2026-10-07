export async function onRequestGet(){
  const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>urlx1.site — Bio Link Pages</title>
<meta name="description" content="Simple branded bio link pages powered by urlx1.site">
<style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;background:#090b12;color:#fff}
body{background:radial-gradient(circle at 20% 0%,#293055 0,transparent 34%),radial-gradient(circle at 90% 25%,#3d274d 0,transparent 32%),linear-gradient(145deg,#111523,#080a10 62%)}
.wrap{width:min(1100px,100%);margin:auto;padding:28px 20px 70px}
nav{display:flex;justify-content:space-between;align-items:center;gap:18px}.brand{font-size:22px;font-weight:900;letter-spacing:-.4px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:14px;border:1px solid rgba(255,255,255,.15);text-decoration:none;font-weight:800}
.primary{background:#fff;color:#0b0e15}.ghost{background:rgba(255,255,255,.08);color:#fff}
.hero{padding:100px 0 70px;text-align:center;display:flex;flex-direction:column;align-items:center}.eyebrow{padding:7px 11px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);font-size:13px;color:#cbd2df}
h1{font-size:clamp(44px,8vw,82px);line-height:.98;letter-spacing:-3px;max-width:900px;margin:22px 0 18px}.lead{max-width:700px;color:rgba(255,255,255,.72);font-size:18px;line-height:1.65;margin:0 0 28px}
.actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px}
.card{padding:24px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);border-radius:20px;backdrop-filter:blur(16px)}.card h3{margin:0 0 8px}.card p{margin:0;color:rgba(255,255,255,.65);line-height:1.55}
footer{margin-top:70px;padding-top:24px;border-top:1px solid rgba(255,255,255,.09);color:rgba(255,255,255,.42);font-size:13px;display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap}
@media(max-width:760px){.hero{padding-top:70px}h1{letter-spacing:-1.8px}.grid{grid-template-columns:1fr}}
</style></head>
<body><div class="wrap">
<nav><div class="brand">urlx1.site</div><a class="btn ghost" href="/admin/">Admin Login</a></nav>
<section class="hero">
  <div class="eyebrow">Simple Bio Link Pages</div>
  <h1>One clean page.<br>All your important links.</h1>
  <p class="lead">Create branded bio pages with profile details, social previews, custom buttons and automatic destination redirects.</p>
  <div class="actions">
    <a class="btn primary" href="/admin/">Create Bio Page</a>
    <a class="btn ghost" href="/demo">View Demo</a>
  </div>
</section>
<section class="grid">
  <div class="card"><h3>Custom Bio URLs</h3><p>Create links like urlx1.site/amina-whatsapp or urlx1.site/kumaribio.</p></div>
  <div class="card"><h3>Social Preview Ready</h3><p>Set separate OG title, description and preview image for each bio page.</p></div>
  <div class="card"><h3>Automatic Redirect</h3><p>Send visitors to your chosen destination after the delay you set.</p></div>
</section>
<footer><span>© urlx1.site</span><span>Bio page management platform</span></footer>
</div></body></html>`;
  return new Response(html,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store"}});
}