/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }
  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  return jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const userInfo = await User.findById(decodedToken.uid, { email: 1, roles: 1 });

    if (!userInfo) {
      return next(403);
    }
    req.userInfo = userInfo;
    return next();
  });
};

// eslint-disable-next-line no-underscore-dangle
module.exports.isAuthenticated = (req) => (!!req.userInfo && !!req.userInfo._id);

module.exports.isAdmin = (req) => !!req.userInfo.roles.admin;
module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    // eslint-disable-next-line max-len
    : (!module.exports.isAdmin(req) && !(req.userInfo._id.toString() === req.params.uid || req.userInfo.email === req.params.uid))
      ? next(403)
      : next()
);
