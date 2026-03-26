const SYMBOLS = [
  { symbol: 'CL=F',  name: 'WTI 원유',  unit: '$/배럴' },
  { symbol: 'BZ=F',  name: 'Brent 원유', unit: '$/배럴' },
  { symbol: 'GC=F',  name: '금 (Gold)',  unit: '$/온스' },
  { symbol: 'SI=F',  name: '은 (Silver)', unit: '$/온스' },
  { symbol: 'NG=F',  name: '천연가스',   unit: '$/MMBtu' },
];

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async ({ symbol, name, unit }) => {
        try {
          const r = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
            { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
          );
          const data = await r.json();
          const meta = data?.chart?.result?.[0]?.meta;
          if (!meta) return { symbol, name, unit, price: null, changePct: null };
          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose;
          const changePct = prevClose ? ((price - prevClose) / prevClose) * 100 : null;
          return { symbol, name, unit, price, changePct };
        } catch {
          return { symbol, name, unit, price: null, changePct: null };
        }
      })
    );
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ result: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
