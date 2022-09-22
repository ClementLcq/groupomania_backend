const mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const limiter = require('./middleware/rateLimiter.middleware');

// Utilisation dotenv
const dotenv = require('dotenv');
dotenv.config();
const MONGOLAB_USERNAME = process.env.MONGOLAB_USERNAME;
const MONGOLAB_PASSWORD = process.env.MONGOLAB_PASSWORD;
const MONGOLAB_URL = process.env.MONGOLAB_URL;

//Installation sécurité
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth.routes');
const postsRouter = require('./routes/posts.routes');
const { requireAuth } = require('./middleware/auth.middleware');

var app = express();
app.use(helmet());
app.use(mongoSanitize());

// Connection MongoDB
mongoose.connect(`mongodb+srv://${MONGOLAB_USERNAME}:${MONGOLAB_PASSWORD}@${MONGOLAB_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

app.use('/api/posts', postsRouter);
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));

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

module.exports = app;
