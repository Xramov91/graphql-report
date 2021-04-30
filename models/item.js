const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    order_id: String,
    product_id: String,
    quantity: Number,
})

module.exports = mongoose.model('Item', itemSchema);