export async function handler(event) {
  const { code, state } = event.queryStringParameters || {};

  if (!code) {
    return { statusCode: 400, body: "Code não recebido do Discord." };
  }

  const cookies = Object.fromEntries(
    (event.headers.cookie || "")
      .split("; ")
      .filter(Boolean)
      .map((c) => c.split("="))
  );

  if (!state || state !== cookies.discord_state) {
    return { statusCode: 403, body: "State inválido." };
  }

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.SITE_URL}/.netlify/functions/discord-callback`
    })
  });

  const token = await tokenRes.json();

  if (!tokenRes.ok || !token.access_token) {
    return { statusCode: 400, body: JSON.stringify(token) };
  }

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });

  const user = await userRes.json();

  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    username: user.username,
    avatar: user.avatar
  })).toString("base64");

  return {
    statusCode: 302,
    headers: {
      Location: "/",
      "Set-Cookie": [
        // apaga state depois de usar
        "discord_state=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
        `discord_user=${payload}; Secure; Path=/; SameSite=Lax`
      ]
    }
  };
}
