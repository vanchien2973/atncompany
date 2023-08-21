var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var connectFlash = require('connect-flash')
var passport = require('passport')
var roles = require('./utils/roles')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin')
var productRouter = require('./routes/products')

var app = express();

// Body-parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// Mongoose
var mongoose = require("mongoose");
var uri = "mongodb+srv://vanchien2973:Vanchien2907@cluster0.nm8ocih.mongodb.net/ecommerce";
mongoose.connect(uri)
.then(() => console.log ("Connect to DB succeed !"))
.catch((err) => console.log (err));

// Date Format
var hbs = require('hbs');
hbs.registerHelper('dateFormat', require('handlebars-dateformat')); 

// Khởi tạo phiên (session) trong ứng dụng
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}))

// Khởi tạo Passport
app.use(passport.initialize())

// Sử dụng việc quản lý phiên của Passport
app.use(passport.session())
require('./utils/passport')

// Middleware res.locals.user
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// Sử dụng connect-flash và middleware res.locals.messages
app.use(connectFlash())
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', ensureAuthenticated, usersRouter);
app.use('/auth', authRouter);
app.use('/admin', ensureAdmin(), adminRouter);
app.use('/products', ensureAdmin(), productRouter);

// Xac thuc admin
function ensureAdmin() {
  return (req, res, next) => {
    if (req.user.role === roles.admin) {
      next();
    } else {
      req.flash('error', 'You are not authorized to access this route!');
      res.redirect('/');
    }
  };
}

// Xac thuc login
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    next()
  } else {
    res.redirect('/auth/login')
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Port to use on Render
var port = process.env.PORT || 3001;
app.listen (port);

module.exports = app;

