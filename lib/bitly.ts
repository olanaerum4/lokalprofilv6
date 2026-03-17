// Server-only
export async function shortenUrl(url: string): Promise<string> {
  const token = process.env.BITLY_TOKEN
  if (!token) return url // fallback to original if no token

  try {
    const r = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ long_url: url }),
    })

    if (!r.ok) {
      console.error('[Bitly] Error:', r.status, await r.text())
      return url
    }

    const data = await r.json()
    return data.link ?? url
  } catch (e) {
    console.error('[Bitly] Exception:', e)
    return url
  }
}
