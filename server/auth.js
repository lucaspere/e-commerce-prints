const passport = require('passport')
const jwt = require('jsonwebtoken')
const Strategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const jwtSecret = process.env.JWT_SECRET || 'marque zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthelucas'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }

passport.use(adminStrategy())
const authenticate = passport.authenticate('local', { session: false })

module.exports = {
   authenticate,
   login,
   ensureUser
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

async function ensureUser(req, res, next) {
   const jwtString = req.headers.authorization || req.cookies.jwt
   const payload = await verify(jwtString)
   if (payload.username) {
      req.user = payload
      if(req.user.username === 'admin') req.isAdmin = true
      return next()
   }

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
   return new Strategy(async function (username, password, cb) {
      const isAdmin = username === 'admin' && password === adminPassword
      if (isAdmin) return cb(null, { username: 'admin' })

      try {
         const user = await Users.get(username)
         if(!user) return cb(null, { username: 'admin'})

         const isUser = await bcrypt.compare(password, user.password)
         if(isUser) return cb(null, { username: user.name })
      } catch (err) {}

      cb(null, false)
   })
}