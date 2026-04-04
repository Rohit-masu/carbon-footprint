import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

// ─── Indian States with their major city coordinates ─────────────────────────
// Used with OpenWeatherMap Air Pollution API (free, lat/lon based)
const INDIAN_STATES = [
  { state: 'Delhi', city: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { state: 'Maharashtra', city: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { state: 'Karnataka', city: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { state: 'Tamil Nadu', city: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { state: 'West Bengal', city: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { state: 'Uttar Pradesh', city: 'Lucknow', lat: 26.8467, lon: 80.9462 },
  { state: 'Gujarat', city: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { state: 'Rajasthan', city: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { state: 'Madhya Pradesh', city: 'Bhopal', lat: 23.2599, lon: 77.4126 },
  { state: 'Punjab', city: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
  { state: 'Andhra Pradesh', city: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { state: 'Bihar', city: 'Patna', lat: 25.5941, lon: 85.1376 },
  { state: 'Odisha', city: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
  { state: 'Kerala', city: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
  { state: 'Assam', city: 'Guwahati', lat: 26.1445, lon: 91.7362 },
  { state: 'Chhattisgarh', city: 'Raipur', lat: 21.2514, lon: 81.6296 },
];

// OpenWeatherMap AQI scale (1-5)
const AQI_INFO = {
  1: { label: 'Good',      color: '#009966', textColor: '#fff', icon: '🌿', naqi: '0-50',   advice: 'Air quality is satisfactory. Enjoy outdoor activities!' },
  2: { label: 'Fair',      color: '#ffde33', textColor: '#333', icon: '🙂', naqi: '51-100',  advice: 'Acceptable air quality. Sensitive individuals should limit prolonged outdoor exertion.' },
  3: { label: 'Moderate',  color: '#ff9933', textColor: '#fff', icon: '😐', naqi: '101-200', advice: 'Members of sensitive groups may experience health effects. Wear a mask outdoors.' },
  4: { label: 'Poor',      color: '#cc0033', textColor: '#fff', icon: '😷', naqi: '201-300', advice: 'Everyone may begin to experience health effects. Limit outdoor activities.' },
  5: { label: 'Very Poor', color: '#660099', textColor: '#fff', icon: '💀', naqi: '301-500', advice: 'Health alert! Everyone may experience serious health effects. Stay indoors.' },
};

const AQIDashboard = () => {
  const [aqiData, setAqiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [sortBy, setSortBy] = useState('aqi'); // 'aqi' | 'state'

  const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
  console.log("API KEY:", process.env.REACT_APP_OPENWEATHER_KEY);
  const fetchAllAQI = useCallback(async () => {
    if (!API_KEY) {
      setError('OpenWeatherMap API key not set. Add REACT_APP_OPENWEATHER_KEY to your .env');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        INDIAN_STATES.map(async ({ state, city, lat, lon }) => {
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            );
            const json = await res.json();
            const item = json.list?.[0];
            if (!item) return null;
            return {
              state, city, lat, lon,
              aqi: item.main.aqi,
              pm2_5: item.components.pm2_5?.toFixed(1),
              pm10: item.components.pm10?.toFixed(1),
              no2: item.components.no2?.toFixed(1),
              o3: item.components.o3?.toFixed(1),
              co: item.components.co?.toFixed(1),
              so2: item.components.so2?.toFixed(1),
            };
          } catch {
            return null;
          }
        })
      );
      const valid = results.filter(Boolean);
      setAqiData(valid);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch (e) {
      setError('Failed to fetch AQI data. Check your API key and network connection.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    fetchAllAQI();
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchAllAQI, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllAQI]);

  if (!Auth.loggedIn()) {
    return (
      <div className="not-logged-in">
        <h2 className="no-info-title">Log in to see live AQI data for Indian states!</h2>
        <Link to="/login"><button type="submit">Log In</button></Link>
      </div>
    );
  }

  const sorted = [...aqiData].sort((a, b) =>
    sortBy === 'aqi' ? b.aqi - a.aqi : a.state.localeCompare(b.state)
  );

  // Compute summary stats
  const avgAqi = aqiData.length ? (aqiData.reduce((s, d) => s + d.aqi, 0) / aqiData.length).toFixed(1) : '--';
  const worstState = aqiData.reduce((w, d) => (!w || d.aqi > w.aqi ? d : w), null);
  const bestState  = aqiData.reduce((b, d) => (!b || d.aqi < b.aqi ? d : b), null);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
      <h1 style={{ textAlign: 'center', color: '#243b4a' }}>
        🌬️ India AQI Dashboard
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '0.5rem' }}>
        Real-time Air Quality Index for major Indian states · OpenWeatherMap scale (1–5)
      </p>
      {lastUpdated && (
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999' }}>
          Last updated: {lastUpdated} &nbsp;
          <button onClick={fetchAllAQI} disabled={loading}
            style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: 6, cursor: 'pointer', border: '1px solid #ccc' }}>
            🔄 Refresh
          </button>
        </p>
      )}

      {/* ── AQI Legend ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0' }}>
        {Object.entries(AQI_INFO).map(([k, v]) => (
          <span key={k} style={{
            background: v.color, color: v.textColor,
            padding: '3px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500,
          }}>
            {v.icon} {k} — {v.label}
          </span>
        ))}
      </div>

      {/* ── Summary Cards ── */}
      {!loading && aqiData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {[
            { label: '📊 National Average AQI', value: avgAqi, sub: AQI_INFO[Math.round(avgAqi)]?.label },
            { label: '😷 Most Polluted', value: worstState?.state, sub: `AQI ${worstState?.aqi} — ${AQI_INFO[worstState?.aqi]?.label}` },
            { label: '🌿 Cleanest Air', value: bestState?.state, sub: `AQI ${bestState?.aqi} — ${AQI_INFO[bestState?.aqi]?.label}` },
          ].map(card => (
            <div key={card.label} style={{
              background: '#f7f9fc', borderRadius: 12, padding: '1rem',
              textAlign: 'center', border: '1px solid #e0e0e0',
            }}>
              <div style={{ fontSize: '0.8rem', color: '#777' }}>{card.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#243b4a', margin: '4px 0' }}>{card.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>{card.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sort Controls ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '0.85rem', color: '#666', alignSelf: 'center' }}>Sort by:</span>
        {['aqi', 'state'].map(opt => (
          <button key={opt} onClick={() => setSortBy(opt)}
            style={{
              padding: '4px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem',
              background: sortBy === opt ? '#2C82B3' : '#eee',
              color: sortBy === opt ? '#fff' : '#333',
              border: 'none',
            }}>
            {opt === 'aqi' ? '🔴 AQI (worst first)' : '🔤 State Name'}
          </button>
        ))}
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <div style={{ fontSize: '2rem' }}>⏳</div>
          <p>Fetching live AQI from {INDIAN_STATES.length} states…</p>
        </div>
      )}
      {error && (
        <div style={{ background: '#fff3f3', border: '1px solid #fca', borderRadius: 10, padding: '1rem', marginBottom: 16 }}>
          <strong>⚠️ {error}</strong>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
            Add <code>REACT_APP_OPENWEATHER_KEY=your_key</code> to <code>client/.env</code> and restart.
            Get a free key at <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">openweathermap.org/api</a>
          </p>
        </div>
      )}

      {/* ── AQI Grid ── */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {sorted.map(d => {
            const info = AQI_INFO[d.aqi] || AQI_INFO[5];
            const isSelected = selectedState?.state === d.state;
            return (
              <div key={d.state}
                onClick={() => setSelectedState(isSelected ? null : d)}
                style={{
                  background: info.color,
                  color: info.textColor,
                  borderRadius: 14,
                  padding: '1rem 1.2rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 0 3px #243b4a' : '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{d.state}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{d.city}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{d.aqi}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{info.icon} {info.label}</div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isSelected && (
                  <div style={{ marginTop: '0.8rem', borderTop: `1px solid rgba(255,255,255,0.3)`, paddingTop: '0.7rem' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>{info.advice}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: '0.82rem' }}>
                      <span>PM2.5: <strong>{d.pm2_5} μg/m³</strong></span>
                      <span>PM10: <strong>{d.pm10} μg/m³</strong></span>
                      <span>NO₂: <strong>{d.no2} μg/m³</strong></span>
                      <span>O₃: <strong>{d.o3} μg/m³</strong></span>
                      <span>SO₂: <strong>{d.so2} μg/m³</strong></span>
                      <span>CO: <strong>{d.co} μg/m³</strong></span>
                    </div>
                    <p style={{ fontSize: '0.72rem', marginTop: '0.5rem', opacity: 0.8 }}>
                      📍 {d.lat.toFixed(2)}°N, {d.lon.toFixed(2)}°E
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginTop: '2rem' }}>
        Data from OpenWeatherMap Air Pollution API · AQI scale 1 (Good) – 5 (Very Poor) · Auto-refreshes every 10 minutes
      </p>
    </div>
  );
};

export default AQIDashboard;
