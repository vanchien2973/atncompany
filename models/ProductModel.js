var mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    image: String,
    created_at: Date,
    brand: String
});

var ProductModel = mongoose.model('products', ProductSchema, 'products');
module.exports = ProductModel;