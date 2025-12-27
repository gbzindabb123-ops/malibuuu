export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { buyer, items } = JSON.parse(event.body || "{}");
    if (!items?.length) {
      return { statusCode: 400, body: JSON.stringify({ error: "Carrinho vazio" }) };
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    const webBaseUrl = process.env.WEB_BASE_URL;

    if (!accessToken) {
      return { statusCode: 500, body: JSON.stringify({ error: "MP_ACCESS_TOKEN não configurado no Netlify" }) };
    }
    if (!webBaseUrl) {
      // Não é obrigatório pra criar pagamento, mas evita back_urls vazias
      // e deixa seu fluxo mais bonito (success/pending/failure).
      console.warn("WEB_BASE_URL não configurado no Netlify.");
    }

    const payload = {
      items: items.map(i => ({
        title: i.title,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        currency_id: "BRL"
      })),
      payer: {
        name: buyer?.name,
        email: buyer?.email
      },
      auto_return: "approved"
    };

    if (webBaseUrl) {
      payload.back_urls = {
        success: `${webBaseUrl}/?paid=success`,
        pending: `${webBaseUrl}/?paid=pending`,
        failure: `${webBaseUrl}/?paid=failure`
      };
    }

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data?.message || "Erro Mercado Pago", details: data })
      };
    }

    return { statusCode: 200, body: JSON.stringify({ init_point: data.init_point }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || "Erro interno" }) };
  }
}
