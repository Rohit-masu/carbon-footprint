import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// ✅ FIXED: Use 2-letter ISO codes for World Bank API
const WB_COUNTRIES = [
  { code: 'US', label: 'United States' }, // Was 'USA'
  { code: 'CN', label: 'China' }, // Was 'CHN'
  { code: 'RU', label: 'Russia' }, // Was 'RUS'
  { code: 'DE', label: 'Germany' }, // Was 'DEU'
  { code: 'JP', label: 'Japan' }, // Was 'JPN'
  { code: 'BR', label: 'Brazil' }, // Was 'BRA'
  { code: 'IN', label: 'India' }, // Was 'IND'
  { code: 'BD', label: 'Bangladesh' }, // Was 'BGD'
];

const COLORS = [
  'rgba(162,213,159,1)',
  'rgba(98,187,160,1)',
  'rgba(44,130,179,1)',
  'rgba(72,139,118,1)',
  'rgba(155,209,229,1)',
  'rgba(164,66,141,1)',
  'rgba(255,178,102,1)',
  'rgba(179,102,255,1)',
];

const MeanCountry = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPerCapita = async () => {
      try {
        const codes = WB_COUNTRIES.map((c) => c.code).join(';');
        // ✅ Added source=75 for environmental data
        const url = `https://api.worldbank.org/v2/country/${codes}/indicator/EN.ATM.CO2E.PC?format=json&source=75&mrv=1&per_page=100`;

        // console.log('Fetching Per Capita URL:', url);
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        // console.log('Per Capita API Response:', json);

        // Check for API errors
        if (json[0] && json[0].message) {
          console.error('API Error:', json[0].message);
          setError(true);
          setLoading(false);
          return;
        }

        const results = json[1] || [];

        // Map 2-letter codes to ISO3 codes that API returns
        const iso3Map = {
          US: 'USA',
          CN: 'CHN',
          RU: 'RUS',
          DE: 'DEU',
          JP: 'JPN',
          BR: 'BRA',
          IN: 'IND',
          BD: 'BGD',
        };

        const valueMap = {};
        results.forEach((r) => {
          if (r.value !== null) {
            valueMap[r.countryiso3code] = parseFloat(r.value);
          }
        });

        const labels = [];
        const values = [];
        WB_COUNTRIES.forEach(({ code, label }) => {
          const iso3 = iso3Map[code];
          if (valueMap[iso3] !== undefined) {
            labels.push(label);
            values.push(Number(valueMap[iso3].toFixed(2)));
          }
        });

        if (labels.length === 0) {
          console.error('No data found for countries');
          setError(true);
        } else {
          setChartData({ labels, values });
        }
      } catch (e) {
        console.error('Fetch error:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPerCapita();
  }, []);

  if (loading)
    return (
      <p style={{ textAlign: 'center', padding: '20px' }}>
        🌍 Loading per-capita data…
      </p>
    );
  if (error || !chartData)
    return (
      <p style={{ textAlign: 'center', color: 'red', padding: '20px' }}>
        ❌ Failed to load per capita data. Please try again later.
      </p>
    );

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'CO₂ Per Capita (Metric Tons/Person)',
        data: chartData.values,
        backgroundColor: COLORS.slice(0, chartData.labels.length),
        borderColor: Array(chartData.labels.length).fill('rgba(36,59,74,1)'),
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} metric tons per person`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'CO₂ Emissions (Metric Tons per Person)',
          font: { weight: 'bold' },
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
      x: {
        title: {
          display: true,
          text: 'Country',
          font: { weight: 'bold' },
        },
      },
    },
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '40vh',
        width: '100%',
        minWidth: '500px',
      }}
    >
      <Bar data={data} options={options} />
      <a href="https://ourworldindata.org/energy">
        <p
          style={{
            fontSize: '0.7rem',
            color: '#888',
            textAlign: 'right',
            marginTop: 2,
          }}
        >
          Source: World Bank (EN.ATM.CO2E.PC) · CO₂ per capita · Latest
          available year
        </p>
      </a>
    </div>
  );
};

export default MeanCountry;
