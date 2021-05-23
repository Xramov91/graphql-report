const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vendorSchema = new Schema({
    name: String,
    country_id: String,
})

module.exports = mongoose.model('Vendor', vendorSchema);