const passport = require('passport');
const { Strategy } = require('passport-local')
const Dropbox = require('dropbox')
const bcrypt = require('bcrypt-nodejs')
const dropbosee = require('./dropbosee')
const User = require('../models/user')

const strategy = (config) => {
  dropbosee.connect(config.Local.token).then(() => {
    console.log('Conectado con Dropbox!!')
    User.find().then(users => {
      if(!users.length) {
        let users = config.Local.lectores.map(lector => {
          let user = new User({email: lector, password: bcrypt.hashSync('1234')})
          return user.save()
        })
        Promise.all(users).then(() => console.log('Guardado todos los usuarios'))
      }
    }).catch(console.error)
  })

  return new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    User.findOne({email}).then(user => {
      if (!user) return done(null, false)
      if (bcrypt.compareSync(password, user.content.password)) {
        user.auth = 'Local'
        return done(null, user)
      }
      return done(null, false)
    }).catch(console.error)
  })
}

const login = () => {
  const router = require('express').Router()

  router.get('/login/password', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login')
    res.render('reg', req.user.content)
  })

  router.post('/login/password', (req, res) => {
    if (bcrypt.compareSync(req.body.OldPassword, req.user.content.password)) {
      if (req.body.NewPass === req.body.ConfirmPass) {
        console.log('Ok, las contraseñas coinciden')
        return User.findOneUpdate({email: req.user.content.email}, {password: bcrypt.hashSync(req.body.NewPass)}).then(() => {
          res.send('OOOOkkkkkk')
        }).catch(err => {
          console.log(err)
          res.send(':(')
        })
      }
    }
    res.redirect('/login/password')
  })

  router.post('/login/local', passport.authenticate('local', {failureRedirect : '/login'}), (req, res) => res.redirect('/'));

  return router
}

const middleware = () => (req, res, next) => {
  if(bcrypt.compareSync('1234', req.user.content.password)) {
      return res.redirect('/login/password')
    }
  next()
}

module.exports = {
  strategy,
  login,
  middleware
}
