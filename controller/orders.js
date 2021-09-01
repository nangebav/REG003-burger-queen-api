const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { pagination } = require('./util/util');

module.exports = {

  // ORDERS
  // GET
  getOrders: async (req, resp, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const orders = await Order.paginate({}, options);
      const url = `${req.protocol}://${req.get('host') + req.path}`;

      const links = pagination(orders, url, options.page, options.limit, orders.totalPages);

      resp.links(links);
      if (!orders) {
        return resp.status(404).send({ message: 'Orden no encontrada' });
      }
      const orderPopulate = await Product.populate(orders, { path: 'products.product' });
      if (!orderPopulate) {
        return resp.status(404);
      }
      return resp.status(200).send(orderPopulate.docs);
    } catch (err) {
      return next(err);
    }
  },
  // GET/:ORDERSID
  getOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;
      if (!orderId.match(/^[0-9a-fA-F]{24}$/)) return next(404);
      const order = await Order.findOne({ _id: orderId });
      if (!order) {
        return resp.status(404).send({ message: 'Orden no encontrada' });
      }
      const orderPopulate = await Product.populate(order, { path: 'products.product' });
      if (!orderPopulate) {
        return resp.status(404);
      }
      return resp.status(200).send(orderPopulate);
    } catch (err) {
      return next(err);
    }
  },
  // POST
  postOrder: async (req, resp, next) => {
    try {
      if (Object.keys(req.body).length === 0) return next(400);
      const newOrder = new Order();
      newOrder.userId = req.body.userId;
      newOrder.client = req.body.client;
      newOrder.products = req.body.products.map((product) => ({
        qty: product.qty,
        product: product.productId,
      }));
      if (!req.body.products || req.body.products.length === 0) {
        return resp.send(400);
      }
      if (req.body.client === '') {
        return resp.send(400);
      }
      if (!req.body.userId) {
        return resp.send(400);
      }

      const newOrderSaved = await newOrder.save();

      const populatedOrder = await newOrderSaved
        .populate('products.product')
        .execPopulate();

      return resp.status(200).send(populatedOrder);
    } catch (err) {
      return next(err);
    }
  },
  // DELETE
  deleteOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;
      if (!orderId.match(/^[0-9a-fA-F]{24}$/)) return next(404);
      const order = await Order.findById(orderId);
      if (!order) {
        return resp.status(404).send({ message: 'La orden no existe' });
      }
      const orderRemove = await order.remove();
      if (!orderRemove) {
        return resp.status(500).send({ message: 'Error al hacer la petición' });
      }
      return resp.status(200).send({ message: 'se eliminó la orden' });
    } catch (err) {
      return next(err);
    }
  },

  // PUT
  putOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;
      if (!orderId.match(/^[0-9a-fA-F]{24}$/)) return next(404);
      const update = req.body;

      if (update.status === 'delivered') {
        update.dateProcessed = Date.now();
      }

      const orderUpdate = await Order.findByIdAndUpdate(orderId, update);

      if (!update.userId && !update.client && !update.products && !update.status) {
        return next(400);
      }
      switch (req.body.status) {
        case 'pending':
          break;
        case 'canceled':
          break;
        case 'delivering':
          break;
        case 'delivered':
          break;
        case 'preparing':
          break;
        default:
          return resp.status(400).send({ message: 'Estatus no valido' });
      }

      if (!orderUpdate) {
        return resp.status(404).send({ message: 'La orden no existe' });
      }
      const OrderNew = await Order.findById(orderId);

      return resp.status(200).send(OrderNew);
    } catch (err) {
      return next(err);
    }
  },
};
