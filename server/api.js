const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

module.exports = autoCatch({
   listProducts,
   getProduct,
   createProduct,
   editProduct,
   deleteProduct
})

async function deleteProduct(req, res, next) {
   res.json({ success: true })
}

async function editProduct(req, res, next) {
   res.json(req.body)
}

async function createProduct(req, res, next) {

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