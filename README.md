# Malibu Roleplay (Mercado Pago + Netlify Functions)

## O que este projeto faz
- Site (front) em `web/`
- Pagamento SEM link manual: ao clicar em "Pagar agora" o site cria a preferência no Mercado Pago via Netlify Function.
- Entrega manual (ticket no Discord).

## Como hospedar (mais fácil)
1) Suba este projeto no GitHub (repositório com `web/` + `netlify/` + `netlify.toml`)
2) Netlify -> Add new site -> Import from Git -> selecione o repo
3) No Netlify (Site settings -> Environment variables) crie:
   - MP_ACCESS_TOKEN = seu token de produção do Mercado Pago
   - WEB_BASE_URL = https://SEU-SITE.netlify.app

Pronto: o botão "Pagar agora" abre o checkout do Mercado Pago.

## Banner
Substitua:
- `web/assets/banner.jpg` (recomendado 1920x520)

## Discord
No `web/app.js`, coloque seu convite em:
- DISCORD_INVITE_URL = "https://discord.gg/SEULINK"
