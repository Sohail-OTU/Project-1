const express =  require ('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user');

const router = express.Router();

//GET route for displaying the Login Page
router.get('/login', (req, res, next) => {
    console.log('GET Login works');
    res.render('login', { title: 'Login Page' });
});

//POST route for processing the Login Page
router.post('/login', async(req,res,next)=>{
    try {
        const {email, password, username} = req.body;

        console.log('Login attempt:', email);

        const user = await User.findOne({email});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.error('Login Failed: User not found');
            return res.render('login', {
                title: 'Login Here',
                errorMessage: 'Invalid Email or Password. Try Again.'
            });
        };

        console.log('User Found:', user.email);

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.error('Login failed: Incorrect password');
            return res.render('login', {
                title: 'Login',
                errorMessage: 'Invalid email or password.',
            });
        };

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true});
        console.log('User logged in successfully:', email);
        res.redirect('../views/task_choice')
    }
    catch(err) {
        console.error(err);
        res.render('login', {
            title: 'Login Here',
            errorMessage: 'Login Failed. Please try again.'
        })
    }
});


//GET route for displaying Register Page
router.get('/register', (req, res, next) => {
    console.log('GET Register Works');
    res.render('register', { title: 'Register Page' });
});


//POST route for processing Register Page
router.post('/register', async(req, res, next)=>{
    try {
        const {email, password} = req.body;
        console.log('Login attempt:', email);

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render('register', {
                title: 'Register Here',
                errorMessage: 'User already exists. Please try again.'
            })
        }
        const user = new User({ email, password });
        await user.save(); 
        console.log('User Registered Successfully:', email);
        res.redirect('/login')
        }
    catch(err) {
        console.error(err);
        res.render('register', {
            title: 'Register Here',
            errorMessage: 'Registration Failed. Please try again.',
    });
}});


//Get route for getting the logout page
router.get('/logout', (req,res,next)=> {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;