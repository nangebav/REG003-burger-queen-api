const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
const config = require('../config');
const User = require('../models/user.model');

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    const user = await User.findOne({ email });
    if (!user) return next(404); // no encontrado
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return next(401);// no esta autorizado

    const token = jwt.sign({
      uid: user._id,
      email: user.email,
      roles: user.roles,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix(),
    },
    secret); // genera un token
    // return resp.json({ token }); // devuelve el token
    return resp.status(200).send({ token });
  });

  return nextMain();
};
