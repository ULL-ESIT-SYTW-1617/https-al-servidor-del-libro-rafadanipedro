const passport = require('passport');
const { Strategy } = require('passport-github')
const github = require ('octonode')
let client // Guardar el cliente para usarlo posteriormente

const strategy = (config) => {
  let {
    host,
    Github,
  } = config

  client = github.client({id: Github.clientID, secret: Github.clientSecret})

  return new Strategy({
    clientID: Github.clientID,
    clientSecret: Github.clientSecret,
    callbackURL: `${host}/login/github/return`
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile))
}

const login = () => {
  const router = require('express').Router()

  router.get('/login/github', passport.authenticate('github'));

  router.get('/login/github/return',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    });

  return router
}

const middleware = (config) => {
  return (req, res, next) => {
    console.log(req.user)
    if (req.user.auth !== 'Github') {
      return next()
    }
    client.get(`/users/${req.user.username}/orgs`, {}, function (err, status, body, headers) {
      for(let org of body) {
        if (org.login === config.Github.organizacion) {
          return next()
        }
      }
      res.render('error', {error: false})
    });
  }
}

module.exports = {
  strategy,
  login,
  middleware
}
