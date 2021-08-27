const Product = require('../models/product.model');

module.exports = {
  // productS
  // POST
  postProduct: async (req, resp, next) => {
    try {
      const product = await new Product();
      product.name = req.body.name;
      product.price = req.body.price;

      if (!req.body.name || !req.body.price) {
        return next(400);
      }
      return product.save((err, productStored) => {
        if (err) {
          return resp.status(400).send({ message: `Error al salvar la base de datos:${err}` }); // duda cambio de 500 a 400
        }
        return resp.status(200).json(productStored);
      });
    } catch (err) {
      next(err);
    }
  },
  // GET
  getProducts: (req, resp) => {
    Product.find({}, (err, products) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al mostrar datos de productos' });
      }
      if (!products) {
        return resp.status(404).send({ message: 'Error mo se encontaron productos' });
      }
      return resp.send(200, { products });
    });
  },
  // get/:PRODUCTID
  getProduct: (req, resp) => {
    const { productId } = req.params;
    Product.findById(productId, (err, product) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!product) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }
      return resp.status(200).send({ product });
    });
  },

  // DELETE
  deleteProduct: (req, resp) => {
    const { productId } = req.params;
    Product.findById(productId, (err, product) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!product) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }

      return product.remove((fail) => {
        if (fail) {
          return resp.status(500).send({ message: 'Error al eliminar producto' });
        }
        return resp.status(200).send({ message: 'se eliminó el producto' });
      });
    });
  },
  // PUT
  putProduct: (req, resp, next) => {
    if (!req.body.name && !req.body.price) {
      return next(400);
    }
    const { productId } = req.params;
    const update = req.body;
    return Product.findByIdAndUpdate(productId, update, (err, productUpdate) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!productUpdate) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }
      return resp.status(200).send({ product: productUpdate });
    });
  },
};
