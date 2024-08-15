import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Statistics from './Statistics';
import BarChart from './BarChart';
import PieChart from './PieChart';
import './TransactionsTable.css';

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [month, setMonth] = useState('2022-03');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({});
    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/transactions', {
                params: { month, search, page }
            });
            setTransactions(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching transactions');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:5000/statistics', {
                params: { month }
            });
            setStatistics(response.data);
        } catch (err) {
            setError('Error fetching statistics');
        }
    };

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/barchart', {
                params: { month }
            });
            setBarChartData(response.data);
        } catch (err) {
            setError('Error fetching bar chart data');
        }
    };

    const fetchPieChartData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/piechart', {
                params: { month }
            });
            setPieChartData(response.data);
        } catch (err) {
            setError('Error fetching pie chart data');
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchStatistics();
        fetchBarChartData();
        fetchPieChartData();
    }, [search, page, month]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
        setPage(1);
    };

    return (
        <div className="transactions-table-container">
            <div className="filter-container">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search transactions"
                    className="search-input"
                />
                <input
                    type="month"
                    value={month}
                    onChange={handleMonthChange}
                    className="month-input"
                />
            </div>
            {loading ? (
                <p className="loading">Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : transactions.length === 0 ? (
                <p className="no-data">No transactions found</p>
            ) : (
                <>
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Sold</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction._id}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.title}</td>
                                    <td>{transaction.description}</td>
                                    <td>${transaction.price.toFixed(2)}</td>
                                    <td>{transaction.category}</td>
                                    <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                                    <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                    <td>
                                        <img src={transaction.image} alt={transaction.title} className="transaction-image" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="pagination-button">Previous</button>
                        <button onClick={() => setPage(page + 1)} disabled={transactions.length < 10} className="pagination-button">Next</button>
                    </div>
                </>
            )}
            
            <Statistics statistics={statistics} />
            <BarChart data={barChartData} />
            <PieChart data={pieChartData} />
        </div>
    );
};

export default TransactionsTable;
