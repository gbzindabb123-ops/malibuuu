import { MercadoPagoConfig, Preference } from "mercadopago";

export default async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!MP_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: "MP_ACCESS_TOKEN não configurado no Netlify." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ✅ Pega a URL do seu site automaticamente (não depende de SITE_URL)
    const origin = req.headers.get("origin");
    const siteBase =
      origin ||
      process.env.URL ||                 // Netlify default
      process.env.DEPLOY_PRIME_URL ||    // Netlify preview
      process.env.SITE_URL ||            // fallback manual
      "";

    if (!siteBase || !siteBase.startsWith("http")) {
      return new Response(JSON.stringify({ error: "Não consegui determinar a URL base do site." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const bodyReq = await req.json();
    const items = bodyReq?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Carrinho vazio ou inválido." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Sanitiza itens (Mercado Pago gosta disso bem certinho)
    const mpItems = items.map((i) => {
      const title = String(i.title || "").slice(0, 120);
      const quantity = Math.max(1, Number(i.quantity || 1));
      const unit_price = Number(i.unit_price || 0);

      if (!title || !Number.isFinite(unit_price) || unit_price <= 0) {
        throw new Error("Item inválido no carrinho.");
      }

      return {
        title,
        quantity,
        unit_price,
        currency_id: "BRL"
      };
    });

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preferenceApi = new Preference(client);

    const external_reference = `MALIBU-RP-${Date.now()}`;

    const pref = await preferenceApi.create({
      body: {
        items: mpItems,

        // ✅ back_urls SEMPRE definido e ABSOLUTO
        back_urls: {
          success: `${siteBase}/?status=success&ref=${encodeURIComponent(external_reference)}`,
          pending: `${siteBase}/?status=pending&ref=${encodeURIComponent(external_reference)}`,
          failure: `${siteBase}/?status=failure&ref=${encodeURIComponent(external_reference)}`
        },

        // ✅ auto_return só faz sentido com success definido
        auto_return: "approved",

        external_reference,
        metadata: { server: "Malibu Roleplay", delivery: "manual" }
      }
    });

    return new Response(
      JSON.stringify({
        preference_id: pref.id,
        init_point: pref.init_point,
        external_reference
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || "Erro ao criar preferência." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};
