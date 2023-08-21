var express = require('express');
const ProductModel = require('../models/ProductModel');
var router = express.Router();

router.get('/delete/:id', async (req, res) => {
    var id = req.params.id
    await ProductModel.findByIdAndDelete(id)
        .then(() => console.log('Delete succeed'))
        .catch((error) => console.log('Delete failed'))
    res.redirect('/admin/products')
})

router.get('/add', (req, res) => {
    res.render('admin/products/add_product')
})

// Middleware to handle favicon requests
router.use('/edit/:id', (req, res, next) => {
    if (req.params.id !== 'favicon.ico') {
        next();
    } else {
        // Handle favicon request or simply ignore it
        // You can send an empty response or a 404 status
        res.status(404).end();
    }
})

router.post('/add', async (req, res) => {
    var product = req.body
    await ProductModel.create(product)
    .then(console.log('Add Successfully!'))
    .catch(err => console.log(err))
    res.redirect('/admin/products')
})

router.get('/edit/:id', async (req, res) => {
    var id = req.params.id
    var product = await ProductModel.findById(id)
    res.render('admin/products/edit_product', { product : product })
})

router.post('/edit/:id', async (req, res) => {
    try {
        await ProductModel.findByIdAndUpdate(req.params.id, req.body);
        console.log('Edit Successfully!');
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error occurred during update.');
    }
})

router.post('/search', async (req, res) => {
    var searchName = req.body.keyword
    var products = await ProductModel.find({name : new RegExp(searchName, "i")})
    res.render('admin/products/productList', { products : products })
})

router.get('/sort/price/asc', async (req, res) => {
    var products = await ProductModel.find().sort({price: 1})
    res.render('admin/products/productList', { products : products })
})

router.get('/sort/price/desc', async (req, res) => {
    var products = await ProductModel.find().sort({price: -1})
    res.render('admin/products/productList', { products : products })
})

module.exports = router;
