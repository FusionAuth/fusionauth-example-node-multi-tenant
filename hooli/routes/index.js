const express = require('express');
const router = express.Router();
const {FusionAuthClient} = require('@fusionauth/typescript-client');


const clientId = '4d04696e-95dc-4deb-8f53-daea1d11ae47';
const clientSecret = '-5jYS2iKd4iLX4P1GPe-Z3XGnHJg0rz25sKyPUsuteQ';
const client = new FusionAuthClient('noapikeyneeded', 'http://localhost:9011');
const hostName = 'hooli.local';
const port = 3001;

const loginUrl = 'http://localhost:9011/oauth2/authorize?client_id='+clientId+'&response_type=code&redirect_uri=http%3A%2F%2F'+hostName+'%3A'+port+'%2Foauth-redirect&scope=offline_access';
const logoutUrl = 'http://localhost:9011/oauth2/logout?client_id='+clientId;

/* GET home page. */
router.get('/', function (req, res, next) {

  if (!req.session.user) {
     res.redirect(302, loginUrl);
  }
  res.render('index', {user: req.session.user, title: 'Hooli App', clientId: clientId, logoutUrl: "/logout", loginUrl: loginUrl});
});

/* Login page if we aren't logged in */
router.get('/login', function (req, res, next) {
  res.render('login', {title: 'Hooli Login', clientId: clientId, loginUrl: loginUrl});
});

/* Logout page */
router.get('/logout', function (req, res, next) {
  req.session.user = null;
  res.redirect(302, logoutUrl);
});

/* End session for global SSO logout */
router.get('/endsession', function (req, res, next) {
  req.session.user = null;
  res.redirect(302, "/login");
});

/* OAuth return from FusionAuth */
router.get('/oauth-redirect', function (req, res, next) {
  // This code stores the user in a server-side session
  client.exchangeOAuthCodeForAccessToken(req.query.code,
                                         clientId,
                                         clientSecret,
                                         'http://'+hostName+':'+port+'/oauth-redirect')
      .then((response) => {
        return client.retrieveUserUsingJWT(response.response.access_token);
      })
      .then((response) => {
        if (response.response.user.registrations.length == 0 || (response.response.user.registrations.filter(reg => reg.applicationId === clientId)).length == 0) {
          console.log("User not registered, not authorized.");
          res.redirect(302, '/');
          return;
        }
      
        req.session.user = response.response.user;
      })
      .then((response) => {
        res.redirect(302, '/');
      }).catch((err) => {console.log("in error"); console.error(JSON.stringify(err));});
});

module.exports = router;
