const jwt = require('jsonbtoken');
console.log(jwt);

function authenticateToken(req,res,next){
    const token = req.cookies.token;
    if (!token){

        console.error('No Token found. Redirecting to login.');
        return res.redirect('/login');
    }
}