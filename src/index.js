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
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9"
      }
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

      const title = titleMatch ? titleMatch[1].trim() : null;
      const status = descMatch ? descMatch[1].trim() : null;
      const scores = scoreMatches.map(m => m[1].trim());

      if (title) {
        matches.push({ title, status, scores });
      }
    }

    return Response.json({ matches });
  }
};
