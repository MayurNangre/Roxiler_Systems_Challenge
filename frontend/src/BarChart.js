import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './TransactionsTable.css';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item._id),
        datasets: [{
            label: 'Number of Items',
            data: data.map(item => item.count),
            backgroundColor: '#4caf50',
            borderColor: '#388e3c',
            borderWidth: 1,
        }],
    };

    return (
        <div className="barchart-container">
            <h2>Bar Chart</h2>
            <div className="barchart">
                <Bar data={chartData} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Items by Price Range',
                        },
                    },
                }} />
            </div>
        </div>
    );
};

export default BarChart;
