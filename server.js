const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const dotenv = require('dotenv');                       // Sets up all dependencies

dotenv.config({ path: './.env'});                       // Sets path of environment variables

const users = [];

const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    (email) => users.find(user => user.email === email),
    (id) => users.find(user => user.id === id)
    );


app.set('view-engine', 'ejs');                      // Bunch of settings for express js
app.use(express.urlencoded({extended: false})); // Use JSON for url parsing
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req,res) => {
    res.render('index.ejs', {name: req.user.name});
})

app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs', {message: ''});
})

app.post('/register', checkNotAuthenticated, async (req,res) => {
    try
    {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(), 
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login');
    }
    catch
    {
        res.redirect('/register', {message: ''});
    }
    console.log(users);
})

app.delete('/logout', (req,res) =>{
    req.logout((err) => {
        if (err)
        {
            return next(err);
        }
    })
    res.redirect('/login');
});

app.get('/verifier', (req,res) => {
    if (req.isAuthenticated())
    {
        return res.render('profile.ejs', {name: req.user.name});
    }
    res.render('notloggedin.ejs');
})

function checkAuthenticated(req, res, next)
{
    if (req.isAuthenticated())
    {
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next)
{
    if (req.isAuthenticated())
    {
        return res.redirect('/');
    }

    next();
}



app.listen(3000);

