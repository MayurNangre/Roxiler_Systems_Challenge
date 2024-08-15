import React, { useState, useEffect } from 'react';

const TransactionStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSale: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    fetch(`/api/statistics?month=${selectedMonth}`)
      .then(response => response.json())
      .then(data => setStatistics(data));
  }, [selectedMonth]);

  return (
    <div className="statistics-boxes">
      <div className="stat-box">
        <h3>Total Sale Amount</h3>
        <p>${statistics.totalSale}</p>
      </div>
      <div className="stat-box">
        <h3>Total Sold Items</h3>
        <p>{statistics.totalSoldItems}</p>
      </div>
      <div className="stat-box">
        <h3>Total Not Sold Items</h3>
        <p>{statistics.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default TransactionStatistics;
