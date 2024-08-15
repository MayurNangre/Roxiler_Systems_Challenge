import React from 'react';
import './TransactionsTable.css'; // Import the CSS file for styling


const Statistics = ({ statistics }) => {
    return (
        <div className="statistics-container">
            <h2>Statistics</h2>
            <div className="statistics-box">
                <div className="statistics-item">
                    <h3>Total Sales</h3>
                    <p>${statistics.totalSales?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="statistics-item">
                    <h3>Total Sold Items</h3>
                    <p>{statistics.totalSoldItems || '0'}</p>
                </div>
                <div className="statistics-item">
                    <h3>Total Not Sold Items</h3>
                    <p>{statistics.totalNotSoldItems || '0'}</p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
