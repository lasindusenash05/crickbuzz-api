const URL_MAP = {
  live: "https://m.cricbuzz.com/cricket-match/live-scores",
  recent: "https://m.cricbuzz.com/cricket-match/live-scores/recent-matches",
  upcoming: "https://m.cricbuzz.com/cricket-match/live-scores/upcoming-matches"
};

export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "live";

    const targetUrl = URL_MAP[filter] || URL_MAP.live;

    const res = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await res.text();

    const matches = [];
    const regex = /<a href="\/live-cricket-scores\/\d+\/[^"]+">([\s\S]*?)<\/a>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const block = match[1];
      const titleMatch = block.match(/<h3[^>]*>(.*?)<\/h3>/);
      const descMatch = block.match(/<div class="cb-col-100">(.*?)<\/div>/);
      const scoreMatches = [...block.matchAll(/<div class="cb-col-50[^"]*">(.*?)<\/div>/g)];

      matches.push({
        title: titleMatch ? titleMatch[1].trim() : null,
        status: descMatch ? descMatch[1].trim() : null,
        scores: scoreMatches.map(m => m[1].trim())
      });
    }

    return Response.json({ matches });
  }
};
