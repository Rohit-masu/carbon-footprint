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
    'United States',
    'China',
    'Germany',
    'Japan',
    'Russia',
    'Continent of Africa',
    'Continent of South America',
    'India',
  ],
  datasets: [
    {
      label: 'Carbon Emissions in Metric Tons',
      data: [
        7712770573,  // USA
        10667887453, // China
        644310352,   // Germany
        1030775384,  // Japan
        1577136041,  // Russia
        1326043539,  // Africa
        994160327,   // South America
        2630946300,  // India (approx. 2.63B metric tons)
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
      ],
      borderColor: Array(8).fill('rgba(36, 59, 74, 1)'),
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
      ],
    },
  ],
};

const MeanCountryAnnual = () => {
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

export default MeanCountryAnnual;
