const passport = require('passport')
const jwt = require('jsonwebtoken')
const Strategy = require('passport-local').Strategy

const jwtSecret = process.env.JWT_SECRET || 'marque zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'
const jwtOpts = { algorithm: 'HS256', expiresIN: '30d'}

passport.use(adminStrategy())

const authenticate = passport.authenticate('local', { session: false})

module.exports = {
   setMiddleware,
   authenticate,
   login,
   ensureAdmin
}

function setMiddleware(app) {
   app.use(session())
   app.use(passport.initialize())
   app.use(passport.session())
}

function login(req, res, next) {
   res.json({ success: true })
}

function ensureAdmin(req, res, next) {
   const isAdmin = req.user && req.user.username === 'admin'
   if (isAdmin) return next()

   const err = new Error('Unauthorized')
   err.statusCode = 401
   next(err)
}

function adminStrategy() {
   return new Strategy(function (username, password, cb) {
      const isAdmin = username === 'admin' && password === adminPassword
      if (isAdmin) return cb(null, { username: 'admin' })
      cb(null, false)
   })
}

function session() {
   return expressSession({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false
   })
}