import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels); // Register the plugin

// Utility function to format numbers with the euro sign at the end
const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal', // Use decimal format for number
  }).format(value) + ' €'; // Append euro sign
};

const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Blocked Stock Value',
        data: data.map(item => item.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // Red
          'rgba(54, 162, 235, 0.6)',  // Blue
          'rgba(255, 206, 86, 0.6)',   // Yellow
          'rgba(75, 192, 192, 0.6)',   // Teal
          'rgba(255, 159, 64, 0.6)',   // Orange
          'rgba(255, 99, 71, 0.6)',    // Tomato
          'rgba(75, 192, 192, 0.6)',   // Light Teal
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    layout: {
      padding: {
        top: 20, // Add padding to give space for the labels at the top
      },
    },
    plugins: {
      legend: {
        display: false, // Disable the legend display
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw; // Get the raw value
            return [`Blocked Stock Value: ${formatNumber(value)}`]; // Format the tooltip value
          },
        },
      },
      // Configure the data labels plugin
      datalabels: {
        anchor: 'end',       // Position the label at the end of the bar
        align: 'top',        // Align the label to the top
        offset: 10,          // Offset the label a bit to prevent clipping
        clip: false,         // Allow the label to be displayed outside the chart
        formatter: (value) => formatNumber(value), // Format the data label
        color: 'black',      // Set label color
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(Math.max(...data.map(item => item.value)) * 1.2), // Add some buffer space above the max value
        ticks: {
          stepSize: 500, // Adjust this to control the y-axis interval
          precision : 0,    
          callback: (value) => formatNumber(value), // Format y-axis values with euro symbol
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
