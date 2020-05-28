require('dotenv').config();

const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      bcrypt         = require('bcrypt-nodejs'),
      Passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      session        = require('express-session'),
      methodOverride = require('method-override'),
      connection     = require('./config/database');



const Port = process.env.APP_PORT || 3000;

//Config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + ('/public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Passport Config
app.use(session({
    secret: 'jaidev',
    resave: false,
    saveUninitialized: false
}));


app.use(Passport.initialize());
app.use(Passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;

    next();
})

Passport.serializeUser((user, done) => { done(null, user.id)});
Passport.deserializeUser(function(id, done){
    connection.query('SELECT * FROM user WHERE id = ?', [id], 
    function(err, rows){
        done(err, rows[0]);
    })
});

//Passport Signup
Passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField :'username',
        passwordField:'password',
        passReqToCallback :true
    },
    function(req, username, password, done){
        connection.query("SELECT * FROM user WHERE username = ?", [username], function(err, rows){
            if(err)
                return done(err);
            if(rows.length){
                return done(null, false);
            }else{
                var newUserMysql = {
                    username :username,
                    password : bcrypt.hashSync(password, null, null)
                };

                var insertQuery = "INSERT INTO user (username, password) VALUES (?,?)";

                connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
                    function(err, rows){
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
            }
        });
    })
);


//Passport login
Passport.use(
    'local-login',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req,username, password, done){
        connection.query("SELECT * FROM user WHERE username = ?", [username],
        function(err, rows){
            if(err)
                return done(err);
            if(!rows.length){
                return done(null, false);
            }
            if(!bcrypt.compareSync(password, rows[0].password))
                return done(null, false);
            
            return done(null, rows[0]);
        });
    })
);

connection.query("USE yelpcamp");






//===================== Routes =================================

//login
app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/login', Passport.authenticate('local-login',{
    successRedirect: '/home',
    failureRedirect: '/login',
}),(req, res) => {});

//register
app.get('/register', (req, res) =>{
    res.render('register');
})

app.post('/register', Passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/register'
}), (req, res)=>{})


app.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/home');
});

//landing
app.get("/", (req, res) => {
    res.render('landing');
});

//home
app.get('/home', (req,res) => {
    connection.query('SELECT * FROM campground', (error, results) => {
        if(error) throw error;
        res.render('home', {campground: results});
    })
});

app.get('/home/show/:id', (req, res) =>{
    var specificcampground = 'SELECT * FROM campground WHERE id = ' + req.params.id;
    connection.query(specificcampground, function(error, results){
        if(error) throw error;
        res.render('show', {campground: results});
    })
    
});

app.get('/home/add', isloggedin, (req, res) => {
    res.render('add');
});

app.post('/home/add/:id', isloggedin, (req, res) => {
    var newcampground = {name: req.body.name, price : req.body.price, imageurl: req.body.image, description: req.body.description, user_id: req.params.id};
    connection.query('INSERT INTO campground SET ?', newcampground, (error, results) => {
        res.render('home');
    })
});



function isloggedin(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/login');
    }
}


app.listen(Port, ()=>{console.log(`Server's up and running on ${Port}`)});
