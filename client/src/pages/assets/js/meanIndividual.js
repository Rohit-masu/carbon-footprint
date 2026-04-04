import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Indian individual average carbon breakdown (% of ~1.9 tCO₂/capita/year)
// Sources: MoEFCC India 2022, TERI, IEA
// Transport: 28% (2-wheeler + bus dominant)
// Home electricity: 22% (India grid coal-heavy)
// Cooking (LPG/biomass): 20%
// Food (rice, dairy): 18%
// Goods & Services: 12%
const data = {
  labels: ['Transportation', 'Home Electricity', 'Cooking Fuel', 'Food & Diet', 'Goods & Services'],
  datasets: [{
    label: '% of Carbon Footprint',
    data: [28, 22, 20, 18, 12],
    backgroundColor: [
      'rgba(162,213,159,1)',
      'rgba(98,187,160,1)',
      'rgba(72,139,118,1)',
      'rgba(27,80,109,1)',
      'rgba(44,130,179,1)',
    ],
    borderColor: Array(5).fill('rgba(36,59,74,1)'),
    borderWidth: 1,
  }],
};

const MeanIndividual = () => (
  <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
    <Doughnut data={data} height="400px" options={{
      maintainAspectRatio: false, responsive: true,
      plugins: {
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } },
        legend: { position: 'right' },
      },
    }} />
    <p style={{ fontSize: '0.7rem', color: '#888', textAlign: 'right', marginTop: 4 }}>
      Source: MoEFCC 2022, TERI, IEA · Average Indian Adult (~1.9 tCO₂/year)
    </p>
  </div>
);

export default MeanIndividual;
