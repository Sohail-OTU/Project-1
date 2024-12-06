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

/* POST Contact Form*/
router.post('/contactus', async function(req, res, next) {
  const { name, email, message } = req.body;


  console.log('POST /contactus route hit');


  try {
    console.log('Form data received:', { name, email, message });


    let newContact = new Contact({
      "name": name,
      "email": email,
      "message": message,
    });


    console.log('Saving new contact to database...');
    await newContact.save();


    console.log("Contact Form Submission:", {name, email, message});


    res.render('index', {
      title: 'Contact Us',
      successMessage: 'Your message has been sent!',
    });


  } catch(err) {
    console.error('Error saving contact form')
    console.error(err);


    res.render('index', {
      title: 'Contact Us',
      errorMessage: 'Failed to send your message. Please try again.'
    });


  }
});


module.exports = router;
