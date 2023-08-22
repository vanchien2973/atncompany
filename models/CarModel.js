var mongoose = require('mongoose');

var CarSchema = mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    created_at: Date,
    brand: String
});

var CarModel = mongoose.model('cars', CarSchema, 'cars');
module.exports = CarModel;