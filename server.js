const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const dotenv = require('dotenv');                       // Sets up all dependencies

dotenv.config({ path: './.env'});                       // Sets path of environment variables

const users = [{id: Date.now().toString(), 
    name: 'a',
    email: 'a',
    password: '$2b$10$XgY79Fj/aju5G1rlfI6.EOkWsmvd3Ci5EE61EPxADkeRiVQQHZarm',
    cart: []}];

const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    (email) => users.find(user => user.email === email),
    (id) => users.find(user => user.id === id)
    );


const products = [];

const createProduct = (name, id, weight, price) => {
    products.push({
        name, id, weight, price
    });
};
createProduct("Apple", 1, 10, 3);
createProduct("Orange", 2, 15, 4);
createProduct("Banana", 3, 30, 8);

app.set('view-engine', 'ejs');                  // Bunch of settings for express js
app.use(express.urlencoded({extended: false})); // Use JSON for url parsing
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, (req,res) => {
    res.render('index.ejs', {name: req.user.name, cart: req.user.cart, products});
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
    res.render('register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req,res) => {
    try
    {
        if (users.find(user => user.email === req.body.email))
        {
            req.flash('error','There is already an account with that email.');
            res.redirect('/register');
        }
        else
        {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            users.push({
                id: Date.now().toString(), 
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                cart: []
            })
            res.redirect('/login');
        }
    }
    catch
    {
        res.redirect('/register');
    }
    console.log(users);
})

app.get('/logout', (req, res) => {
    res.redirect('/');
})
app.post('/logout', checkAuthenticated, (req,res) =>{
    req.logout((err) => {
        if (err)
        {
            return next(err);
        }
    })
    res.redirect('/login');
});

app.get('/cart', checkAuthenticated, (req, res) => {
    let userCart = [];
    for (var i = 0; i < req.user.cart.length; i++)
    {
        let dbProduct = products.find(product => product.id == req.user.cart[i].id);
        userCart.push({name: dbProduct.name, quantity: req.user.cart[i].quantity});
    }
    res.render('cart.ejs', {cart: userCart});
})

app.post('/cart', checkAuthenticated, (req, res) => {
    if (req.body.productid)
    {
        var cartItem = req.user.cart.find(product => product.id === req.body.productid);
        if (cartItem) // Check if the item is already in the user's cart. If so update with the new quantity. If not, add it
        {
            cartItem.quantity = req.body.quantity;
        }
        else
        {
            req.user.cart.push({id: req.body.productid, quantity: req.body.quantity});
        }
    }
    else
    {
        res.redirect('/error');
    }
    console.log(req.user.cart);
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
