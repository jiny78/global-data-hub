import React, { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

// Theme colors
const theme = {
  bg: '#ffffff',
  card: '#f1f5f9',
  text: '#0f172a',
  border: '#cbd5e1',
  muted: '#475569',
  accent: '#0284c7',
  accentLight: '#0ea5e9',
  accentDark: '#0369a1',
};

// Number formatter
const fmt = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(0);
};

// Shared Components
const Card = ({ title, value, sub, icon, color }) => {
  const isMobile = useWindowWidth() < 768;
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: isMobile ? '14px' : '20px',
        borderLeft: `4px solid ${color || theme.accent}`,
        fontFamily: 'JetBrains Mono',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '6px' }}>{title}</div>
          <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: theme.text, marginBottom: sub ? '4px' : 0 }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: '11px', color: theme.muted }}>{sub}</div>}
        </div>
        {icon && <div style={{ fontSize: isMobile ? '22px' : '28px' }}>{icon}</div>}
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon, children, api, lastUpdated, onRefresh }) => (
  <div
    style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      fontFamily: 'JetBrains Mono',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <h3 style={{ margin: 0, color: theme.text, fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {onRefresh && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', padding: '4px 10px' }}>
            {lastUpdated ? (
              <span style={{ fontSize: '11px', color: theme.muted }}>
                🕐 {lastUpdated.toLocaleTimeString('ko-KR')}
              </span>
            ) : (
              <span style={{ fontSize: '11px', color: theme.muted }}>로딩 중...</span>
            )}
            <button
              onClick={onRefresh}
              style={{
                background: theme.accent,
                border: 'none',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: 1,
              }}
              title="새로고침"
            >
              ↻ 새로고침
            </button>
          </div>
        )}
        {api && (
          <div
            style={{
              background: '#10b981',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></span>
            LIVE API
          </div>
        )}
      </div>
    </div>
    {children}
  </div>
);

const DataTable = ({ headers, rows, maxRows = 10 }) => (
  <div style={{ overflowX: 'auto', border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'JetBrains Mono',
        fontSize: '13px',
      }}
    >
      <thead>
        <tr style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
          {headers.map((h) => (
            <th
              key={h}
              style={{
                padding: '12px',
                textAlign: 'left',
                color: theme.muted,
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(0, maxRows).map((row, idx) => (
          <tr key={idx} style={{ borderBottom: `1px solid ${theme.border}` }}>
            {row.map((cell, cidx) => (
              <td
                key={cidx}
                style={{
                  padding: '12px',
                  color: theme.text,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Loader = () => (
  <div style={{ textAlign: 'center', padding: '40px', color: theme.muted }}>
    <div
      style={{
        display: 'inline-block',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: `3px solid ${theme.border}`,
        borderTop: `3px solid ${theme.accent}`,
        animation: 'spin 1s linear infinite',
        marginBottom: '12px',
      }}
    ></div>
    <div>데이터 로딩 중...</div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Tab Components
const Overview = () => {
  const isMobile = useWindowWidth() < 768;
  const stats = [
    { title: '세계 인구', value: fmt(8.19e9), sub: '2024년', icon: '👥', color: '#06b6d4' },
    { title: '국가 수', value: '195', icon: '🌍', color: '#8b5cf6' },
    { title: 'GDP', value: '$' + fmt(105.4e12), sub: '2023년', icon: '💹', color: '#ec4899' },
    { title: '일일 항공편', value: fmt(115e3), icon: '✈️', color: '#f59e0b' },
    { title: '일일 컨테이너선', value: fmt(5500), icon: '🚢', color: '#10b981' },
    { title: 'CO₂ 배출량', value: fmt(37.4e9) + 't', sub: '2023년', icon: '🌡️', color: '#ef4444' },
    { title: '인터넷 사용자', value: fmt(5.56e9), icon: '📡', color: '#06b6d4' },
    { title: '일일 지진', value: fmt(55), sub: '평균', icon: '🌋', color: '#f97316' },
  ];

  const apis = [
    { name: 'World Bank', desc: '경제 & 개발 데이터', url: 'worldbank.org', badge: 'FREE' },
    { name: 'Open Meteo', desc: '날씨 & 기후 데이터', url: 'open-meteo.com', badge: 'FREE' },
    { name: 'USGS Earthquake', desc: '지진 데이터', url: 'earthquake.usgs.gov', badge: 'FREE' },
    { name: 'REST Countries', desc: '국가 정보', url: 'restcountries.com', badge: 'FREE' },
    { name: 'NASA API', desc: '우주 & 위성 데이터', url: 'nasa.gov', badge: 'FREE' },
    { name: 'IEA', desc: '에너지 통계', url: 'iea.org', badge: 'PAID' },
    { name: 'AirLabs', desc: '항공편 데이터', url: 'airlabs.co', badge: 'PAID' },
    { name: 'MarineTraffic', desc: '해운 추적', url: 'marinetraffic.com', badge: 'PAID' },
    { name: 'WHO', desc: '보건 데이터', url: 'who.int', badge: 'FREE' },
    { name: 'UNWPP', desc: 'UN 인구 통계', url: 'un.org', badge: 'FREE' },
    { name: 'IMF', desc: '재정 데이터', url: 'imf.org', badge: 'FREE' },
    { name: 'World Trade', desc: '무역 통계', url: 'wits.worldbank.org', badge: 'FREE' },
  ];

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)',
          border: `1px solid ${theme.border}`,
          padding: isMobile ? '32px 20px' : '60px 40px',
          borderRadius: '8px',
          marginBottom: isMobile ? '20px' : '40px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(2, 132, 199, 0.08) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            zIndex: 0,
          }}
        ></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: isMobile ? '28px' : '48px', margin: '0 0 12px 0', color: theme.text }}>🌐 Global Data Hub</h1>
          <p style={{ fontSize: '14px', color: theme.muted, margin: 0 }}>실시간 글로벌 데이터 통합 대시보드</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: isMobile ? '10px' : '16px',
          marginBottom: isMobile ? '20px' : '40px',
        }}
      >
        {stats.map((s, i) => (
          <Card key={i} {...s} />
        ))}
      </div>

      {/* API Sources */}
      <h2 style={{ color: theme.text, marginBottom: '16px', fontSize: '18px' }}>API 데이터 소스</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {apis.map((api, i) => (
          <div
            key={i}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, color: theme.text, fontSize: '14px', fontWeight: 'bold' }}>{api.name}</h3>
              <span
                style={{
                  background: api.badge === 'FREE' ? '#10b981' : '#f97316',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              >
                {api.badge}
              </span>
            </div>
            <p style={{ margin: '0 0 8px 0', color: theme.muted, fontSize: '12px' }}>{api.desc}</p>
            <a href={'https://' + api.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.accent, fontSize: '12px', textDecoration: 'none' }}>
              {api.url} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const STOCK_SYMBOLS = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^KS11', name: 'KOSPI' },
  { symbol: '^N225', name: 'Nikkei 225' },
  { symbol: '000001.SS', name: 'Shanghai' },
  { symbol: '^FTSE', name: 'FTSE 100' },
  { symbol: '^GDAXI', name: 'DAX' },
];

const Economy = () => {
  const [gdp, setGdp] = useState([]);
  const [gdpLoading, setGdpLoading] = useState(true);
  const [stocks, setStocks] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [stocksUpdated, setStocksUpdated] = useState(null);
  const [commodities, setCommodities] = useState([]);
  const [commLoading, setCommLoading] = useState(true);
  const [commUpdated, setCommUpdated] = useState(null);
  const [rates, setRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesUpdated, setRatesUpdated] = useState(null);

  useEffect(() => {
    const fetchGDP = async () => {
      try {
        const res = await fetch(
          'https://api.worldbank.org/v2/country/USA;CHN;JPN;DEU;IND;GBR;FRA;KOR;BRA;CAN/indicator/NY.GDP.MKTP.CD?format=json&date=2023&per_page=20'
        );
        const data = await res.json();
        if (data[1]) {
          const sorted = data[1]
            .filter((d) => d.value)
            .sort((a, b) => b.value - a.value);
          setGdp(sorted.slice(0, 10));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setGdpLoading(false);
      }
    };
    fetchGDP();
  }, []);

  const fetchStocks = async () => {
    setStocksLoading(true);
    try {
      const res = await fetch('/api/stocks');
      const data = await res.json();
      const results = data?.result || [];
      const mapped = results.map(({ name, price, changePct }) => {
        const val = price != null ? price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : 'N/A';
        const chg = changePct != null ? (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%' : 'N/A';
        return { idx: name, val, chg };
      });
      setStocks(mapped);
      setStocksUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setStocksLoading(false);
    }
  };

  const fetchCommodities = async () => {
    setCommLoading(true);
    try {
      const res = await fetch('/api/commodities');
      const data = await res.json();
      setCommodities(data?.result || []);
      setCommUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setCommLoading(false);
    }
  };

  const fetchRates = async () => {
    setRatesLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      setRates(data?.rates || null);
      setRatesUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchCommodities();
    const interval = setInterval(fetchCommodities, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f97316'];
  const maxGdp = gdp[0]?.value || 1;

  const APIs = [
    { name: 'World Bank', desc: 'GDP, 개발 지표', url: 'worldbank.org', badge: 'FREE' },
    { name: 'IMF', desc: '국제 경제 통계', url: 'imf.org', badge: 'FREE' },
    { name: 'OECD', desc: '경제 데이터', url: 'oecd.org', badge: 'FREE' },
    { name: 'Federal Reserve', desc: '미국 경제 데이터', url: 'federalreserve.gov', badge: 'FREE' },
    { name: 'ECB', desc: '유로존 경제 데이터', url: 'ecb.europa.eu', badge: 'FREE' },
    { name: 'World Trade', desc: '무역 통계', url: 'wits.worldbank.org', badge: 'FREE' },
  ];

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="주요 국가별 GDP" icon="💹" api>
        {gdpLoading ? (
          <Loader />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {gdp.map((d, i) => {
              const width = (d.value / maxGdp) * 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: theme.text, fontSize: '12px' }}>{d.country?.value}</span>
                    <span style={{ color: theme.muted, fontSize: '12px' }}>${fmt(d.value)}</span>
                  </div>
                  <div
                    style={{
                      background: theme.bg,
                      height: '20px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: colors[i % colors.length],
                        height: '100%',
                        width: width + '%',
                        transition: 'width 0.3s',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="글로벌 주식지수" icon="📊" api lastUpdated={stocksUpdated} onRefresh={fetchStocks}>
        {stocksLoading ? (
          <Loader />
        ) : (
          <DataTable
            headers={['지수', '현재가', '등락률']}
            rows={stocks.map((s) => [
              s.idx,
              s.val,
              <span style={{ color: s.chg === 'N/A' ? theme.muted : s.chg.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                {s.chg}
              </span>,
            ])}
          />
        )}
      </SectionCard>

      <SectionCard title="원자재 시세" icon="🛢️" api lastUpdated={commUpdated} onRefresh={fetchCommodities}>
        {commLoading ? <Loader /> : (
          <DataTable
            headers={['품목', '현재가', '단위', '등락률']}
            rows={commodities.map((c) => {
              const chg = c.changePct != null ? (c.changePct >= 0 ? '+' : '') + c.changePct.toFixed(2) + '%' : 'N/A';
              const chgColor = c.changePct == null ? theme.muted : c.changePct >= 0 ? '#10b981' : '#ef4444';
              return [
                c.name,
                c.price != null ? '$' + c.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : 'N/A',
                c.unit,
                <span style={{ color: chgColor, fontWeight: 'bold' }}>{chg}</span>,
              ];
            })}
          />
        )}
      </SectionCard>

      <SectionCard title="주요 환율 (USD 기준)" icon="💱" api lastUpdated={ratesUpdated} onRefresh={fetchRates}>
        {ratesLoading ? <Loader /> : rates ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { code: 'KRW', name: '한국 원', flag: '🇰🇷' },
              { code: 'JPY', name: '일본 엔', flag: '🇯🇵' },
              { code: 'EUR', name: '유로', flag: '🇪🇺' },
              { code: 'GBP', name: '영국 파운드', flag: '🇬🇧' },
              { code: 'CNY', name: '중국 위안', flag: '🇨🇳' },
              { code: 'HKD', name: '홍콩 달러', flag: '🇭🇰' },
              { code: 'SGD', name: '싱가포르 달러', flag: '🇸🇬' },
              { code: 'AUD', name: '호주 달러', flag: '🇦🇺' },
            ].map(({ code, name, flag }) => (
              <div key={code} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '4px' }}>{flag} {name}</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: theme.text }}>
                  {rates[code] != null ? rates[code].toLocaleString('en-US', { maximumFractionDigits: code === 'KRW' || code === 'JPY' ? 1 : 4 }) : 'N/A'}
                </div>
                <div style={{ fontSize: '10px', color: theme.muted, marginTop: '3px' }}>1 USD = {code}</div>
              </div>
            ))}
          </div>
        ) : <div style={{ color: theme.muted }}>데이터를 불러올 수 없습니다.</div>}
      </SectionCard>

      <h2 style={{ color: theme.text, marginBottom: '16px', fontSize: '18px' }}>경제 데이터 소스</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {APIs.map((api, i) => (
          <div
            key={i}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <h3 style={{ margin: 0, color: theme.text, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              {api.name}
            </h3>
            <p style={{ margin: '0 0 8px 0', color: theme.muted, fontSize: '12px' }}>{api.desc}</p>
            <span
              style={{
                background: api.badge === 'FREE' ? '#10b981' : '#f97316',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              {api.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Earthquake = () => {
  const [range, setRange] = useState('day');
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ count: 0, maxMag: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);

  const ranges = [
    { label: '1시간', val: 'hour' },
    { label: '24시간', val: 'day' },
    { label: '7일', val: 'week' },
    { label: '30일', val: 'month' },
  ];

  const fetchQuakes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_${range}.geojson`
      );
      const data = await res.json();
      if (data.features) {
        const sorted = data.features.sort((a, b) => b.properties.mag - a.properties.mag);
        setQuakes(sorted.slice(0, 20));
        setStats({
          count: data.features.length,
          maxMag: data.features.length > 0 ? Math.max(...data.features.map((f) => f.properties.mag)) : 0,
        });
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuakes();
    const interval = setInterval(fetchQuakes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [range]);

  const getMagColor = (mag) => {
    if (mag >= 7) return '#ef4444';
    if (mag >= 5) return '#f97316';
    if (mag >= 4) return '#fbbf24';
    return '#10b981';
  };

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="지진 데이터" icon="🌋" api lastUpdated={lastUpdated} onRefresh={fetchQuakes}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {ranges.map((r) => (
            <button
              key={r.val}
              onClick={() => setRange(r.val)}
              style={{
                padding: '8px 16px',
                background: range === r.val ? theme.accent : theme.bg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: range === r.val ? 'bold' : 'normal',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <Card title="총 지진 횟수" value={fmt(stats.count)} icon="📊" color={theme.accent} />
          <Card title="최대 규모" value={stats.maxMag.toFixed(1)} sub="Magnitude" icon="📈" color="#ef4444" />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {quakes.map((q, i) => {
              const time = new Date(q.properties.time).toLocaleString('ko-KR');
              const mag = q.properties.mag;
              const color = getMagColor(mag);
              return (
                <div
                  key={i}
                  style={{
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          background: color,
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                      >
                        M{mag.toFixed(1)}
                      </span>
                      <span style={{ color: theme.text, fontSize: '12px', fontWeight: 'bold' }}>
                        {q.properties.place}
                      </span>
                      {q.properties.tsunami && <span style={{ color: '#06b6d4', fontSize: '10px' }}>🌊 쓰나미</span>}
                    </div>
                    <div style={{ color: theme.muted, fontSize: '11px' }}>{time}</div>
                    <div style={{ color: theme.muted, fontSize: '11px' }}>깊이: {q.geometry.coordinates[2].toFixed(1)} km</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

const Population = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPop = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,population,area,region,flags,cca3'
      );
      const data = await res.json();
      const sorted = data
        .filter((c) => c.population)
        .sort((a, b) => b.population - a.population);
      setCountries(sorted.slice(0, 30));
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPop();
    const interval = setInterval(fetchPop, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const maxPop = countries[0]?.population || 1;

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="국가별 인구 (상위 30)" icon="👥" api lastUpdated={lastUpdated} onRefresh={fetchPop}>
        {loading ? (
          <Loader />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
            {countries.map((c, i) => {
              const width = (c.population / maxPop) * 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: theme.muted, fontSize: '11px', minWidth: '24px' }}>{i + 1}</span>
                    <img
                      src={c.flags.png}
                      alt={c.name.common}
                      style={{ width: '28px', height: '18px', borderRadius: '2px' }}
                    />
                    <span style={{ color: theme.text, fontSize: '12px', flex: 1 }}>{c.name.common}</span>
                    <span style={{ color: theme.muted, fontSize: '11px', minWidth: '80px', textAlign: 'right' }}>
                      {fmt(c.population)}
                    </span>
                  </div>
                  <div
                    style={{
                      background: theme.bg,
                      height: '16px',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #0ea5e9, #06b6d4)',
                        height: '100%',
                        width: width + '%',
                      }}
                    ></div>
                  </div>
                  <div style={{ fontSize: '10px', color: theme.muted, marginTop: '2px' }}>
                    {c.area ? fmt(c.area) + ' km²' : 'N/A'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

const Climate = () => {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cities = [
    { name: 'Seoul', lat: 37.57, lon: 126.98, flag: '🇰🇷' },
    { name: 'Tokyo', lat: 35.68, lon: 139.69, flag: '🇯🇵' },
    { name: 'New York', lat: 40.71, lon: -74.01, flag: '🇺🇸' },
    { name: 'London', lat: 51.51, lon: -0.13, flag: '🇬🇧' },
    { name: 'Sydney', lat: -33.87, lon: 151.21, flag: '🇦🇺' },
    { name: 'Dubai', lat: 25.2, lon: 55.27, flag: '🇦🇪' },
  ];

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const results = {};
      await Promise.all(
        cities.map(async (c) => {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
          );
          const data = await res.json();
          results[c.name] = data.current;
        })
      );
      setWeather(results);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherEmoji = (code) => {
    if (code <= 1) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌧️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    return '⛈️';
  };

  const APIs = [
    { name: 'Open Meteo', desc: '날씨 데이터', url: 'open-meteo.com', badge: 'FREE' },
    { name: 'NOAA', desc: '미국 날씨 데이터', url: 'noaa.gov', badge: 'FREE' },
    { name: 'Copernicus', desc: '위성 데이터', url: 'copernicus.eu', badge: 'FREE' },
    { name: 'OpenWeather', desc: '상용 날씨 API', url: 'openweathermap.org', badge: 'PAID' },
  ];

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="주요 도시 날씨" icon="🌡️" api lastUpdated={lastUpdated} onRefresh={fetchWeather}>
        {loading ? (
          <Loader />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {cities.map((c) => {
              const w = weather[c.name];
              return w ? (
                <div
                  key={c.name}
                  style={{
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                    {getWeatherEmoji(w.weather_code)} {c.flag}
                  </div>
                  <h3 style={{ margin: '0 0 12px 0', color: theme.text, fontSize: '14px' }}>{c.name}</h3>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: theme.accent, marginBottom: '8px' }}>
                    {w.temperature_2m}°C
                  </div>
                  <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '4px' }}>
                    습도: {w.relative_humidity_2m}%
                  </div>
                  <div style={{ color: theme.muted, fontSize: '12px' }}>
                    바람: {w.wind_speed_10m} km/h
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}
      </SectionCard>

      <h2 style={{ color: theme.text, marginBottom: '16px', fontSize: '18px' }}>기후 데이터 소스</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {APIs.map((api, i) => (
          <div
            key={i}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <h3 style={{ margin: 0, color: theme.text, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              {api.name}
            </h3>
            <p style={{ margin: '0 0 8px 0', color: theme.muted, fontSize: '12px' }}>{api.desc}</p>
            <span
              style={{
                background: api.badge === 'FREE' ? '#10b981' : '#f97316',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              {api.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Trade = () => {
  const [tradeData, setTradeData] = useState([]);
  const [tradeLoading, setTradeLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const COUNTRY_KO = { CHN:'중국', USA:'미국', DEU:'독일', JPN:'일본', NLD:'네덜란드', KOR:'한국', FRA:'프랑스', ITA:'이탈리아' };
  const COUNTRY_COLORS = ['#ef4444','#3b82f6','#f97316','#10b981','#8b5cf6','#06b6d4','#fbbf24','#ec4899'];

  const fetchTrade = async () => {
    setTradeLoading(true);
    try {
      const res = await fetch(
        'https://api.worldbank.org/v2/country/CHN;USA;DEU;JPN;NLD;KOR;FRA;ITA/indicator/TG.VAL.TOTL.GD.ZS?format=json&date=2022&per_page=20'
      );
      const data = await res.json();
      if (data[1]) {
        const sorted = data[1]
          .filter((d) => d.value)
          .sort((a, b) => b.value - a.value);
        setTradeData(sorted);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTradeLoading(false);
    }
  };

  useEffect(() => {
    fetchTrade();
    const interval = setInterval(fetchTrade, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const ports = [
    { name: 'Shanghai', vol: 49.0, color: '#ef4444' },
    { name: 'Singapore', vol: 39.0, color: '#f97316' },
    { name: 'Ningbo', vol: 35.3, color: '#fbbf24' },
    { name: 'Shenzhen', vol: 30.2, color: '#06b6d4' },
    { name: 'Guangzhou', vol: 24.6, color: '#8b5cf6' },
    { name: 'Busan', vol: 22.1, color: '#ef4444' },
    { name: 'Qingdao', vol: 21.8, color: '#f97316' },
    { name: 'Rotterdam', vol: 14.5, color: '#10b981' },
  ];

  const maxPort = Math.max(...ports.map((p) => p.vol));
  const maxTrade = tradeData[0]?.value || 1;

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="주요국 무역 규모 (GDP 대비 %)" icon="🚢" api lastUpdated={lastUpdated} onRefresh={fetchTrade}>
        {tradeLoading ? <Loader /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tradeData.map((d, i) => {
              const code = d.country?.id;
              const name = COUNTRY_KO[code] || d.country?.value;
              const width = (d.value / maxTrade) * 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: theme.text, fontSize: '12px' }}>{name}</span>
                    <span style={{ color: theme.muted, fontSize: '12px' }}>{d.value?.toFixed(1)}%</span>
                  </div>
                  <div style={{ background: theme.bg, height: '18px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: COUNTRY_COLORS[i % COUNTRY_COLORS.length], height: '100%', width: width + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="컨테이너항 처리량 (M TEU)" icon="📦">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {ports.map((p, i) => {
            const width = (p.vol / maxPort) * 100;
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: theme.text, fontSize: '12px' }}>{p.name}</span>
                  <span style={{ color: theme.muted, fontSize: '12px' }}>{p.vol}M</span>
                </div>
                <div
                  style={{
                    background: theme.bg,
                    height: '20px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: p.color,
                      height: '100%',
                      width: width + '%',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

const Aviation = () => {
  const [liveFlights, setLiveFlights] = useState(null);
  const [flightsUpdated, setFlightsUpdated] = useState(null);

  const fetchFlights = async () => {
    try {
      const res = await fetch('https://opensky-network.org/api/states/all?lamin=20&lamax=75&lomin=-140&lomax=145');
      const data = await res.json();
      setLiveFlights(data.states?.length ?? null);
      setFlightsUpdated(new Date());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: '현재 비행 중 (북반구)', value: liveFlights != null ? fmt(liveFlights) : '...', icon: '✈️', color: '#0ea5e9' },
    { title: '연간 승객', value: fmt(4.7e9), icon: '👫', color: '#8b5cf6' },
    { title: '공항 수', value: fmt(41e3), icon: '🛫', color: '#f97316' },
    { title: '항공사 수', value: fmt(5000), icon: '🏢', color: '#10b981' },
  ];

  const airports = [
    ['ATL (Atlanta)', '93.7M', 'Hartsfield-Jackson'],
    ['DXB (Dubai)', '92.3M', 'Dubai Int\'l'],
    ['DFW (Dallas)', '81.8M', 'Dallas-Ft Worth'],
    ['LHR (London)', '79.2M', 'Heathrow'],
    ['IST (Istanbul)', '76.2M', 'Istanbul Int\'l'],
    ['ICN (Seoul)', '72.8M', 'Incheon Int\'l'],
    ['HND (Tokyo)', '70.5M', 'Haneda'],
    ['DEN (Denver)', '69.3M', 'Denver Int\'l'],
  ];

  const APIs = [
    { name: 'FlightRadar24', desc: '실시간 항공편 추적', url: 'flightradar24.com', badge: 'PAID' },
    { name: 'AirLabs', desc: '항공편 데이터 API', url: 'airlabs.co', badge: 'PAID' },
    { name: 'Aviation Stack', desc: '항공 정보 API', url: 'aviationstack.com', badge: 'PAID' },
    { name: 'OurAirports', desc: '공항 데이터베이스', url: 'ourairports.com', badge: 'FREE' },
  ];

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {stats.map((s, i) => (
          <Card key={i} {...s} />
        ))}
      </div>

      <SectionCard title="공항 승객량 순위" icon="🛬" api lastUpdated={flightsUpdated} onRefresh={fetchFlights}>
        <DataTable
          headers={['공항', '연간 승객', '위치']}
          rows={airports}
        />
      </SectionCard>

      <h2 style={{ color: theme.text, marginBottom: '16px', fontSize: '18px' }}>항공 데이터 소스</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {APIs.map((api, i) => (
          <div
            key={i}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <h3 style={{ margin: 0, color: theme.text, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              {api.name}
            </h3>
            <p style={{ margin: '0 0 8px 0', color: theme.muted, fontSize: '12px' }}>{api.desc}</p>
            <span
              style={{
                background: api.badge === 'FREE' ? '#10b981' : '#f97316',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              {api.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Energy = () => {
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const refreshEnergy = () => setLastUpdated(new Date());

  const energyMix = [
    { name: 'Oil', pct: 31, color: '#424242' },
    { name: 'Coal', pct: 26, color: '#795548' },
    { name: 'Gas', pct: 23, color: '#FF8F00' },
    { name: 'Hydro', pct: 7, color: '#1565C0' },
    { name: 'Nuclear', pct: 4, color: '#7B1FA2' },
    { name: 'Wind', pct: 4, color: '#00897B' },
    { name: 'Solar', pct: 3, color: '#FDD835' },
    { name: 'Other', pct: 2, color: '#9E9E9E' },
  ];

  const renewable = [
    { name: 'Iceland', pct: 99.9 },
    { name: 'Norway', pct: 98.4 },
    { name: 'Brazil', pct: 84.2 },
    { name: 'New Zealand', pct: 82.1 },
    { name: 'Denmark', pct: 80.5 },
    { name: 'Uruguay', pct: 78.3 },
    { name: 'Austria', pct: 77.2 },
    { name: 'Kenya', pct: 73.1 },
  ];

  const maxRen = 100;

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="글로벌 에너지 구성" icon="⚡" lastUpdated={lastUpdated} onRefresh={refreshEnergy}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', height: '30px', borderRadius: '6px', overflow: 'hidden' }}>
            {energyMix.map((e) => (
              <div
                key={e.name}
                style={{
                  flex: e.pct,
                  background: e.color,
                  position: 'relative',
                }}
                title={`${e.name} ${e.pct}%`}
              ></div>
            ))}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            {energyMix.map((e) => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    background: e.color,
                    borderRadius: '2px',
                  }}
                ></div>
                <span style={{ color: theme.muted, fontSize: '12px' }}>
                  {e.name} {e.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="재생 에너지 선도국" icon="🌿">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {renewable.map((r, i) => {
            const width = (r.pct / maxRen) * 100;
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: theme.text, fontSize: '12px' }}>{r.name}</span>
                  <span style={{ color: theme.muted, fontSize: '12px' }}>{r.pct}%</span>
                </div>
                <div
                  style={{
                    background: theme.bg,
                    height: '20px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(90deg, #059669, #10b981)`,
                      height: '100%',
                      width: width + '%',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

const Space = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apodUpdated, setApodUpdated] = useState(null);
  const [iss, setIss] = useState(null);

  const fetchAPOD = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
      const data = await res.json();
      setApod(data);
      setApodUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchISS = async () => {
    try {
      const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const data = await res.json();
      setIss(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAPOD();
    const apodInterval = setInterval(fetchAPOD, 24 * 60 * 60 * 1000);
    return () => clearInterval(apodInterval);
  }, []);

  useEffect(() => {
    fetchISS();
    const issInterval = setInterval(fetchISS, 15 * 1000);
    return () => clearInterval(issInterval);
  }, []);

  const APIs = [
    { name: 'NASA API', desc: 'APOD, Imagery, Insight', url: 'api.nasa.gov', badge: 'FREE' },
    { name: 'SpaceX API', desc: 'rockets, launches', url: 'api.spacexdata.com', badge: 'FREE' },
    { name: 'Open Notify', desc: 'ISS location', url: 'open-notify.org', badge: 'FREE' },
    { name: 'AstroAPI', desc: 'Astronomical data', url: 'astroapi.com', badge: 'PAID' },
    { name: 'Space-Track', desc: 'Satellite data', url: 'space-track.org', badge: 'PAID' },
    { name: 'NORAD', desc: 'Satellite tracking', url: 'celestrak.com', badge: 'FREE' },
  ];

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="ISS 실시간 위치" icon="🛸" api lastUpdated={iss ? new Date() : null} onRefresh={fetchISS}>
        {iss ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {[
              { label: '위도', value: iss.latitude?.toFixed(4) + '°' },
              { label: '경도', value: iss.longitude?.toFixed(4) + '°' },
              { label: '고도', value: Math.round(iss.altitude) + ' km' },
              { label: '속도', value: Math.round(iss.velocity) + ' km/h' },
            ].map((item) => (
              <div key={item.label} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '6px' }}>{item.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.accent }}>{item.value}</div>
              </div>
            ))}
          </div>
        ) : <Loader />}
      </SectionCard>

      <SectionCard title="Astronomy Picture of the Day" icon="🛰️" api lastUpdated={apodUpdated} onRefresh={fetchAPOD}>
        {loading ? (
          <Loader />
        ) : apod ? (
          <div>
            {apod.url && (
              <img
                src={apod.url}
                alt={apod.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              />
            )}
            <h2 style={{ margin: '0 0 8px 0', color: theme.text, fontSize: '16px', fontWeight: 'bold' }}>
              {apod.title}
            </h2>
            <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '12px' }}>
              📅 {new Date(apod.date).toLocaleDateString('ko-KR')}
            </div>
            <div
              style={{
                maxHeight: '120px',
                overflowY: 'auto',
                color: theme.text,
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {apod.explanation}
            </div>
          </div>
        ) : (
          <div style={{ color: theme.muted, textAlign: 'center', padding: '20px' }}>데이터를 불러올 수 없습니다.</div>
        )}
      </SectionCard>

      <h2 style={{ color: theme.text, marginBottom: '16px', fontSize: '18px' }}>우주 데이터 소스</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {APIs.map((api, i) => (
          <div
            key={i}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <h3 style={{ margin: 0, color: theme.text, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              {api.name}
            </h3>
            <p style={{ margin: '0 0 8px 0', color: theme.muted, fontSize: '12px' }}>{api.desc}</p>
            <span
              style={{
                background: api.badge === 'FREE' ? '#10b981' : '#f97316',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              {api.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Health = () => {
  const [lifeExp, setLifeExp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://api.worldbank.org/v2/country/JPN;CHE;KOR;SGP;ESP;AUS;ITA;SWE;FRA;DEU/indicator/SP.DYN.LE00.IN?format=json&date=2022&per_page=20'
      );
      const data = await res.json();
      if (data[1]) {
        const sorted = data[1]
          .filter((d) => d.value)
          .sort((a, b) => b.value - a.value)
          .map((d) => ({ name: d.country?.value, val: d.value }));
        setLifeExp(sorted);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const maxVal = 90;

  const sources = [
    { name: 'WHO', desc: '세계보건기구 데이터', url: 'who.int', badge: 'FREE' },
    { name: 'Our World in Data', desc: '보건 통계', url: 'ourworldindata.org', badge: 'FREE' },
    { name: 'World Bank Health', desc: '보건 지표', url: 'worldbank.org', badge: 'FREE' },
    { name: 'CDC', desc: '미국 질병관리청', url: 'cdc.gov', badge: 'FREE' },
  ];

  return (
    <div style={{ fontFamily: 'JetBrains Mono' }}>
      <SectionCard title="국가별 평균 기대수명" icon="🏥" api lastUpdated={lastUpdated} onRefresh={fetchHealth}>
        {loading ? <Loader /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {lifeExp.map((l, i) => {
            const width = ((l.val - 70) / 20) * 100;
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: theme.text, fontSize: '12px' }}>{l.name}</span>
                  <span style={{ color: theme.muted, fontSize: '12px' }}>{l.val} years</span>
                </div>
                <div
                  style={{
                    background: theme.bg,
                    height: '20px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(90deg, #ec4899, #f472b6)`,
                      height: '100%',
                      width: width + '%',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </SectionCard>

      <h2 style={{ color: theme.text, marginBottom: '16px', fontSize: '18px' }}>보건 데이터 소스</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {sources.map((api, i) => (
          <div
            key={i}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <h3 style={{ margin: 0, color: theme.text, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              {api.name}
            </h3>
            <p style={{ margin: '0 0 8px 0', color: theme.muted, fontSize: '12px' }}>{api.desc}</p>
            <span
              style={{
                background: api.badge === 'FREE' ? '#10b981' : '#f97316',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              {api.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateTime, setDateTime] = useState(new Date());
  const isMobile = useWindowWidth() < 768;

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'overview', name: '오버뷰', icon: '🌍', component: Overview },
    { id: 'economy', name: '경제', icon: '💹', component: Economy },
    { id: 'earthquake', name: '지진', icon: '🌋', component: Earthquake },
    { id: 'population', name: '인구', icon: '👥', component: Population },
    { id: 'climate', name: '기후', icon: '🌡️', component: Climate },
    { id: 'trade', name: '무역/물류', icon: '🚢', component: Trade },
    { id: 'aviation', name: '항공', icon: '✈️', component: Aviation },
    { id: 'energy', name: '에너지', icon: '⚡', component: Energy },
    { id: 'space', name: '우주', icon: '🛰️', component: Space },
    { id: 'health', name: '보건', icon: '🏥', component: Health },
  ];

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  if (isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          background: theme.bg,
          color: theme.text,
          fontFamily: 'JetBrains Mono',
        }}
      >
        {/* Mobile Header */}
        <div
          style={{
            background: theme.card,
            borderBottom: `1px solid ${theme.border}`,
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{activeTabData?.icon}</span>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{activeTabData?.name}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: theme.muted }}>
              {dateTime.toLocaleTimeString('ko-KR')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: theme.bg, padding: '4px 8px', borderRadius: '6px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981' }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {ActiveComponent && <ActiveComponent />}
        </div>

        {/* Bottom Tab Bar */}
        <div
          style={{
            background: theme.card,
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: '0 0 auto',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderTop: `3px solid ${activeTab === tab.id ? theme.accent : 'transparent'}`,
                color: activeTab === tab.id ? theme.accent : theme.muted,
                cursor: 'pointer',
                fontSize: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                fontFamily: 'JetBrains Mono',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: theme.bg,
        color: theme.text,
        fontFamily: 'JetBrains Mono',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: collapsed ? '60px' : '240px',
          background: theme.card,
          borderRight: `1px solid ${theme.border}`,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          {collapsed ? '→' : '←'}
        </button>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '12px 8px',
                marginBottom: '8px',
                background: activeTab === tab.id ? theme.accent : 'transparent',
                border: `1px solid ${activeTab === tab.id ? theme.accent : theme.border}`,
                color: activeTab === tab.id ? '#ffffff' : theme.text,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'JetBrains Mono',
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {!collapsed && tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div
          style={{
            background: theme.card,
            borderBottom: `1px solid ${theme.border}`,
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{activeTabData?.icon}</span>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              {activeTabData?.name}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: theme.muted }}>
              {dateTime.toLocaleDateString('ko-KR')} {dateTime.toLocaleTimeString('ko-KR')}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: theme.bg,
                padding: '6px 10px',
                borderRadius: '6px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                }}
              ></span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981' }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
