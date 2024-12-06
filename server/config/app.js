let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
require('dotenv').config();

let app = express();
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let taskRouter = require('../routes/task');
let authRouter = require('../routes/auth')
let checkAuthentication = require('../../middleware/auth')


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
// getting-started.js
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`Connected to MondoDB: ${mongoose.connection.name}`))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit process if connection fails
  });
/* main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/TaskLib');
  //await mongoose.connect('mongodb+srv://ahmedsheikh:Test123@cluster0.0f3pz.mongodb.net/');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

const jwt = require('jsonwebtoken');
//Put token code here:
app.use((req, res, next) => {
  const token = req.cookies.token;


  if (token) {
    try {
      const decoded = jwt.decode(token); // Decode the token without verifying
      res.locals.user = decoded; // Pass decoded user data to views
      res.locals.isAuthenticated = true; // Mark user as authenticated
    } catch (err) {
      console.error('Error decoding token:', err.message);
      res.locals.user = null;
      res.locals.isAuthenticated = false;
    }
  } else {
    res.locals.user = null; // No user logged in
    res.locals.isAuthenticated = false;
  }


  next();
}),


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRouter);
app.use('/tasks', checkAuthentication);
app.use('/tasks',taskRouter);
console.log('Auth routes mounted at root');

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
  res.render('error',{title:'Error'});
});

app.get('/', (req, res) => {
  res.send('Backend is running. Use API endpoints for functionality.');
});

module.exports = app;

