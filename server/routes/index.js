var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Contact = require('../model/contact');

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sortify' });
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Sortify' });
});
/* GET About page. */
router.get('/aboutus', function(req, res, next) {
  res.render('index', { title: 'About Us' });
});
/* GET service page. */
router.get('/service', function(req, res, next) {
  res.render('index', { title: 'Service' });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* GET Contact Us Page */
router.get('/contactus', function(req, res, next) {
  res.render('index', { title: 'Contact Us' });
});
  

module.exports = router;
