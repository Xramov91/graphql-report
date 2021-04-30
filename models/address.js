const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    city: String,
    street: String,
    house: Number,
})

module.exports = mongoose.model('Address', addressSchema);