const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    number: String,
    customer_id: String,
})

module.exports = mongoose.model('Order', orderSchema);