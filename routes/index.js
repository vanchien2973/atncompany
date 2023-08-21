var express = require('express');
const ProductModel = require('../models/ProductModel');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
      var products = await ProductModel.find();
      var limitProducts = products.slice(0, 3);
      res.render('index', { products: limitProducts });
  } catch (error) {
      next(error);
  }
});

router.get('/products', async (req, res) => {
  try {
    var products = await ProductModel.find();
    res.render('user/products', { products : products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/search', async (req, res) => {
  var searchName = req.body.keyword
  var products = await ProductModel.find({name : new RegExp(searchName, "i")})
  res.render('user/products', { products : products })
})

router.get('/detail/:id', async (req, res) => {
  var id = req.params.id
  var product = await ProductModel.findById(id)
  res.render('user/singleproduct', {product : product})
})

router.get('/sort/price/asc', async (req, res) => {
  var products = await ProductModel.find().sort({price: 1})
  res.render('user/products', { products : products })
})

router.get('/sort/price/desc', async (req, res) => {
  var products = await ProductModel.find().sort({price: -1})
  res.render('user/products', { products : products })
})

module.exports = router;
