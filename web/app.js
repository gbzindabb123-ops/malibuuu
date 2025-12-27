// ===== Malibu Roleplay Config =====
const DISCORD_INVITE_URL = "https://discord.gg/Fa7ezQwDa2";
const CONNECT_CMD = ""; // quando tiver IP: "connect SEU_IP_AQUI:30120"

const pages = ["home","store","rules","team","checkout"];

const categories = ["VIPs", "Dinheiro", "Leveis", "Organizações", "Unban"];
let activeCategory = "VIPs";

const productsData = [
  // ===== VIPs =====
  { id:"vip_bronze", category:"VIPs", name:"VIP Bronze(30 dias)", price: 23.99, tag:"VIP", desc:"Prioridade + bônus de salário + perks exclusivos." , img:"./assets/products/bronze.webp"},
  { id:"vip_prata", category:"VIPs", name:"VIP Prata (30 dias)", price: 28.99, tag:"VIP", desc:"Prioridade alta + benefícios premium + fila turbo." , img:"./assets/products/prata.webp"},
  { id:"vip_ouro", category:"VIPs", name:"VIP Ouro (30 dias)", price: 33.99, tag:"VIP", desc:"Prioridade alta + benefícios premium + fila turbo." , img:"./assets/products/ouro.webp"},
  { id:"vip_platina", category:"VIPs", name:"VIP Platina (30 dias)", price: 38.99, tag:"VIP", desc:"Prioridade alta + benefícios premium + fila turbo." , img:"./assets/products/platina.webp"},
  { id:"vip_diamante", category:"VIPs", name:"VIP Diamante (30 dias)", price: 48.99, tag:"VIP", desc:"Prioridade alta + benefícios premium + fila turbo." , img:"./assets/products/diamante.webp"},

  // ===== Dinheiro / Créditos =====
  { id:"coins_50k", category:"Dinheiro", name:"1.000.000", price: 20.00, tag:"Money", desc:"Torne-se um milonario." , img:"./assets/products/1kk.webp"},
  { id:"coins_150k", category:"Dinheiro", name:"2.000.000", price: 35.00, tag:"Money", desc:"Torne-se um milonario." , img:"./assets/products/2kk.webp"},
  { id:"coins_150k", category:"Dinheiro", name:"3.000.000", price: 50.00, tag:"Money", desc:"Torne-se um milonario." , img:"./assets/products/3kk.webp"},
  { id:"coins_150k", category:"Dinheiro", name:"10.000.000", price: 75.00, tag:"Money", desc:"Torne-se um multi-milonario." , img:"./assets/products/10kk.webp"},

  // ===== Leveis =====
 
  { id:"level_pro", category:"Leveis", name:"Level 50", price: 30.00, tag:"Level", desc:"Após a compra, abra um ticket." , img:"./assets/products/50.webp"},
  { id:"level_pro", category:"Leveis", name:"Level 100", price: 43.00, tag:"Level", desc:"Após a compra, abra um ticket." , img:"./assets/products/100.webp"},
  { id:"level_pro", category:"Leveis", name:"Level 150", price: 60.00, tag:"Level", desc:"Após a compra, abra um ticket." , img:"./assets/products/150.webp"},
  { id:"level_pro", category:"Leveis", name:"Level 200", price: 75.00, tag:"Level", desc:"Após a compra, abra um ticket." , img:"./assets/products/200.webp"},

  // ===== Organizações =====
  { id:"org_create", category:"Organizações", name:"Organização policial", price: 35.90, tag:"Org", desc:"Entrega Manual." , img:"./assets/products/cop.webp"},
  { id:"org_upgrade", category:"Organizações", name:"Organização criminosa", price: 35.90, tag:"Org", desc:"Entrega Manual." , img:"./assets/products/fac.webp"},
  { id:"org_upgrade", category:"Organizações", name:"Organização medico", price: 35.90, tag:"Org", desc:"Entrega Manual." , img:"./assets/products/med.webp"},
  { id:"org_upgrade", category:"Organizações", name:"Organização mecanico", price: 45.90, tag:"Org", desc:"Entrega manual." , img:"./assets/products/mec.webp"},

  // ===== Unban =====
  { id:"unban", category:"Unban", name:"Desban Serial", price: 100.00, tag:"Serviço", desc:"1 UN.", img:"./assets/products/serial.webp" },
  { id:"unban", category:"Unban", name:"Desban Conta", price: 50.00, tag:"Serviço", desc:"1 UN.", img:"./assets/products/conta.webp" },
  { id:"unban", category:"Unban", name:"Desban Discord", price: 14.99, tag:"Serviço", desc:"1 UN.", img:"./assets/products/discord.webp" },
];


const teamData = [
  { name:"AQUILES", role:"Fundador • Malibu Roleplay", bio:"Direção do projeto, decisões finais e visão do RP.", links:[["Discord","#"],["Instagram","#"]] },
  { name:"AnNy", role:"Fundadora • Malibu Roleplay", bio:"Administração geral, organização e padronização das regras e experiência do RP.", links:[["Discord","#"],["Instagram","#"]] },
  { name:"VT", role:"Programador • Malibu Roleplay", bio:"Desenvolvimento de scripts, estabilidade, otimização e segurança do servidor.", links:[["Discord","#"],["Instagram","#"]] },
];

const cart = new Map();
const fmtBRL = (v) => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function setPage(page){
  pages.forEach(p=>{
    document.getElementById(`page-${p}`).classList.toggle("show", p===page);
  });

  document.querySelectorAll(".nav-btn").forEach(b=>{
    b.classList.toggle("active", b.dataset.page===page);
  });

  // salva a aba atual na URL
  window.location.hash = page;

  window.scrollTo({ top:0, behavior:"smooth" });
}

function cartCount(){
  let n = 0;
  for (const qty of cart.values()) n += qty;
  return n;
}
function cartTotal(){
  let total = 0;
  for (const [id, qty] of cart.entries()){
    const p = productsData.find(x=>x.id===id);
    total += (p?.price || 0) * qty;
  }
  return total;
}

function renderCart(){
  document.getElementById("cartCount").textContent = cartCount();
  const box = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  totalEl.textContent = fmtBRL(cartTotal());

  if (cartCount() === 0){
    box.innerHTML = `<div class="muted">Seu carrinho está vazio. Vá na Loja e adicione produtos.</div>`;
    return;
  }

  box.innerHTML = "";
  for (const [id, qty] of cart.entries()){
    const p = productsData.find(x=>x.id===id);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="left">
        <div class="title">${p.name}</div>
        <div class="sub">${qty} × ${fmtBRL(p.price)} • <span class="muted">${p.tag}</span></div>
      </div>
      <div class="actions">
        <button data-act="dec" data-id="${id}">-</button>
        <strong>${qty}</strong>
        <button data-act="inc" data-id="${id}">+</button>
        <button data-act="del" data-id="${id}">Remover</button>
      </div>
    `;
    box.appendChild(row);
  }

  box.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id;
      const act = btn.dataset.act;
      if (act==="inc") cart.set(id, (cart.get(id)||0)+1);
      if (act==="dec") cart.set(id, Math.max(1, (cart.get(id)||1)-1));
      if (act==="del") cart.delete(id);
      renderCart();
      renderProducts(document.getElementById("searchInput")?.value || "");
    });
  });
}

function renderProducts(filter=""){
  const wrap = document.getElementById("products");
  wrap.innerHTML = "";
  const q = filter.trim().toLowerCase();

  const items = productsData.filter(p => {
    const inCat = (activeCategory === "Todos") || (p.category === activeCategory);
    const inSearch = (!q) || p.name.toLowerCase().includes(q) || (p.tag||"").toLowerCase().includes(q);
    return inCat && inSearch;
  });

  if (items.length === 0){
    wrap.innerHTML = `<div class="card"><div class="muted">Nenhum produto nessa aba (ou nessa busca).</div></div>`;
    return;
  }

  items.forEach(p=>{
    const el = document.createElement("div");
    el.className = "prod";
    const qty = cart.get(p.id) || 0;

    el.innerHTML = `
      <div class="prod-img"><img src="${p.img}" alt="${p.name}"></div>
      <span class="badge">${p.tag}</span>
      <div class="name">${p.name}</div>
      <div class="muted small">${p.desc}</div>
      <div class="row">
        <div>
          <div class="price">${fmtBRL(p.price)}</div>
          <div class="muted small">Entrega manual pela staff</div>
        </div>
        <div class="qty">
          <button data-act="dec">-</button>
          <span>${qty}</span>
          <button data-act="inc">+</button>
        </div>
      </div>
    `;

    const buttons = el.querySelectorAll("button");
    const bDec = buttons[0];
    const bInc = buttons[1];

    bDec.addEventListener("click", ()=>{
      if (!cart.has(p.id)) return;
      const n = cart.get(p.id);
      if (n<=1) cart.delete(p.id); else cart.set(p.id, n-1);
      renderProducts(document.getElementById("searchInput").value);
      renderCart();
    });
    bInc.addEventListener("click", ()=>{
      cart.set(p.id, (cart.get(p.id)||0)+1);
      renderProducts(document.getElementById("searchInput").value);
      renderCart();
    });

    wrap.appendChild(el);
  });
}

function renderTeam(){
  const wrap = document.getElementById("teamCards");
  wrap.innerHTML = "";
  teamData.forEach((m)=>{
    const el = document.createElement("div");
    el.className = "member";
    el.innerHTML = `
      <div class="avatar">${m.name.slice(0,1).toUpperCase()}</div>
      <div class="name">${m.name}</div>
      <div class="role">${m.role}</div>
      <div class="bio">${m.bio}</div>
      <div class="links">
        ${m.links.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${l[0]}</a>`).join("")}
      </div>
    `;
    wrap.appendChild(el);
  });
}

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 3400);
}

async function payNow(){
  if (cartCount()===0) return toast("Carrinho vazio. Adicione itens na Loja.");
  const name = document.getElementById("buyerName").value.trim();
  const email = document.getElementById("buyerEmail").value.trim();
  if (!name || !email) return toast("Preencha nome e e-mail.");

  const items = [];
  for (const [id, qty] of cart.entries()){
    const p = productsData.find(x=>x.id===id);
    items.push({ id, title:p.name, unit_price:p.price, quantity:qty });
  }

  try{
    const res = await fetch(`/.netlify/functions/mp_create_preference`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ buyer:{name,email}, items })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Falha no Mercado Pago");
    window.location.href = data.init_point;
  }catch(err){
    toast(err?.message || "Erro ao iniciar pagamento.");
  }
}

// Discord modal
function openDiscordModal(){
  const modal = document.getElementById("discordModal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  const inviteText = document.getElementById("discordInviteText");
  inviteText.textContent = DISCORD_INVITE_URL ? DISCORD_INVITE_URL : "Ainda não definido";
}
function closeDiscordModal(){
  const modal = document.getElementById("discordModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// Init
document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const page = btn.dataset.page;
    if (page){
      setPage(page);
      renderCart();
    }
  });
});

document.getElementById("btnGoStore").addEventListener("click",(e)=>{e.preventDefault(); setPage("store");});
document.getElementById("btnGoStore2").addEventListener("click",(e)=>{e.preventDefault(); setPage("store");});

document.getElementById("btnCopyIP").addEventListener("click",(e)=>{
  e.preventDefault();
  if (!CONNECT_CMD){
    toast("IP ainda não definido. Assim que tiver, eu coloco o connect aqui.");
    return;
  }
  navigator.clipboard.writeText(CONNECT_CMD);
  toast(`Connect copiado: ${CONNECT_CMD}`);
});

document.getElementById("btnClearCart").addEventListener("click", ()=>{
  cart.clear();
  renderProducts(document.getElementById("searchInput").value);
  renderCart();
});

document.getElementById("btnPay").addEventListener("click", payNow);
document.getElementById("searchInput").addEventListener("input",(e)=> renderProducts(e.target.value));

renderCategoryTabs();
renderProducts("");
renderTeam();
renderCart();

// Banner buttons
const btnBannerStore = document.getElementById("btnBannerStore");
if (btnBannerStore) btnBannerStore.addEventListener("click", ()=> setPage("store"));
const btnBannerDiscord = document.getElementById("btnBannerDiscord");
if (btnBannerDiscord) btnBannerDiscord.addEventListener("click", openDiscordModal);

// Discord open/close
document.getElementById("btnDiscord").addEventListener("click", openDiscordModal);
document.getElementById("btnDiscordFloat").addEventListener("click", openDiscordModal);
document.getElementById("discordClose").addEventListener("click", closeDiscordModal);
document.getElementById("discordModal").addEventListener("click", (e)=>{ if (e.target?.dataset?.close) closeDiscordModal(); });

document.getElementById("btnCopyDiscord").addEventListener("click", async ()=>{
  if (!DISCORD_INVITE_URL) return toast("Discord ainda não definido. Me envie o link do convite.");
  await navigator.clipboard.writeText(DISCORD_INVITE_URL);
  toast("Convite do Discord copiado!");
});
document.getElementById("btnOpenDiscord").addEventListener("click", ()=>{
  if (!DISCORD_INVITE_URL) return toast("Discord ainda não definido. Me envie o link do convite.");
  window.open(DISCORD_INVITE_URL, "_blank");
});


function renderCategoryTabs(){
  const wrap = document.getElementById("categoryTabs");
  if (!wrap) return;
  wrap.innerHTML = "";
  categories.forEach(cat=>{
    const b = document.createElement("button");
    b.className = "tab" + (cat === activeCategory ? " active" : "");
    b.type = "button";
    b.textContent = cat;
    b.addEventListener("click", ()=>{
      activeCategory = cat;
      wrap.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      b.classList.add("active");
      renderProducts(document.getElementById("searchInput")?.value || "");
    });
    wrap.appendChild(b);
  });
}

// Função para o login com Discord (mockup)
document.getElementById("btnLogin").addEventListener("click", () => {
  alert("Redirecionando para login com Discord...");
  // Aqui você pode configurar a lógica real de integração com o Discord (exemplo usando OAuth2)
});
