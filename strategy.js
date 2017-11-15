const Auth0Strategy = require('passport-auth0');
const config = require(`./config.js`);
const { authDomain, authClientID, authClientSecret, authCallback } = config;
var app = require('./index.js')

module.exports = new Auth0Strategy({
   domain:       authDomain,
   clientID:     authClientID,
   clientSecret: authClientSecret,
   callbackURL:  authCallback,
   scope: 'openid email profile'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
      const db = app.get('db');
    
      db.find_user([ profile.identities[0].user_id ])
      .then( user => {
       if ( user[0] ) {
    
         return done( null, { id: user[0].id } );
    
       } else {
    
         db.create_user([profile.identities[0].user_id])
         .then( user => {
            return done( null, { id: user[0].id } );
         })
    
       }
      })
    
    
    }
);