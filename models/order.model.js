const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = require('mongoose');

const orderSchema = new Schema(
  {
    userId: {
      type: String,
    },
    client: {
      type: String,
      // required: false,
    },
    products: [
      {
        _id: false,
        qty: {
          type: Number,
          default: 1,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'canceled', 'delivering', 'delivered', 'preparing'],
      default: 'pending',
      // required: false,
    },
    dateEntry: {
      type: Date,
      default: Date.now(),
      // required: false,
    },
    dateProcessed: {
      type: Date,
      // required: false,
    },

  },
  { versionKey: false },
);
orderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Order', orderSchema);
