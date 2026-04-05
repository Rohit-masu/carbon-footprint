import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Indian household carbon data (metric tons CO₂/year)
// Sources: TERI 2022, CSE India, MoEFCC
// Low  = 1-2 member household, minimal AC, shared transport
// Med  = 3-4 member urban household, 1 car, AC
// High = 4-5 member affluent urban, multiple cars, heavy AC, frequent flights
// const LABELS = ['Low-Income Household\n(<₹3L/yr)', 'Middle-Class Household\n(₹3–15L/yr)', 'High-Income Household\n(>₹15L/yr)'];
const VALUES = [1.2, 4.8, 14.5]; // metric tons CO₂/year

const data = {
  labels: ['Low-Income\n(<₹3L/yr)', 'Middle-Class\n(₹3–15L/yr)', 'High-Income\n(>₹15L/yr)'],
  datasets: [{
    label: 'Annual CO₂ (Metric Tons)',
    data: VALUES,
    backgroundColor: ['rgba(162,213,159,1)', 'rgba(98,187,160,1)', 'rgba(72,139,118,1)'],
    borderColor: ['rgba(36,59,74,1)', 'rgba(36,59,74,1)', 'rgba(36,59,74,1)'],
    borderWidth: 1,
    hoverBackgroundColor: ['rgba(162,213,159,0.4)', 'rgba(98,187,160,0.4)', 'rgba(72,139,118,0.4)'],
  }],
};

const MeanHousehold = () => (
  <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
    <Bar data={data} height="400px" options={{
      maintainAspectRatio: false, responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} MT CO₂/year` } },
      },
      scales: {
        y: { title: { display: true, text: 'Metric Tons CO₂ / Year' } }
      },
    }} />
    <p style={{ fontSize: '0.7rem', color: '#888', textAlign: 'right', marginTop: 4 }}>
      Source: TERI 2022, CSE India · Indian Household Averages
    </p>
  </div>
);

export default MeanHousehold;
