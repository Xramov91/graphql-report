const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    name: String,
    address_id: String,
})

module.exports = mongoose.model('Customer', customerSchema);