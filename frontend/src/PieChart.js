import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import './TransactionsTable.css'; // Import the CSS file for styling

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item._id),
        datasets: [{
            label: 'Categories',
            data: data.map(item => item.count),
            backgroundColor: [
                '#ff6384',
                '#36a2eb',
                '#cc65fe',
                '#ffce56',
                '#4caf50',
                '#ff5722'
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };

    return (
        <div className="piechart-container">
            <h2>Pie Chart</h2>
            <div className="piechart">
                <Pie data={chartData} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Items by Category',
                        },
                    },
                }} />
            </div>
        </div>
    );
};

export default PieChart;
