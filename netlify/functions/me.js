export async function handler(event) {
  const cookies = Object.fromEntries(
    (event.headers.cookie || "")
      .split("; ")
      .filter(Boolean)
      .map((c) => c.split("="))
  );

  if (!cookies.discord_user) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logged: false })
    };
  }

  try {
    const user = JSON.parse(Buffer.from(cookies.discord_user, "base64").toString());
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logged: true, user })
    };
  } catch {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logged: false })
    };
  }
}
