const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: 'https://therockstore.com.ar/wp-content/uploads/2021/06/noImg-24.png',
    },
    type: {
      type: String,
      required: false,
      default: 'burger',
    },
    dateEntry: {
      type: Date,
      default: Date.now(),
      required: false,
    },
  },
  { versionKey: false },
);
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);
