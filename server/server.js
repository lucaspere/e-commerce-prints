const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const api = require('./api')
const auth = require('./auth')
const middleware = require('./middleware')

const port = process.env.PORT || 1337

const app = express()

app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser())


app.get('/products', api.listProducts)
app.post('/products', auth.ensureUser, api.createProduct)
app.get('/products/:id', api.getProduct)
app.put('/products/:id', auth.ensureUser, api.editProduct)
app.delete('/products/:id', auth.ensureUser, api.deleteProduct)

app.get('/orders', auth.ensureUser, api.listOrders)
app.post('/orders', auth.ensureUser, api.createOrder)

app.post('/users', api.createUser)

app.post('/login', auth.authenticate, auth.login)

app.use(middleware.handleError)
app.use(middleware.notFound)

app.listen(port, () => {
   console.log('listening on port ' + port)
})