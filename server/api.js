const Products = require('./products')

module.exports = {
   listProducts,
   getProduct
}


async function listProducts (req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*')
   const { offset = 0, limit = 25, tag } = req.query

   try {
      res.json(await Products.list({
         offset: Number(offset),
         limit: Number(limit),
         tag
      }))
   } catch (err) {
      return res.status(500).json({ error: err.message })
   }
}

async function getProduct (req, res, next) {
   res.setHeader('Acess-Control-Allow-Origin', '*')
   const { id } = req.params

   try {
      const products = await Products.get(id)
      if(!products) return next()

      res.json(products)
   } catch (err) {
      res.status(500).json({ error: err.message})
   }
}