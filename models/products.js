const cuid = require('cuid')
const { isURL } = require('validator');
const db = require('../db/db')

module.exports = {
   list,
   get,
   create,
   remove,
   edit
}

const Product = db.model('Product', {
   _id: { type: String, default: cuid },
   description: { type: String, required: true },
   imgThumb: urLSchema({required: true}),
   img: urLSchema({required: true}),
   link: urLSchema(),
   userId: { type: String, required: true },
   userName: { type: String, required: true },
   userLink: urLSchema(),
   tags: { type: [String], index: true }
})


function urLSchema (opts = {}) {
   const { required } = opts
   return {
   type: String,
   required: !!required,
   validate: {
      validator: isURL,
      message: props => `${props.value} is not a valid URL`
   }
   }
}

async function create(fields) {
   const product = await new Product(fields).save()

   return product
}

async function list(opts = {}) {
   const { offset = 0, limit = 25, tag } = opts
   const query = tag ? { tags: tag } : {}
   const products = await Product.find(query)
      .sort({ _id: 1 })
      .skip(offset)
      .limit(limit)

   return products
}

async function get(_id) {
   const products = await Product.findById(_id)

   return products
}

async function edit(_id, change) {
   const product = await get(_id)
   Object.keys(change).forEach(function (key) {
      product[key] = change[key]
   })

   await product.save()

   return product
}

async function remove(_id) {
   await Product.deleteOne({ _id })
}