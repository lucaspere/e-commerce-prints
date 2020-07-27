const Products = require('../models/products')
const Orders = require('../models/orders')
const User = require('../models/user')
const autoCatch = require('./lib/auto-catch')

module.exports = autoCatch({
   listProducts,
   getProduct,
   createProduct,
   editProduct,
   deleteProduct,
   createOrder,
   listOrders,
   createUser
})

async function deleteProduct(req, res, next) {
   await Products.remove(req.params.id)

   res.json({ success: true })
}

async function editProduct(req, res, next) {
   if(!req.isAdmin) return forbidden(next)

   const change = req.body
   const product = await Products.edit(req.params.id, change)

   res.json(product)
}

async function createProduct(req, res, next) {
   if(!req.isAdmin) return forbidden(next)

   const product = await Products.create(req.body)
   res.json(product)
}

async function listProducts(req, res) {
   const { offset = 0, limit = 25, tag } = req.query

   const products = await Products.list({
      offset: Number(offset),
      limit: Number(limit),
      tag
   })

   res.json(products)
}

async function getProduct(req, res, next) {
   const { id } = req.params

   const products = await Products.get(id)
   if (!products) return next()

   res.json(products)
}

async function createOrder(req, res, next) {
   const fields = req.body
   if(!req.isAdmin) fields.username = req.user.username

   const order = await Orders.create(req.body)
   res.json(order)
}

async function listOrders(req, res, next) {
   const { offset = 0, limit = 25, productId, status } = req.query

   const opts = {
      offset: Number(offset),
      limit: Number(limit),
      productId,
      status
    }

    if(!req.isAdmin) opts.username = req.user.username

   const orders = await Orders.list(opts)

   res.json(orders)
}

async function createUser(req, res, next) {
   const user = await User.create(req.body)
   const { username, email } = user

   res.json({ username, email })
}

function forbidden (next) {
   const err = new Error('Forbidden')
   err.statusCode = 403
   return next(err)
}