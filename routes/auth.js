var express = require('express');
var UserModel = require('../models/UserModel');
var { body, validationResult } = require('express-validator');
var passport = require('passport');
var router = express.Router();

router.get('/login', ensureNotAuthenticated, async (req, res, next) => {
    res.render('login');
});

router.get('/register', ensureNotAuthenticated, async (req, res, next) => {
    res.render('register')
});

router.post('/login', ensureNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}), async (req, res) => {
    try {
        // Sau khi xác thực thành công, truy vấn thông tin người dùng từ cơ sở dữ liệu
        var user = await UserModel.findById(req.user.id);
        // Gắn thông tin role vào req.user
        req.user.role = user.role;
        res.redirect('/');
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/auth/login');
    }
});

router.post('/register', ensureNotAuthenticated, [
    body('email').trim().isEmail().withMessage('Email must be a valid email!').normalizeEmail().toLowerCase(),
    body('password').trim().isLength(8).withMessage('Password length sort, min 8 char required!'),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password do not match!')
        }
        return true
    })
], async (req, res, next) => {
    try {
        var errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('register', {
                email: req.body.email,
                messages: req.flash()
            })
        }
        var email = req.body;
        var doesExist = await UserModel.findOne(email);
        if (doesExist) {
            return res.render('register', { error: 'Account already exists!' });
        }
        await UserModel.create(req.body);
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
    }
});

router.get('/logout', ensureAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Xac thuc login
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}


function ensureNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        next()
    }
}

module.exports = router;
