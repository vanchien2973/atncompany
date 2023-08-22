var express = require('express');
var UserModel = require('../models/UserModel'); 
const ProductModel = require('../models/ProductModel');

var router = express.Router();

router.get('/users', async (req, res, next) => {
  try {
    var users = await UserModel.find();
    res.render('admin/manage-users', { users: users })
  } catch (error) {
    next(error)
  }
})

router.get('/products', async (req, res, next) => {
  try {
    var products = await ProductModel.find()
    res.render('admin/products/productList', {products: products})
  } catch (error) {
    next(error)
  }
})

router.get('/cars', async (req, res, next) => {
  try {
    var products = await ProductModel.find()
    res.render('admin/cars/carList', {products: products})
  } catch (error) {
    next(error)
  }
})

router.post('/updaterole', async (req, res, next) => {
  try {
    var id = req.body.id;
    var role = req.body.role;
    await UserModel.findByIdAndUpdate(id, { role: role })
    res.redirect('/admin/users')
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user role.')
  }
})

module.exports = router;
