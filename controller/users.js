const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { isAdmin } = require('../middleware/auth');
const { validateEmail, pagination } = require('./util/util');

module.exports = {
  // POST
  postUser: async (req, resp, next) => {
    try {
      const user = new User();
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.roles = req.body.roles;

      if (req.body.email === '' || req.body.password === '') return next(400);

      if (!validateEmail(req.body.email) || req.body.password.length < 3) return next(400);

      await user.save((err, userStored) => {
        if (err) return resp.status(403).send({ message: `Error al salvar la base de datos:${err}` });

        return resp.status(200).send({
          _id: userStored._id,
          email: userStored.email,
          roles: userStored.roles,
        });
      });
    } catch (err) {
      return next(400);
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
      next(404);
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
    } catch (error) {
      return next(404);
    }
  },
  // DELETE
  deleteUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const userValidateEmail = validateEmail(uid);
      if (!userValidateEmail) {
        await User.findById(uid, async (err, userId) => {
          if (err) { return resp.status(500).send({ message: `Error al realizar la petición: ${err}` }); }
          if (!userId) { return resp.status(404).send({ message: 'Usuario no encontrado' }); }
          await userId.remove((fail) => {
            if (fail) {
              return resp.status(500).send({ message: `Error al realizar la petición: ${err}` });
            }
            return resp.status(200).send({ message: 'se eliminó el usuario' });
          });
        });
      }
      await User.findOne({ email: uid }, async (err, userEmail) => {
        if (err) return resp.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (!userEmail) return resp.status(404).send({ message: 'El usuario no existe' });

        await userEmail.remove((fail) => {
          if (fail) return resp.status(500).send({ message: `Error al realizar la petición: ${err}` });

          return resp.status(200).send({ message: 'Se eliminó el usuario' });
        });
      });
    } catch (error) {
      return next(404);
    }
  },
  // PUT
  putUser: async (req, resp, next) => {
    try {
      console.log('entro en esta linea');
      const { uid } = req.params;
      const update = req.body;

      if (Object.keys(req.body).length === 0) return next(400);
      if (req.body.email === '' && req.body.password === '') return next(400);
      if (!isAdmin(req) && req.body.roles) return next(403);

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
        console.log('entro en esta linea y es email');

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
      return resp.status(402).send({ message: 'El usuario no exisffte' });
    }
  },
};
