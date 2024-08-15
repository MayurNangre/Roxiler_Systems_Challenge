const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Transaction = require('./models/Transaction');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/transactions')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Initialize the Database with Transaction Data
app.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;
        await Transaction.insertMany(transactions);
        res.status(200).send('Database initialized with transaction data');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
});

// List All Transactions with Search and Pagination
app.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;

    // Dynamic date range handling
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const filter = {
        dateOfSale: {
            $gte: startDate,
            $lte: endDate
        }
    };

    if (search) {
        filter.$or = [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const transactions = await Transaction.find(filter)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        res.json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
});

// Create API for Statistics
app.get('/statistics', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { 
                $group: { 
                    _id: null, 
                    totalSales: { $sum: "$price" }, 
                    totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } }, 
                    totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } } 
                } 
            }
        ]);

        res.json(totalSales[0] || {});
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
});

// Create API for Bar Chart Data
app.get('/barchart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const barChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { 
                $bucket: { 
                    groupBy: "$price", 
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], 
                    default: "901-above", 
                    output: { count: { $sum: 1 } } 
                } 
            }
        ]);

        res.json(barChartData);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
});

// Create API for Pie Chart Data
app.get('/piechart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { 
                $group: { 
                    _id: "$category", 
                    count: { $sum: 1 } 
                } 
            }
        ]);

        res.json(pieChartData);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
});

// Combine API Responses
app.get('/combined-data', async (req, res) => {
    const { month } = req.query;

    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:${PORT}/transactions?month=${month}`),
            axios.get(`http://localhost:${PORT}/statistics?month=${month}`),
            axios.get(`http://localhost:${PORT}/barchart?month=${month}`),
            axios.get(`http://localhost:${PORT}/piechart?month=${month}`)
        ]);

        res.json({
            transactions: transactions.data,
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
});
