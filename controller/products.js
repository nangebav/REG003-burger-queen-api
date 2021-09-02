const Product = require('../models/product.model');
const { pagination } = require('./util/util');

module.exports = {
  // productS
  // POST
  postProduct: async (req, resp, next) => {
    try {
      const product = new Product();
      product.name = req.body.name;
      product.price = req.body.price;
      if (!req.body.name || !req.body.price) {
        return next(400);
      }
      const productStored = await product.save();
      if (!productStored) {
        return resp.status(400).send({ message: 'Error al ingresar producto' });
      }
      return resp.status(200).send(productStored);
    } catch (err) {
      return next(err);
    }
  },
  // GET
  getProducts: async (req, resp, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const products = await Product.paginate({}, options);

      const url = `${req.protocol}://${req.get('host') + req.path}`;

      const links = pagination(products, url, options.page, options.limit, products.totalPages);

      resp.links(links);
      return resp.status(200).json(products.docs);
    } catch (err) {
      return next(err);
    }
  },
  // get/:PRODUCTID
  getProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      if (!productId.match(/^[0-9a-fA-F]{24}$/)) return next(404);
      const product = await Product.findById(productId);

      if (!product) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }
      return resp.status(200).send(product);
    } catch (err) {
      return next(err);
    }
  },

  // DELETE
  deleteProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      if (!productId.match(/^[0-9a-fA-F]{24}$/)) return next(404);
      const product = await Product.findById(productId);
      if (!product) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }
      const productRemove = await product.remove();
      if (!productRemove) {
        return resp.status(500).send({ message: 'Error al hacer la petición' });
      }
      return resp.status(200).send({ message: 'se eliminó el producto' });
    } catch (err) {
      return next(err);
    }
  },
  // PUT
  putProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      if (!productId.match(/^[0-9a-fA-F]{24}$/)) return next(404);
      const update = req.body;
      if (req.body.name === '' && req.body.price === '') {
        return next(400);
      }
      if (typeof req.body.price !== 'number' && typeof req.body.name !== 'string') {
        return next(400);
      }
      const productUpdate = await Product.findByIdAndUpdate(productId, update);

      if (!productUpdate) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }

      const productNew = await Product.findById(productId);

      return resp.status(200).send(productNew);
    } catch (err) {
      return next(err);
    }
  },
};
