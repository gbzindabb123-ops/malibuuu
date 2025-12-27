export async function handler() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": [
        "discord_user=; Path=/; Max-Age=0; Secure; SameSite=Lax",
        "discord_state=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
      ]
    },
    body: JSON.stringify({ ok: true })
  };
}
