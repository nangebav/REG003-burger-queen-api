/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { isAdmin } = require('../middleware/auth');
const { validateEmail, pagination } = require('./util/util');

module.exports = {
  // POST
  postUser: async (req, resp, next) => {
    try {
      const { email, password } = req.body;
      if (!password || !email) { return next(400); }
      if (!validateEmail(email) || password.length < 3) return next(400);
      const UserExist = await User.findOne({ email: req.body.email });
      if (UserExist) return next(403);
      const user = new User();
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.roles = req.body.roles;
      const userStored = await user.save();
      return resp.status(200).send({
        _id: userStored._id,
        email: userStored.email,
        roles: userStored.roles,
      });
    } catch (err) {
      return next(err);
    }
  },

  // GET
  getUsers: async (req, resp, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };

      const users = await User.paginate({}, options);

      const url = `${req.protocol}://${req.get('host') + req.path}`;

      const links = pagination(users, url, options.page, options.limit, users.totalPages);

      resp.links(links);
      return resp.status(200).send(users.docs);
    } catch (err) {
      return next(err);
    }
  },
  // GET/:UID
  getUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const user = (validateEmail(uid))
        ? await User.findOne({ email: uid })
        : await User.findById(uid);
      if (!user) {
        return next(404);
      }
      return resp.status(200).send(user);
    } catch (err) {
      return next(err);
    }
  },
  // DELETE
  deleteUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const userValidateEmail = validateEmail(uid);
      if (!userValidateEmail) {
        const userId = await User.findById(uid);
        if (!userId) { return resp.status(404).send({ message: 'Usuario no encontrado' }); }
        const userRemove = await userId.remove();
        if (!userRemove) {
          return resp.status(500).send({ message: 'Error al hacer la petición' });
        }
        return resp.status(200).send({ message: 'se eliminó el usuario' });
      }
      const userEmail = await User.findOne({ email: uid });

      if (!userEmail) return resp.status(404).send({ message: 'El usuario no existe' });

      const UserRemoveEmail = await userEmail.remove();
      if (!UserRemoveEmail) return resp.status(500).send({ message: 'Error al hacer la petición' });

      return resp.status(200).send({ message: 'Se eliminó el usuario' });
    } catch (err) {
      return next(err);
    }
  },
  // PUT
  putUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const update = req.body;

      const user = validateEmail(uid)
        ? await User.findOne({ email: uid }) // Objeto si escribió email
        : await User.findById(uid); // Objeto si escribió id

      if (!user) return next(404);

      if (!isAdmin(req) && req.body.roles) return next(403);

      if (Object.keys(req.body).length === 0) return next(400);
      if (!validateEmail(req.body.email) && req.body.password.length < 3) return next(400);

      update.password = bcrypt.hashSync(req.body.password, 10);
      const userUpdate = validateEmail(uid)
        ? await User.findOneAndUpdate({ email: uid }, update) // Objeto si escribió email
        : await User.findByIdAndUpdate(uid, update); // Objeto si escribió id

      if (!userUpdate) return resp.status(404).send({ message: 'El usuario no existe' });
      return resp.status(200).send({ user: userUpdate });

      /*
      if (!user) {
        const userUpdate = await User.findByIdAndUpdate(uid, update);

      , (err, userUpdate) => {
          if (err) {
            return resp.status(500).send({ message: `Error al realizar la petición: ${err}` });
          }
          if (!userUpdate) {
            return resp.status(404).send({ message: 'El usuario no existe' });
          }
        // if (Object.keys(req.body).length === 0) return next(400);

      }

      await User.findOneAndUpdate({ email: uid }, update, (err, userUpdate) => {

        if (err) {
          return resp.status(500).send({ message: 'Error al realizar la petición' });
        }

        if (!userUpdate) {
          return resp.status(404).send({ message: 'El usuario no existe' });
        }

        // if (Object.keys(req.body).length === 0) return next(400);

        if (req.body.email === '' && req.body.password === '') return next(400);

        return resp.status(200).send({ user: userUpdate });
      }); */
    } catch (err) {
      return next(err);
    }
  },
};
