const cuid = require('cuid')
const { isEmail } = require('validator')
const db = require('../db/db')

module.exports = {
   list,
   create
}

const Order = db.model('Order', {
   _id: { type: String, default: cuid },
   buyerEmail: emailSchema({ required: true }),
   products: [
      {
         type: String,
         ref: 'Product',
         index: true,
         required: true
      }
   ],
   status: {
      type: String,
      index: true,
      default: 'CREATED',
      enum: ['CREATED', 'PENDING', 'COMPLETED']
   }
})

async function list(opts = {}) {
   const { offset = 0, limit = 25, username, productId, status } = opts

   const query = {}
   if (username) query.username = username
   if (productId) query.products = productId
   if (status) query.status = status

   const orders = await Order.find(query)
      .sort({_id: 1})
      .skip(offset)
      .limit(limit)
      .populate('products')
      .exec()

   return orders
}

async function create(fields) {
   const order = await new Order(fields).save()
   await order.populate('products').execPopulate()
   return order
}

function emailSchema(opts = {}) {
   const { required } = opts
   return {
      type: String,
      required: !!required,
      validate: {
         validator: isEmail,
         message: props => `${props.value} is not a valid email`
      }
   }
}