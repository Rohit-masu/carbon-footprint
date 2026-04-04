import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WB_COUNTRIES = [
  { code: 'US', label: 'United States' },
  { code: 'CN', label: 'China' },
  { code: 'IN', label: 'India' },
  { code: 'RU', label: 'Russia' },
  { code: 'JP', label: 'Japan' },
  { code: 'DE', label: 'Germany' },
  { code: 'BR', label: 'Brazil' },
  { code: 'ZA', label: 'South Africa' },
];

const COLORS = [
  'rgba(162,213,159,1)','rgba(98,187,160,1)','rgba(255,178,102,1)',
  'rgba(44,130,179,1)','rgba(72,139,118,1)','rgba(155,209,229,1)',
  'rgba(164,66,141,1)','rgba(179,102,255,1)',
];

const MeanCountryAnnual = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEmissions = async () => {
      try {
        const codes = WB_COUNTRIES.map(c => c.code).join(';');
        // ✅ CORRECT: source=75 as query parameter, not in path
        const url = `https://api.worldbank.org/v2/country/${codes}/indicator/EN.ATM.CO2E.PC?format=json&source=75&mrv=1&per_page=100`;
        
        // console.log('Fetching from:', url);
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const json = await res.json();
        // console.log('API Response:', json);
        
        // Check for API error message
        if (json[0] && json[0].message) {
          console.error('API Error:', json[0].message);
          setError(true);
          setLoading(false);
          return;
        }
        
        // json[0] = metadata, json[1] = array of results
        const results = json[1] || [];
        
        if (results.length === 0) {
          console.error('No data returned');
          setError(true);
          setLoading(false);
          return;
        }

        const valueMap = {};
        const yearMap = {};
        
        results.forEach(r => {
          if (r.value !== null) {
            valueMap[r.countryiso3code] = parseFloat(r.value);
            yearMap[r.countryiso3code] = r.date;
          }
        });

        const labels = [];
        const values = [];
        const years = [];
        
        const iso3Map = {
          'US': 'USA', 'CN': 'CHN', 'IN': 'IND', 
          'RU': 'RUS', 'JP': 'JPN', 'DE': 'DEU', 
          'BR': 'BRA', 'ZA': 'ZAF'
        };
        
        WB_COUNTRIES.forEach(({ code, label }) => {
          const iso3 = iso3Map[code];
          
          if (valueMap[iso3] !== undefined) {
            labels.push(label);
            values.push(Math.round(valueMap[iso3])); // Per capita, no multiplication
            years.push(yearMap[iso3]);
          }
        });

        if (labels.length === 0) {
          setError(true);
        } else {
          setChartData({ labels, values, years });
        }
      } catch (e) {
        console.error('World Bank fetch failed:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmissions();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>🌍 Loading live emissions data...</p>;
  if (error || !chartData) return <p style={{ textAlign: 'center', color: 'red', padding: '20px' }}>❌ Failed to load data. Please try again later.</p>;

  const data = {
    labels: chartData.labels,
    datasets: [{
      label: 'Annual CO₂ Emissions Per Capita (Metric Tons/Person)',
      data: chartData.values,
      backgroundColor: COLORS.slice(0, chartData.labels.length),
      borderColor: Array(chartData.labels.length).fill('rgba(36,59,74,0.8)'),
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: { font: { size: 12 } }
      },
      tooltip: { 
        callbacks: { 
          label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} MT CO₂ per person (${chartData.years[ctx.dataIndex]})` 
        } 
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'CO₂ Emissions (Metric Tons per Person)',
          font: { weight: 'bold' }
        },
        ticks: {
          callback: (value) => value.toLocaleString()
        }
      },
      x: {
        title: {
          display: true,
          text: 'Country',
          font: { weight: 'bold' }
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '50vh', width: '100%', minWidth: '600px' }}>
      <Bar data={data} options={options} />
      <a href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions">
      <p style={{ fontSize: '0.7rem', color: '#888', textAlign: 'right', marginTop: 2 }}>
        Source: World Bank (Source 75) · CO₂ emissions per capita · Data year: {chartData.years[0] || 'latest available'}
      </p>
      </a>
    </div>
  );
};

export default MeanCountryAnnual;