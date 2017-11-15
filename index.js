require('dotenv').config();

const express = require('express')
    , bodyParser = require('body-parser')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , cors = require('cors')
    , massive = require('massive')
    , session = require('express-session')
    , config = require('./config.js')

const app = module.exports = express();

app.enable('trust proxy')
app.use(bodyParser.json())
app.use( cors() );
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  proxy: true
  // cookie: {secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static('./build'));
const strategy = require('./strategy.js')

massive(process.env.CONNECTION_STRING).then( db => {
    app.set('db', db);
  })

passport.use(strategy)

app.get('/auth',passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/home/',
    failureRedirect: 'http://localhost:3000/'
  }))

passport.serializeUser(function(user, done) {
  console.log(1,user)
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log(2,user)
  app.get('db').find_session_user([user.id])
  .then( user => {
    console.log(3,user)
    return done(null, user[0]);
  })
});

app.get('/auth/me', (req, res, next) => {
  console.log(req.session)
  if (!req.user) {
    return res.status(401).send('Log in required');
  } else {
    return res.status(200).send(req.user);
  }
})

app.get('/auth/logout', (req, res) => {
req.logOut();
// req.session.destroy();
return res.redirect('http://localhost:3000/');
})

let PORT = 3005;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})  