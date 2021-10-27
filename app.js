if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log(process.env.SECRET);
console.log(process.env.API_KEY);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const Review = require('./models/review');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const { nextTick } = require('process');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//Routes
const users = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose
  .connect('mongodb://localhost:27017/yelp-camp', {
    useNewURLParser: true,
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log('Mongo connection error');
    console.log(err);
  });

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisisagoodsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', users);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// primeira rota para home
app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something wrong';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Serving on 3000');
});
