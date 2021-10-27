const User = require('../models/user');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.userRegisterForm = (req, res) => {
  res.render('users/register');
};

module.exports.userRegistered = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const regUser = await User.register(user, password);
    req.login(regUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to YelpCamp!');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

module.exports.userLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.userLogged = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
  req.logout();
  req.flash('success', 'You were logged out.');
  res.redirect('/campgrounds');
};
