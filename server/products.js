const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, '../products.json')

module.exports = {
   list,
   get
}

async function list(opts = {}) {
   const { offset = 0, limit = 25, tag } = opts
   const data = await fs.readFile(productsFile)
   return JSON.parse(data)
      .filter((p, i) => !tag || p.tags.indexOf(tag) >= 0)
      .slice(offset, offset + limit)
}

async function get(id = '') {
   const products = JSON.parse(await fs.readFile(productsFile))

   return products.find((item) => item._id === id)
}