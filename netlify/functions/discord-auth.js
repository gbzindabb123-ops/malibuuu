import crypto from "crypto";

export async function handler() {
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: `${process.env.SITE_URL}/.netlify/functions/discord-callback`,
    response_type: "code",
    scope: "identify",
    state
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://discord.com/oauth2/authorize?${params.toString()}`,
      "Set-Cookie": `discord_state=${state}; HttpOnly; Secure; Path=/; SameSite=Lax`
    }
  };
}
