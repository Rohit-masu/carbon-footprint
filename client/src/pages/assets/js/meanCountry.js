import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const data = {
  labels: [
    'India (Overall)',
    'Uttar Pradesh',
    'Maharashtra',
    'West Bengal',
    'Tamil Nadu',
    'Gujarat',
    'Rajasthan',
    'Karnataka',
    'Madhya Pradesh',
    'Bihar',
    'Andhra Pradesh',
    'Punjab',
    'Delhi',
  ],
  datasets: [
    {
      label: 'Carbon Emissions (Metric Tons per Capita)',
      data: [
        1.9,  // India overall
        1.5,  // Uttar Pradesh
        2.3,  // Maharashtra
        1.8,  // West Bengal
        2.1,  // Tamil Nadu
        2.5,  // Gujarat
        1.7,  // Rajasthan
        2.0,  // Karnataka
        1.6,  // Madhya Pradesh
        1.2,  // Bihar
        1.9,  // Andhra Pradesh
        2.2,  // Punjab
        3.5,  // Delhi (higher due to urban activity)
      ],
      backgroundColor: [
        'rgba(162, 213, 159, 1)',
        'rgba(98, 187, 160, 1)',
        'rgba(72, 139, 118, 1)',
        'rgba(27, 80, 109, 1)',
        'rgba(44, 130, 179, 1)',
        'rgba(155, 209, 229, 1)',
        'rgba(164, 66, 141, 1)',
        'rgba(255, 178, 102, 1)',
        'rgba(179, 102, 255, 1)',
        'rgba(255, 102, 153, 1)',
        'rgba(102, 204, 255, 1)',
        'rgba(255, 255, 102, 1)',
        'rgba(102, 255, 178, 1)',
      ],
      borderColor: Array(13).fill('rgba(36, 59, 74, 1)'),
      borderWidth: 1,
      hoverBackgroundColor: [
        'rgba(162, 213, 159, 0.4)',
        'rgba(98, 187, 160, 0.4)',
        'rgba(72, 139, 118, 0.4)',
        'rgba(27, 80, 109, 0.4)',
        'rgba(44, 130, 179, 0.4)',
        'rgba(155, 209, 229, 0.4)',
        'rgba(164, 66, 141, 0.4)',
        'rgba(255, 178, 102, 0.4)',
        'rgba(179, 102, 255, 0.4)',
        'rgba(255, 102, 153, 0.4)',
        'rgba(102, 204, 255, 0.4)',
        'rgba(255, 255, 102, 0.4)',
        'rgba(102, 255, 178, 0.4)',
      ],
    },
  ],
};


const MeanCountry = () => {
  return (
    <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
      <Bar
        data={data}
        height={'400px'}
        options={{
          maintainAspectRatio: false,
          resizeDelay: 0,
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }}
      ></Bar>
    </div>
  );
};

export default MeanCountry;
