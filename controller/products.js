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
      await product.save((err, productStored) => {
        if (err) {
          return resp.status(400).send({ message: `Error al salvar la base de datos:${err}` }); // duda cambio de 500 a 400
        }
        return resp.status(200).send(productStored);
      });
    } catch (error) {
      return next(404);
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
      next(err);
    }
  },
  // get/:PRODUCTID
  getProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      await Product.findById(productId, (err, product) => {
        if (err) {
          return resp.status(404).send({ message: 'Error al realizar la petición' });
        }
        if (!product) {
          return resp.status(404).send({ message: 'El producto no existe' });//  ver los errores
        }
        return resp.status(200).send(product);
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE
  deleteProduct: async (req, resp) => {
    const { productId } = req.params;
    await Product.findById(productId, async (err, product) => {
      if (err) {
        return resp.status(404).send({ message: 'Error al realizar la petición' });
      }
      if (!product) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }

      await product.remove((fail) => {
        if (fail) {
          return resp.status(500).send({ message: 'Error al eliminar producto' });
        }
        return resp.status(200).send({ message: 'se eliminó el producto' });
      });
    });
  },
  // PUT
  putProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      const update = req.body;
      if (req.body.name === '' && req.body.price === '') {
        return next(400);
      }
      if (typeof req.body.price !== 'number' && typeof req.body.name !== 'string') {
        return next(400);
      }
      await Product.findByIdAndUpdate(productId, update, async (err, productUpdate) => {
        if (err) {
          return resp.status(404).send({ message: 'Error al realizar la petición' });
        }

        if (!productUpdate) {
          return resp.status(404).send({ message: 'El producto no existe' });
        }

        const productNew = await Product.findById(productId);

        return resp.status(200).send(productNew);
      });
    } catch (err) {
      next(404);
    }
  },
};
