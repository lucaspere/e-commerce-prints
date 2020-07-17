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

async function list(_id) {
   const order = await Order.findById(_id)
      .populate('products')
      .exec()

   return order
}

async function create(fields) {
   console.log(fields)
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