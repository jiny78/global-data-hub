const SYMBOLS = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^KS11', name: 'KOSPI' },
  { symbol: '^N225', name: 'Nikkei 225' },
  { symbol: '000001.SS', name: 'Shanghai' },
  { symbol: '^FTSE', name: 'FTSE 100' },
  { symbol: '^GDAXI', name: 'DAX' },
];

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async ({ symbol, name }) => {
        try {
          const r = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
            { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
          );
          const data = await r.json();
          const meta = data?.chart?.result?.[0]?.meta;
          if (!meta) return { symbol, name, price: null, changePct: null };
          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose;
          const changePct = prevClose ? ((price - prevClose) / prevClose) * 100 : null;
          return { symbol, name, price, changePct };
        } catch {
          return { symbol, name, price: null, changePct: null };
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
