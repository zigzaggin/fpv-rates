var home = require('./routes/home');
var about = require('./routes/about');
module.exports = function (app, passport) {

    app.use('/', home);
    app.use('/about', about);

    app.get('/login', function (req, res) {
        res.render('login', {message: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/sign-up', function (req, res) {
        res.render('signup', {message: req.flash('signupMessage')});
    });
    app.post('/sign-up', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/sign-up',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {});
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}