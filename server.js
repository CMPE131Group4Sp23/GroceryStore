const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const dotenv = require('dotenv');                       // Sets up all dependencies
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const emailValidator = require('email-validator');
const { v4: uuidv4} = require('uuid');

dotenv.config({ path: './.env'});                       // Sets path of environment variables

const connection = mysql.createConnection({
    host: 'cmpe131-group4-baymart.ceuvuwmxdxqi.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'cmpe131_group4_baymart'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to Database!');
});

const initializePassport = require('./passport-config');
initializePassport(passport, connection);

app.set('view-engine', 'ejs');                  // Bunch of settings for express js
app.use(express.urlencoded({extended: false})); // Use JSON for url parsing
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.static('styles'));
app.use(express.static('files'));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.get('/', checkAuthenticated, (req,res) => {
    if (!req.cookies.cart)
    {
        res.cookie('cart', JSON.stringify([]));
    }
    let productList = [];
    connection.query('SELECT * FROM Product', function(error, results) {
        if (results)
        {
            for (i = 0; i < results.length; i++)
            {
                if (!productList[Math.floor(i/4)]) productList[Math.floor(i/4)] = [];
                productList[Math.floor(i/4)].push(results[i]);
            }
        }
        res.render('index.ejs', {name: req.user.firstname, cart: req.user.cart, productList});
    });
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
    if (!emailValidator.validate(req.body.email))
    {
        req.flash('error', 'Invalid Email Address');
        res.redirect('/register');
        return;
    }
    req.body.mobilenum = req.body.mobilenum.replace(/-/g,"");

    if (req.body.mobilenum.length != 10)
    {
        req.flash('error', 'Invalid Phone Number');
        res.redirect('/register');
        return;
    }
    connection.query('SELECT * FROM users WHERE email = ?',[req.body.email], function(error, results) {
        if (error) throw error;
        if (results.length > 0)
        {
            req.flash('error','There is already an account with that email.');
            res.redirect('/register');
            return;
        }
    });

    try
    {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        connection.query("INSERT INTO users (userid, email, password, firstname, lastname, mobilenum) VALUES (?,?,?,?,?,?)",[uuidv4(), req.body.email, hashedPassword,
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
    userCart = JSON.parse(req.cookies.cart);
    let query = "SELECT * FROM Product WHERE Product_ID = 0 ";
    for (var i = 0; i < userCart.length; i++)
    {
        query = query + "OR Product_ID = " + connection.escape(userCart[i].id) + " ";
    }

    connection.query(query, function(error, results) {
        let productList = [];
        let totalWeight = 0;
        let totalPrice = 0;
        if (results)
        {
            for (var i = 0; i < results.length; i++)
            {
                cartItem = userCart.find(item => item.id == results[i].Product_ID)
                totalWeight += results[i].Weight * cartItem.quantity;
                totalPrice += results[i].Price * cartItem.quantity;
                productList.push(results[i]);
                productList[productList.length-1].quantity = cartItem.quantity; // Finds the quantity from the user's cart and applies it to the DB item
            }
        }
        if (results.length == 0) req.flash('emptyCart', 'Cart is Empty.');
        if (totalWeight > 20)
        {
            weightFee = 5.00;
        }
        else
        {
            weightFee = 0;
        }
        res.render('cart.ejs', {cart: productList, weight: totalWeight.toFixed(2), price: (totalPrice/100 + weightFee).toFixed(2), editItem: -1, weightFee: weightFee.toFixed(2)});
    });
})

app.post('/cart', checkAuthenticated, (req, res) => {
    userCart = JSON.parse(req.cookies.cart);
    let query = "SELECT * FROM Product WHERE Product_ID = 0 ";
    for (var i = 0; i < userCart.length; i++)
    {
        query = query + "OR Product_ID = " + connection.escape(userCart[i].id) + " ";
    }

    connection.query(query, function(error, results) {
        let productList = [];
        let totalWeight = 0;
        let totalPrice = 0;
        if (results)
        {
            for (var i = 0; i < results.length; i++)
            {
                cartItem = userCart.find(item => item.id == results[i].Product_ID)
                totalWeight += results[i].Weight * cartItem.quantity;
                totalPrice += results[i].Price * cartItem.quantity;
                productList.push(results[i]);
                productList[productList.length-1].quantity = cartItem.quantity; // Finds the quantity from the user's cart and applies it to the DB item
            }
        }
        if (results.length == 0) req.flash('emptyCart', 'Cart is Empty.');
        res.render('cart.ejs', {cart: productList, weight: totalWeight, price: (totalPrice/100).toFixed(2), editItem: req.body.id});
    });
})

app.post('/cart/editquantity', checkAuthenticated, (req, res) => {
    userCart = JSON.parse(req.cookies.cart);
    cartItem = userCart.find(product => product.id === req.body.id);
    if (cartItem)
    {
        cartItem.quantity = req.body.newquantity;
    }
    res.clearCookie('cart');
    res.cookie('cart', JSON.stringify(userCart));
    res.redirect('/cart');
})

app.post('/cart/removeitem', checkAuthenticated, (req,res) => {
    userCart = JSON.parse(req.cookies.cart);
    var index = userCart.findIndex(item => item.id === req.body.id);
    if (index != -1) userCart.splice(index, 1);
    res.clearCookie('cart');
    res.cookie('cart', JSON.stringify(userCart));
    res.redirect('/cart');
})

app.post('/cart/additem', checkAuthenticated, (req, res) => {
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

app.post('/cart/clear', checkAuthenticated, (req, res) => {
    res.clearCookie('cart');
    res.cookie('cart',JSON.stringify([]));
    res.redirect('/cart');
});

app.get('/checkout', checkAuthenticated, (req, res) => {
    if (!req.cookies.transactionid)
    {
        res.redirect('/');
        return;
    }
    connection.query('SELECT * FROM Transaction WHERE id = ?',[req.cookies.transactionid], function(error, results) {
        if (results.length == 0)
        {
            res.redirect('/');
            return;
        }
        else
        {
            res.render('payment.ejs');
        }
    })
})

app.post('/checkout', checkAuthenticated, (req, res) => {
    userCart = JSON.parse(req.cookies.cart);
    if (userCart.length == 0)
    {
        req.flash('stockError', 'There are no items in your cart.');
        res.redirect('/cart');
        return;
    }
    let query = "SELECT * FROM Product WHERE Product_ID = 0 ";
    for (var i = 0; i < userCart.length; i++)
    {
        query = query + "OR Product_ID = " + connection.escape(userCart[i].id) + " ";
    }
    connection.query(query, function(error, results) {
        userCart.sort((a, b) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            else return 0;
        });
        results.sort((a, b) => {
            if (a.Product_ID < b.Product_ID) return -1;
            if (a.Product_ID > b.Product_ID) return 1;
            else return 0;
        })
        for (i = 0; i < userCart.length; i++)
        {
            if (userCart[i].id != results[i].Product_ID)
            {
                req.flash('stockError', "There was an error processing your cart. Please try again later.");
                res.redirect('/cart');
                return;
            }
            if (results[i].Stock == 0)
            {
                req.flash('stockError', "Sorry, " + results[i].Prod_Name + " is out of stock.");
                res.redirect('/cart');
                return;
            }
            if (userCart[i].quantity > results[i].Stock)
            {
                req.flash('stockError', results[i].Prod_Name + " has limited stock. Reduce your quantity to " + results[i].Stock + " or fewer.");
                res.redirect('/cart');
                return;
            }
        } // Past this point, the cart is valid and all items are in stock



        transactionID = uuidv4();
        res.cookie('transactionid', transactionID);
        connection.query("INSERT INTO Transaction (id, completed, cart) VALUES (?, ?, ?)",[transactionID, 0, JSON.stringify(userCart)]);
        for (i = 0; i < userCart.length; i++)
        {
            connection.query("UPDATE Product SET Stock = ? WHERE Product_ID = ?",[results[i].Stock - userCart[i].quantity, results[i].Product_ID]);
        }
        res.clearCookie('cart');
        res.cookie('cart', JSON.stringify([]));

        res.redirect('/checkout');
    });
})

app.get('/submitpayment', checkAuthenticated, (req, res) => {
    if (!req.cookies.transactionid)
    {
        req.flash('stockError', 'There was an error processing your transaction. Please try again.');
        res.redirect('/');
        return;
    }
    connection.query('SELECT * FROM Transaction WHERE id = ?',[req.cookies.transactionid], function(error, results) {
        if (results.length == 0 || results[0].completed == 1)
        {
            req.flash('stockError', 'There was an error processing your transaction. Please try again.');
            res.redirect('/');
            return;
        }
        else
        {
            connection.query('UPDATE Transaction SET completed = 1 WHERE id = ?',[req.cookies.transactionid]);
            res.render('ordercomplete.ejs');
        }
    })
})

app.get('/registration', checkNotAuthenticated, (req, res) => {
    res.render('registration.ejs');
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