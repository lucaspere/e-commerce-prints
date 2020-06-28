const express = require('express')

const api = require('./api')
const middleware = require('./middleware')

const port = process.env.PORT || 1337

const app = express()

app.use(middleware.cors)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

app.listen(port, () => {
   console.log('listening on port ' + port)
})