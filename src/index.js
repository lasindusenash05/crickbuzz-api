export default {
  async fetch(request) {
    const res = await fetch("https://m.cricbuzz.com/cricket-scores", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })
    const html = await res.text()

    const matches = []
    const regex = /<a href="\/live-cricket-scores\/\d+\/[^"]+">([\s\S]*?)<\/a>/g
    let match

    while ((match = regex.exec(html)) !== null) {
      const block = match[1]

      const titleMatch = block.match(/<h3[^>]*>(.*?)<\/h3>/)
      const descMatch = block.match(/<div class="cb-col-100">(.*?)<\/div>/)
      const scoreMatches = [...block.matchAll(/<div class="cb-col-50[^"]*">(.*?)<\/div>/g)]

      matches.push({
        title: titleMatch ? titleMatch[1].trim() : null,
        status: descMatch ? descMatch[1].trim() : null,
        scores: scoreMatches.map(m => m[1].trim())
      })
    }

    return Response.json({ matches })
  }
        }
