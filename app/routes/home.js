var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {
        home: true,
        controller: "home",
        title: 'FPV Rates - All your rates in one place'
    });
});

module.exports = router;
