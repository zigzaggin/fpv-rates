var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            //TODO: add validation library
            if (username === '' || req.body.email === '' || password === '')
                done(null, false, req.flash('signupMessage', 'You must supply a username, email address and password.'));

            process.nextTick(function () {
                User.findOne({$or: [{'username': username}, {'local.email': req.body.email}]}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'A user already exists with your selected username, or email address, please try again.'));
                    } else {

                        var newUser = new User();

                        newUser.username = username;
                        newUser.local.body = req.params.email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            User.findOne({$or: [{'username': username}, {'local.email': username}]}, function (err, user) {
                if (err)
                    return done(err);

                if (!user || !user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Invalid login, please try again.'));

                return done(null, user);
            });

        }));
};