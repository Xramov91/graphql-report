const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: String,
    category_id: String,
    vendor_id: String,
})

module.exports = mongoose.model('Product', productSchema);