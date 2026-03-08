import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudyChart = ({ plan }) => {
  const totalHours = plan.reduce((acc, curr) => acc + curr.total_hours_allocated, 0);

  const data = {
    labels: plan.map(p => p.subject),
    datasets: [{
      data: plan.map(p => p.total_hours_allocated),
      backgroundColor: [
        '#6366f1', // Indigo
        '#8b5cf6', // Violet
        '#d946ef', // Fuchsia
        '#f43f5e', // Rose
        '#10b981', // Emerald
      ],
      hoverOffset: 15,
      borderWidth: 0,
      weight: 1,
      // This creates the "Rounded" look in modern Chart.js
      borderRadius: 10,
      spacing: 5,
    }],
  };

  const options = {
    cutout: '80%', // Makes the ring thinner and more elegant
    plugins: {
      legend: {
        display: false, // Hide default legend to use our custom UI
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 10,
        displayColors: true,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative flex items-center justify-center" style={{ height: '250px', width: '250px' }}>
      <Doughnut data={data} options={options} />
      
      {/* --- CENTERED TEXT OVERLAY --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-slate-800">{totalHours}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Hrs</span>
      </div>
    </div>
  );
};

export default StudyChart;