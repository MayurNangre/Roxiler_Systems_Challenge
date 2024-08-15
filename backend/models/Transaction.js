const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

module.exports = mongoose.model('Transaction', transactionSchema);


// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//     id: Number,
//     title: String,
//     price: Number,
//     description: String,
//     category: String,
//     image: String,
//     sold: Boolean,
//     dateOfSale: Date
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction;
