const PASSWORD = "";
const SECRET = "";
const RESERVED = new Set([
  "about", "contact", "privacy", "terms", "disclosure", "articles",
  "king-max-panel", "king-max-panel2", "api", "favicon.ico", "robots.txt",
]);

const ARTICLES = [
  {
    slug: "benefits-of-online-shopping",
    title: "Benefits of online shopping that actually matter",
    dek: "Time, comparison, and a written record — not just a bigger catalog.",
    minutes: 4,
    body: [
      "Online shopping is useful when the store is closed, the item is heavy, or you want to compare three versions before you spend. You can read measurements, check return windows, and keep the listing open while you decide. That is the real benefit: a pause between seeing something and paying for it.",
      "A second benefit is the record. Order history, delivery dates, and receipts sit in one account. If a gift needs to be reordered or a part replaced, you are not guessing the model number from a faded box.",
      "The tradeoff is impulse. A cart that is one tap away is easier to fill than a physical basket. A short list — what you need, the size, the budget — keeps the convenience without turning every evening into a checkout.",
    ],
  },
  {
    slug: "why-amazon-is-number-one",
    title: "Why Amazon became the default online store",
    dek: "Speed, selection, and a returns process people already know.",
    minutes: 4,
    body: [
      "Amazon did not win because every product is the best product. It won because the path from search to doorstep is short. Prime shipping, saved addresses, and a familiar checkout remove the small frictions that make people abandon other sites.",
      "Selection is the other half. A niche replacement part and a everyday household item can sit in the same order. Reviews are uneven, but they are dense enough that you can spot a pattern: repeated complaints about size, smell, or a missing piece.",
      "None of that means you should buy the first result. Sort by the spec you care about, read the recent reviews, and check who the seller is. The platform is convenient. The listing still needs a minute of your own judgment.",
    ],
  },
  {
    slug: "how-to-shop-smart-on-amazon",
    title: "How to shop smartly on Amazon",
    dek: "A short routine before you add anything to the cart.",
    minutes: 5,
    body: [
      "Start with the spec, not the headline. For a tool, that is voltage, capacity, or fit. For clothing, it is the size chart and the fabric, not the model photo. If the listing hides those details, skip it.",
      "Read the one-star and three-star reviews, not only the five-star pile. Look for the same complaint twice. A single angry review is noise. The same sizing note from several buyers is a signal.",
      "Check the seller and the return window before you pay. A marketplace listing can ship from a third party even when the page looks official. If the return window is short and the item is easy to get wrong, that is part of the price.",
    ],
  },
  {
    slug: "choosing-a-good-product",
    title: "How to choose a good product without a showroom",
    dek: "Use the listing as a worksheet, not a commercial.",
    minutes: 4,
    body: [
      "A good product for you is one that matches a job you already have. Write the job in one line: carry a laptop, replace a worn pan, light a desk. Then keep only the listings that name that job in the details, not just the title.",
      "Photos should show the thing, not only a lifestyle scene. Look for scale, the back of the product, and any included parts. If every photo is a render, treat the dimensions as unverified until a review confirms them.",
      "Price is the last filter, not the first. A cheaper option that fails the job costs more once you replace it. Pay for the spec you will notice every week, and ignore the extras you will not.",
    ],
  },
  {
    slug: "shopping-from-home",
    title: "Shopping from home without the noise",
    dek: "Keep the convenience. Drop the endless scroll.",
    minutes: 3,
    body: [
      "The useful version of shopping from home is narrow. You already know the category. You open a few listings, compare one or two facts, and either buy or close the tab. That is different from browsing until something feels urgent.",
      "A product page on this site is a pause, not the store. You see a photo, a short note, and one button through to Amazon. The purchase, the price, and the shipping are still Amazon’s.",
      "If you are not sure, leave it. A listing will still be there tomorrow. Most things that feel essential at night look ordinary in the morning.",
    ],
  },
];

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

function slugify(title, taken) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "pick";
  let slug = RESERVED.has(base) ? `${base}-pick` : base;
  let n = 2;
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

async function hmac(text, env) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.DESK_SECRET || "demanding-live-desk-v1"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function isDesk(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)demanding_desk=([^;]+)/);
  if (!match) return false;
  const [exp, sig] = decodeURIComponent(match[1]).split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return (await hmac(exp, env)) === sig;
}

function cookieHeader(token, maxAge) {
  return `demanding_desk=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

async function jsonGet(env, key, fallback) {
  const raw = await env.SHOP.get(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

async function loadProducts(env) {
  const ids = await jsonGet(env, "index", []);
  if (!ids.length) return [];
  const rows = await Promise.all(ids.map((id) => jsonGet(env, `product:${id}`, null)));
  return rows.filter(Boolean);
}

function startOfDay() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function startOfWeek() {
  const now = new Date();
  const day = now.getUTCDay();
  const mondayOffset = (day + 6) % 7;
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - mondayOffset);
}

function countryOf(request) {
  return request.cf?.country || "";
}

const CSS = `
:root{--navy:#131921;--navy-2:#232f3e;--orange:#ff9900;--paper:#fff;--mist:#f3f3f3;--ink:#0f1111;--muted:#565959;--link:#007185;--line:#d5d9d9;--header-fg:#fff;--on-accent:#0f1111;--field:#fff;--danger:#b12704}
html.dark{--paper:#161d27;--mist:#0e141c;--ink:#f3f4f6;--muted:#b7bdc7;--link:#7dd3fc;--line:#2a3544;--field:#1b2430;--header-fg:#fff}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:"Source Sans 3",Arial,sans-serif}
a{color:inherit;text-decoration:none}button,[role=button]{cursor:pointer}
.header{background:var(--navy);color:var(--header-fg)}
.wrap{max-width:72rem;margin:0 auto;padding:0 1rem}
.row{display:flex;align-items:center;gap:.75rem}
.brand{font-weight:800;font-size:1.35rem;letter-spacing:-.02em}.brand span{color:var(--orange)}
.search{display:flex;flex:1;max-width:36rem}
.search input{flex:1;height:2.6rem;border:0;border-radius:.4rem 0 0 .4rem;padding:0 .8rem;background:var(--field);color:var(--ink)}
.search button{height:2.6rem;border:0;border-radius:0 .4rem .4rem 0;background:var(--orange);color:var(--on-accent);font-weight:800;padding:0 1rem}
.nav a{font-size:.92rem;font-weight:650;opacity:.92}
.iconbtn{width:2.6rem;height:2.6rem;border:0;border-radius:.4rem;background:transparent;color:var(--header-fg)}
.hero{background:var(--mist);border-bottom:1px solid var(--line);padding:2.4rem 0}
h1{font-size:clamp(1.8rem,4vw,3rem);line-height:1.1;margin:.4rem 0;letter-spacing:-.03em}
.muted{color:var(--muted)}.link{color:var(--link)}
.btn{display:inline-flex;align-items:center;justify-content:center;height:3rem;border-radius:.4rem;background:var(--orange);color:var(--on-accent);font-weight:800;padding:0 1.1rem;border:0}
.grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))}
.card{border:1px solid var(--line);background:var(--paper);border-radius:.5rem;padding:1rem}
.card:hover{border-color:var(--orange)}
.product{display:grid;gap:1.5rem;padding:2rem 0}
@media(min-width:900px){.product{grid-template-columns:1fr 1fr}}
.photo{min-height:18rem;border:1px solid var(--line);background:var(--mist);border-radius:.5rem;display:flex;align-items:center;justify-content:center;padding:1rem}
.photo img{max-width:100%;max-height:28rem;object-fit:contain}
.footer{border-top:1px solid var(--line);margin-top:3rem;padding:1.4rem 0;color:var(--muted);font-size:.9rem}
.footer a{color:var(--link);margin-right:.8rem}
input,textarea{width:100%;border:1px solid var(--line);background:var(--field);color:var(--ink);border-radius:.4rem;padding:.7rem .8rem;font:inherit}
.notice{border:1px solid var(--line);background:var(--paper);border-radius:.4rem;padding:.8rem 1rem;font-weight:700}
table{width:100%;border-collapse:collapse;font-size:.92rem}th,td{text-align:left;padding:.7rem;border-bottom:1px solid var(--line)}
.danger{color:var(--danger);background:none;border:0;font-weight:700}
`;

const CLIENT = `
<script>
try{if(localStorage.getItem('demanding-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}
function toggleTheme(){const n=!document.documentElement.classList.contains('dark');document.documentElement.classList.toggle('dark',n);localStorage.setItem('demanding-theme',n?'dark':'light')}
async function track(id,kind){try{await fetch('/api/track',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({productId:id,kind})})}catch(e){}}
function compress(file){return new Promise((resolve)=>{const img=new Image();const url=URL.createObjectURL(file);img.onload=()=>{const scale=Math.min(1,900/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,img.width*scale);c.height=Math.max(1,img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);resolve(c.toDataURL('image/jpeg',.72))};img.onerror=()=>resolve('');img.src=url})}
</script>`;

function shell({ title, body, desk = false, noindex = false }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="icon" href="/favicon.svg"><meta name="description" content="Demanding is a practical shopping guide. Read a short note, then finish the purchase on Amazon.">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:title" content="Demanding"><meta property="og:description" content="A practical shopping guide."><meta property="og:type" content="website">
<style>${CSS}</style></head><body>
${desk ? "" : `<header class="header"><div class="wrap row" style="min-height:4.2rem">
<a class="brand" href="/">demand<span>ing</span></a>
<form class="search" action="/" method="get"><input name="q" placeholder="Search products" aria-label="Search products"><button>Search</button></form>
<nav class="row"><a href="/">Home</a><a href="/articles">Articles</a><a href="/about">About</a><a href="/contact">Contact</a>
<button class="iconbtn" type="button" onclick="toggleTheme()" aria-label="Toggle day and night">◐</button></nav></div></header>`}
${body}
${desk ? "" : `<footer class="footer"><div class="wrap">As an Amazon Associate I earn from qualifying purchases.
<div style="margin-top:.5rem"><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/disclosure">Affiliate disclosure</a></div></div></footer>`}
${CLIENT}</body></html>`;
}

function page(title, inner, extra = {}) {
  const body = extra.raw ? inner : `<main class="wrap" style="padding:2rem 0">${inner}</main>`;
  return new Response(shell({ title, body, ...extra }), {
    status: extra.status || 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function home(products, q) {
  const needle = q.toLowerCase();
  const shown = products.filter((p) => !needle || p.title.toLowerCase().includes(needle) || (p.description || "").toLowerCase().includes(needle));
  const cards = shown.map((p) => `<a class="card" href="/${esc(p.slug)}"><p class="muted" style="font-size:.85rem;font-weight:700">Product pick</p><h3 style="margin:.4rem 0">${esc(p.title)}</h3><p class="muted">${esc((p.description || "Open the pick for the note and the Amazon button.").slice(0, 140))}</p></a>`).join("") || `<p class="muted">No product pages yet.</p>`;
  const guides = ARTICLES.slice(0, 3).map((a) => `<a class="card" href="/articles/${esc(a.slug)}"><p class="muted" style="font-size:.85rem;font-weight:700">${a.minutes} min read</p><h3 style="margin:.4rem 0">${esc(a.title)}</h3><p class="muted">${esc(a.dek)}</p></a>`).join("");
  return page("Demanding — practical shopping picks", `
<section class="hero"><div class="wrap"><p class="link" style="font-weight:700">demanding.shop · a practical shopping guide</p>
<h1>Online shopping, with the noise turned down.</h1>
<p class="muted" style="max-width:40rem;font-size:1.05rem">Read a short guide, open a product pick, and finish the purchase on Amazon. The price is still Amazon’s.</p>
<p><a class="btn" href="#guides">Read the guides</a> <a class="link" href="#picks" style="margin-left:1rem;font-weight:700">Browse product picks</a></p></div></section>
<section id="guides" class="wrap" style="padding:2rem 0"><h2>Guides</h2><p class="muted">Short reads before you add anything to a cart.</p><div class="grid" style="margin-top:1rem">${guides}</div></section>
<section id="picks" class="wrap" style="padding-bottom:2rem"><h2>Product picks</h2>${q ? `<p class="muted">Results for “${esc(q)}”.</p>` : ""}<div class="grid" style="margin-top:1rem">${cards}</div></section>`, { raw: true });
}

function productPage(product) {
  const photo = product.imageDataUrl ? `<img src="${esc(product.imageDataUrl)}" alt="">` : `<p class="muted">No photo on this pick.</p>`;
  return page(`${product.title} · Demanding`, `
<article class="product wrap">
<div class="photo">${photo}</div>
<div>
<p class="link" style="font-weight:700">Product pick</p>
<h1>${esc(product.title)}</h1>
<p style="font-weight:700">As an Amazon Associate I earn from qualifying purchases.</p>
${product.description ? `<p class="muted">${esc(product.description)}</p>` : ""}
<h2>Key benefits</h2><p class="muted">${esc(product.benefits || "A short note on this product is being prepared.")}</p>
<h2>Who should buy this</h2><p class="muted">${esc(product.buyerFit || "Use the listing details to decide if it matches the job you need done.")}</p>
<p><a class="btn" href="${esc(product.affiliateUrl)}" target="_blank" rel="noreferrer" onclick="track('${esc(product.id)}','buy')">Buy from Amazon</a></p>
<p class="muted" style="font-size:.8rem">Prices, shipping, and availability are set by Amazon. Buying through this link may earn a commission at no extra cost to you.</p>
</div></article>
<script>track('${esc(product.id)}','page')</script>`);
}

function articlesIndex() {
  const cards = ARTICLES.map((a) => `<a class="card" href="/articles/${esc(a.slug)}"><p class="muted">${a.minutes} min read</p><h2 style="margin:.3rem 0">${esc(a.title)}</h2><p class="muted">${esc(a.dek)}</p></a>`).join("");
  return page("Articles · Demanding", `<h1>Guides</h1><div class="grid">${cards}</div>`);
}

function articlePage(article) {
  return page(`${article.title} · Demanding`, `<p class="muted">${article.minutes} min read</p><h1>${esc(article.title)}</h1><p class="muted">${esc(article.dek)}</p>${article.body.map((p) => `<p>${esc(p)}</p>`).join("")}`);
}

function info(title, paragraphs) {
  return page(`${title} · Demanding`, `<h1>${esc(title)}</h1>${paragraphs.map((p) => `<p>${p}</p>`).join("")}`);
}

function deskGate() {
  return page("Desk · Demanding", `<form method="post" action="/api/unlock" class="card" style="max-width:28rem;margin:4rem auto"><h1>Enter the desk</h1><p class="muted">One password opens the page editor and the tracking desk. Neither page is linked from the public site.</p><input type="password" name="password" placeholder="Password" required><button class="btn" style="margin-top:.8rem;width:100%">Unlock</button></form>`, { noindex: true });
}

function editor(products, keys, notice) {
  const list = products.map((p) => `<li class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:.6rem 0"><a class="link" href="/${esc(p.slug)}">/${esc(p.slug)}</a><form method="post" action="/api/products/${esc(p.id)}/delete"><button class="danger">Delete</button></form></li>`).join("") || `<p class="muted">None yet.</p>`;
  return page("Page editor · Demanding", `<div class="header" style="margin:-2rem -1rem 1.5rem;padding:1rem"><div class="wrap row" style="justify-content:space-between"><b>Page editor</b><span><a class="link" href="/king-max-panel2" style="color:var(--orange)">Tracking</a> <button class="iconbtn" onclick="toggleTheme()">◐</button> <a href="/api/lock">Lock</a></span></div></div>
${notice ? `<p class="notice">${esc(notice)}</p>` : ""}
<form class="card" id="single"><h2>Single pick</h2><input name="title" placeholder="Product title" required><textarea name="description" rows="3" placeholder="Short description"></textarea><input name="link" placeholder="Amazon affiliate link" required><input type="file" accept="image/*" id="single-file"><button class="btn">Generate product page</button></form>
<form class="card" id="bulk"><h2>Bulk picks</h2><p class="muted">One line each. Use a link alone, or Title | link | description. Name image files with the product title.</p><textarea id="bulk-text" rows="8" placeholder="Desk lamp | https://amazon.com/..."></textarea><input type="file" accept="image/*" multiple id="bulk-files"><button class="btn">Generate all</button></form>
<form class="card" method="post" action="/api/keys"><h2>AI keys</h2><p class="muted">Three Gemini keys, then DeepSeek if those fail. Keys stay on the server. They are not printed on public pages.</p>
<input type="password" name="gemini1" placeholder="Gemini key 1" value="${esc(keys.gemini1 || "")}">
<input type="password" name="gemini2" placeholder="Gemini key 2" value="${esc(keys.gemini2 || "")}">
<input type="password" name="gemini3" placeholder="Gemini key 3" value="${esc(keys.gemini3 || "")}">
<input type="password" name="deepseek" placeholder="DeepSeek API key" value="${esc(keys.deepseek || "")}">
<button class="btn">Save keys</button></form>
<section class="card"><h2>Pages</h2><ul style="list-style:none;padding:0">${list}</ul></section>
<script>
document.getElementById('single').onsubmit=async(e)=>{e.preventDefault();const f=e.target;const file=document.getElementById('single-file').files[0];const image=file?await compress(file):'';const res=await fetch('/api/products',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({items:[{title:f.title.value,description:f.description.value,affiliateUrl:f.link.value,imageDataUrl:image}]})});location.href='/king-max-panel?notice='+encodeURIComponent((await res.json()).notice||'Saved')};
document.getElementById('bulk').onsubmit=async(e)=>{e.preventDefault();const lines=document.getElementById('bulk-text').value.split('\\n').map(s=>s.trim()).filter(Boolean);const files=[...document.getElementById('bulk-files').files];const images={};for(const file of files){images[file.name.replace(/\\.[a-z0-9]+$/i,'').toLowerCase()]=await compress(file)}const items=lines.map((row,i)=>{const parts=row.split('|').map(s=>s.trim());const title=parts.length>1?parts[0]:('Amazon pick '+(i+1));return{title,affiliateUrl:parts.length>1?parts[1]:parts[0],description:parts[2]||'',imageDataUrl:images[title.toLowerCase()]||''}});const res=await fetch('/api/products',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({items})});location.href='/king-max-panel?notice='+encodeURIComponent((await res.json()).notice||'Saved')};
</script>`, { noindex: true });
}

function tracking(products, events, messages) {
  const day = startOfDay();
  const week = startOfWeek();
  let today = 0, weekBuys = 0;
  const by = new Map();
  for (const event of events) {
    if (event.kind === "buy" && event.at >= day) today += 1;
    if (event.kind === "buy" && event.at >= week) weekBuys += 1;
    const row = by.get(event.productId) || { pages: 0, buys: 0, countries: new Set() };
    if (event.kind === "page") row.pages += 1;
    if (event.kind === "buy") row.buys += 1;
    if (event.country) row.countries.add(event.country);
    by.set(event.productId, row);
  }
  const rows = products.map((p) => {
    const row = by.get(p.id) || { pages: 0, buys: 0, countries: new Set() };
    return `<tr><td>${esc(p.title)}</td><td>/${esc(p.slug)}</td><td>${row.pages}</td><td>${row.buys}</td><td>${esc([...row.countries].join(", ") || "—")}</td></tr>`;
  }).join("") || `<tr><td colspan="5" class="muted">No pages yet.</td></tr>`;
  const msgs = messages.map((m) => `<li style="border-bottom:1px solid var(--line);padding:.6rem 0"><b>${esc(m.name)}</b> · ${esc(m.email)}<br>${esc(m.message)}</li>`).join("") || `<p class="muted">No messages.</p>`;
  return page("Tracking · Demanding", `<div class="header" style="margin:-2rem -1rem 1.5rem;padding:1rem"><div class="wrap row" style="justify-content:space-between"><b>Tracking desk</b><span><a href="/king-max-panel" style="color:var(--orange)">Editor</a> <button class="iconbtn" onclick="toggleTheme()">◐</button> <a href="/api/lock">Lock</a></span></div></div>
<div class="grid"><div class="card"><p class="muted">Today’s Buy button clicks</p><h2>${today}</h2></div><div class="card"><p class="muted">This week’s Buy button clicks</p><h2>${weekBuys}</h2></div></div>
<div class="card" style="overflow:auto;margin-top:1rem"><table><thead><tr><th>Product</th><th>Short URL</th><th>Page clicks</th><th>Buy clicks</th><th>Countries</th></tr></thead><tbody>${rows}</tbody></table></div>
<section class="card" style="margin-top:1rem"><h2>Contact messages</h2><ul style="list-style:none;padding:0">${msgs}</ul></section>`, { noindex: true });
}

async function writeCopy(title, description, keys) {
  const prompt = `Write two short original paragraphs for a shopping-guide product page about "${title}". Context: ${description || "No extra description."}. Return only JSON {"benefits":"...","buyerFit":"..."}. benefits = practical key benefits. buyerFit = who should buy this. No prices, no fake reviews, no medical claims. Plain sentences.`;
  const geminiKeys = [keys.gemini1, keys.gemini2, keys.gemini3].filter(Boolean);
  for (const key of geminiKeys) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.benefits) return parsed;
    } catch {}
  }
  if (keys.deepseek) {
    try {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${keys.deepseek}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.benefits) return parsed;
    } catch {}
  }
  return {
    benefits: `${title} is listed here as a focused pick: check the size, the included parts, and the recent reviews before you decide.`,
    buyerFit: `Buy this if ${title.toLowerCase()} matches a job you already have. Skip it if the listing does not name that job clearly.`,
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const desk = await isDesk(request, env);

    if (path === "/favicon.svg") {
      return new Response(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#131921"/><path d="M8 20c2 3 14 3 16 0" stroke="#ff9900" stroke-width="2" fill="none"/><text x="8" y="18" fill="#fff" font-size="14" font-family="Arial" font-weight="700">d</text></svg>`, { headers: { "content-type": "image/svg+xml" } });
    }
    if (path === "/robots.txt") return new Response("User-agent: *\nAllow: /\nDisallow: /king-max-panel\nDisallow: /king-max-panel2\n", { headers: { "content-type": "text/plain" } });

    if (path === "/api/unlock" && request.method === "POST") {
      const form = await request.formData();
      if (String(form.get("password") || "") !== (env.DESK_PASSWORD || "kingmax")) return page("Desk · Demanding", `<p class="danger">That password is not right.</p><p><a class="link" href="/king-max-panel">Try again</a></p>`, { noindex: true });
      const exp = String(Date.now() + 1000 * 60 * 60 * 12);
      const token = `${exp}.${await hmac(exp, env)}`;
      return new Response(null, { status: 303, headers: { location: "/king-max-panel", "set-cookie": cookieHeader(token, 60 * 60 * 12) } });
    }
    if (path === "/api/lock") {
      return new Response(null, { status: 303, headers: { location: "/", "set-cookie": cookieHeader("", 0) } });
    }
    if (path === "/api/track" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      if (body.productId && (body.kind === "page" || body.kind === "buy")) {
        const events = await jsonGet(env, "events", []);
        events.push({ id: crypto.randomUUID(), productId: body.productId, kind: body.kind, at: Date.now(), country: countryOf(request) });
        await env.SHOP.put("events", JSON.stringify(events.slice(-4000)));
      }
      return Response.json({ ok: true });
    }
    if (path === "/api/contact" && request.method === "POST") {
      const form = await request.formData();
      const messages = await jsonGet(env, "messages", []);
      messages.unshift({ id: crypto.randomUUID(), name: String(form.get("name") || ""), email: String(form.get("email") || ""), message: String(form.get("message") || ""), at: Date.now() });
      await env.SHOP.put("messages", JSON.stringify(messages.slice(0, 200)));
      return new Response(null, { status: 303, headers: { location: "/contact?sent=1" } });
    }
    if (path === "/api/products" && request.method === "POST") {
      if (!desk) return Response.json({ error: "locked" }, { status: 401 });
      const body = await request.json().catch(() => ({ items: [] }));
      const existing = await loadProducts(env);
      const taken = new Set(existing.map((p) => p.slug));
      const keys = await jsonGet(env, "keys", {});
      const created = [];
      for (const item of (body.items || []).slice(0, 120)) {
        if (!item.affiliateUrl || !item.title) continue;
        const product = {
          id: crypto.randomUUID(),
          slug: slugify(item.title, taken),
          title: String(item.title).slice(0, 140),
          description: String(item.description || "").slice(0, 800),
          affiliateUrl: String(item.affiliateUrl).slice(0, 500),
          imageDataUrl: String(item.imageDataUrl || "").startsWith("data:image/") ? item.imageDataUrl : "",
          benefits: "",
          buyerFit: "",
          createdAt: Date.now(),
        };
        taken.add(product.slug);
        const copy = await writeCopy(product.title, product.description, keys);
        product.benefits = copy.benefits || "";
        product.buyerFit = copy.buyerFit || "";
        await env.SHOP.put(`product:${product.id}`, JSON.stringify(product));
        created.push(product);
      }
      const index = [...created.map((p) => p.id), ...existing.map((p) => p.id)];
      await env.SHOP.put("index", JSON.stringify(index));
      return Response.json({ ok: true, notice: created.length === 1 ? `Page ready: /${created[0].slug}` : `Created ${created.length} pages.` });
    }
    if (path.startsWith("/api/products/") && path.endsWith("/delete") && request.method === "POST") {
      if (!desk) return new Response("locked", { status: 401 });
      const id = path.split("/")[3];
      const index = (await jsonGet(env, "index", [])).filter((item) => item !== id);
      await env.SHOP.put("index", JSON.stringify(index));
      await env.SHOP.delete(`product:${id}`);
      return new Response(null, { status: 303, headers: { location: "/king-max-panel" } });
    }
    if (path === "/api/keys" && request.method === "POST") {
      if (!desk) return new Response("locked", { status: 401 });
      const form = await request.formData();
      await env.SHOP.put("keys", JSON.stringify({
        gemini1: String(form.get("gemini1") || ""),
        gemini2: String(form.get("gemini2") || ""),
        gemini3: String(form.get("gemini3") || ""),
        deepseek: String(form.get("deepseek") || ""),
      }));
      return new Response(null, { status: 303, headers: { location: "/king-max-panel?notice=API+keys+saved+on+the+server" } });
    }

    if (path === "/") return home(await loadProducts(env), url.searchParams.get("q") || "");
    if (path === "/articles") return articlesIndex();
    if (path.startsWith("/articles/")) {
      const article = ARTICLES.find((item) => item.slug === path.slice(10));
      return article ? articlePage(article) : page("Not found", `<h1>That guide is not here</h1><p><a class="link" href="/articles">All guides</a></p>`, { status: 404 });
    }
    if (path === "/about") return info("About", ["Demanding is a small shopping guide. The public pages explain how to shop online without rushing, and the product picks send you to Amazon when you are ready to buy.", "Each pick is a page with a photo, a short note, and one button. The store, the price, and the delivery are Amazon’s. If you buy through a link here, I may earn a commission."]);
    if (path === "/disclosure") return info("Affiliate disclosure", ["<b>As an Amazon Associate I earn from qualifying purchases.</b>", "Demanding participates in the Amazon Associates Program. When you click a Buy from Amazon button and complete a qualifying purchase, I may earn a commission. You do not pay extra for that.", "Product pages here are intermediate pages. They include a photo, a short original note, and a clear button that leaves this site for Amazon. Recommendations are informational. Amazon’s price, at the time you check out, is the price that applies."]);
    if (path === "/privacy") return info("Privacy policy", ["Product picks, photos, and click counts are stored on this site so visitors see the same pages. Contact messages are stored for the editor of this site.", "A country code from the network request may be saved with a page view or a Buy click, so the private desk can show where clicks came from.", "Buying happens on Amazon. Amazon’s own privacy policy covers anything you do after you leave this site. AI keys used to draft notes are stored on the server and are not shown on public pages."]);
    if (path === "/terms") return info("Terms of use", ["The guides on this site are general notes, not product guarantees. Specs, prices, stock, and shipping are decided by Amazon or the seller on the listing.", "Product photos shown on picks are uploaded by the editor of this site. They are not pulled from Amazon’s catalog.", "Use the Buy from Amazon button only if you want to open that listing. You can leave any page without buying."]);
    if (path === "/contact") {
      const sent = url.searchParams.get("sent") ? `<p class="link" style="font-weight:700">Saved. Thank you.</p>` : "";
      return page("Contact · Demanding", `<h1>Contact</h1><p class="muted">Questions about a pick or this site.</p>${sent}<form method="post" action="/api/contact"><input name="name" required placeholder="Name"><input name="email" type="email" required placeholder="Email"><textarea name="message" required rows="5" placeholder="Message"></textarea><button class="btn">Send</button></form>`);
    }
    if (path === "/king-max-panel" || path === "/king-max-panel2") {
      if (!desk) return deskGate();
      if (path === "/king-max-panel2") return tracking(await loadProducts(env), await jsonGet(env, "events", []), await jsonGet(env, "messages", []));
      return editor(await loadProducts(env), await jsonGet(env, "keys", {}), url.searchParams.get("notice") || "");
    }

    const products = await loadProducts(env);
    const product = products.find((item) => item.slug === path.slice(1));
    if (product) return productPage(product);
    return page("Not found · Demanding", `<h1>That pick is not here</h1><p class="muted">It may have been removed.</p><p><a class="link" href="/">Back to the guide</a></p>`);
  },
};
