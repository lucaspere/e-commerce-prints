const passport = require('passport')
const jwt = require('jsonwebtoken')
const Strategy = require('passport-local').Strategy

const autoCatch = require('./lib/auto-catch')

const jwtSecret = process.env.JWT_SECRET || 'marque zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthelucas'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }

passport.use(adminStrategy())
const authenticate = passport.authenticate('local', { session: false })

module.exports = {
   authenticate,
   login,
   ensureAdmin: autoCatch(ensureAdmin)
}

async function login(req, res, next) {
   const token = await sign({ username: req.user.username })
   res.cookie('jwt', token, { httpOnly: true })
   res.json({ success: true, token })
}

function sign(payload) {
   return new Promise((resolve, reject) => {
      jwt.sign(payload, jwtSecret, jwtOpts, (err, result) => {
         if(err) reject(err)
   
         resolve(result)
      })
   })
}

async function ensureAdmin(req, res, next) {
   const jwtString = req.headers.authorization || req.cookies.jwt
   const payload = await verify(jwtString)
   console.log(payload)
   if (payload.username === 'admin') return next()

   const err = new Error('Unauthorized')
   err.statusCode = 401
   next(err)
}

function verify(jwtString = '') {
   jwtString = jwtString.replace('Bearer ', '')

   return new Promise((resolve, reject) => {
      jwt.verify(jwtString, jwtSecret, (err, result) => {
         if(err) {
            err.statusCode = 401
            reject(err)
         }

         resolve(result)
      })
   })
}

function adminStrategy() {
   return new Strategy(function (username, password, cb) {
      const isAdmin = username === 'admin' && password === adminPassword
      if (isAdmin) return cb(null, { username: 'admin' })
      cb(null, false)
   })
}