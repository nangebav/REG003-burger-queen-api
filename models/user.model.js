const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      // validate:{
      //   validator: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
      // }
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    roles: { admin: { type: Boolean, default: false } },
  }, { versionKey: false },
);

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
