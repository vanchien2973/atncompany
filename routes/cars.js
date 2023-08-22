var express = require('express');
const CarModel = require('../models/CarModel');
var router = express.Router();

router.get('/delete/:id', async (req, res) => {
    var id = req.params.id
    await CarModel.findByIdAndDelete(id)
        .then(() => console.log('Delete succeed'))
        .catch((error) => console.log('Delete failed'))
    res.redirect('/admin/cars')
})

router.get('/add', (req, res) => {
    res.render('admin/cars/add_car')
})

router.post('/add', async (req, res) => {
    var car = req.body
    await CarModel.create(car)
    .then(console.log('Add Successfully!'))
    .catch(err => console.log(err))
    res.redirect('/admin/products')
})

router.get('/edit/:id', async (req, res) => {
    var id = req.params.id
    var car = await CarModel.findById(id)
    res.render('admin/cars/edit_car', { car : car })
})

router.post('/edit/:id', async (req, res) => {
    try {
        await CarModel.findByIdAndUpdate(req.params.id, req.body);
        console.log('Edit Successfully!');
        res.redirect('/admin/cars');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error occurred during update.');
    }
})

router.post('/search', async (req, res) => {
    var searchName = req.body.keyword
    var cars = await CarModel.find({name : new RegExp(searchName, "i")})
    res.render('admin/cars/carList', { cars : cars })
})

router.get('/sort/price/asc', async (req, res) => {
    var cars = await CarModel.find().sort({price: 1})
    res.render('admin/cars/carList', { cars : cars })
})

router.get('/sort/price/desc', async (req, res) => {
    var cars = await CarModel.find().sort({price: -1})
    res.render('admin/cars/carList', { cars : cars })
})

module.exports = router;
