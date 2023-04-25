const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const dotenv = require('dotenv');                       // Sets up all dependencies
const mysql = require('mysql');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env'});                       // Sets path of environment variables

const connection = mysql.createConnection({
    host: 'cmpe131-group4-baymart.ceuvuwmxdxqi.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'cmpe131_group4_baymart'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
});

const initializePassport = require('./passport-config');
initializePassport(passport, connection);


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
app.use(cookieParser());

app.get('/', checkAuthenticated, (req,res) => {
    if (!req.cookies.cart)
    {
        res.cookie('cart', JSON.stringify([]));
        console.log(req.cookies.cart);
    }
    res.render('index.ejs', {name: req.user.firstname, cart: req.user.cart, products});
})

app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req,res) => {
    connection.query('SELECT * FROM users WHERE email = ?',[req.body.email], function(error, results) {
        if (results.length > 0)
        {
            req.flash('error','There is already an account with that email.');
            res.redirect('/register');
        }
    });

    try
    {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        connection.query("INSERT INTO users (userid, email, password, firstname, lastname, mobilenum) VALUES (?,?,?,?,?,?)",[1, req.body.email, hashedPassword,
        req.body.firstname, req.body.lastname, req.body.mobilenum]);
        res.redirect('/login');
    }
    catch(e)
    {
        console.log(e);
        res.redirect('/register');
    }
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
    res.clearCookie('cart');
    res.redirect('/login');
});

app.get('/cart', checkAuthenticated, (req, res) => {
    let productList = [];
    userCart = JSON.parse(req.cookies.cart);
    for (var i = 0; i < userCart.length; i++)
    {
        let dbProduct = products.find(product => product.id == userCart[i].id);
        productList.push({name: dbProduct.name, quantity: userCart[i].quantity});
    }
    res.render('cart.ejs', {cart: productList});
})

app.post('/cart', checkAuthenticated, (req, res) => {
    if (!req.cookies.cart) res.redirect('/');

    if (req.body.productid)
    {
        userCart = JSON.parse(req.cookies.cart);
        var cartItem = userCart.find(product => product.id === req.body.productid);
        if (cartItem) // Check if the item is already in the user's cart. If so update with the new quantity. If not, add it
        {
            cartItem.quantity = req.body.quantity;
        }
        else
        {
            userCart.push({id: req.body.productid, quantity: req.body.quantity});
            console.log(userCart);
        }
        res.clearCookie('cart');
        res.cookie('cart',JSON.stringify(userCart));
        res.redirect('/');
    }
    else
    {
        res.redirect('/error');
    }
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
