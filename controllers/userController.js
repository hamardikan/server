// controllers/userController.js
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class UserController {
  static async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        throw { name: 'BadRequest', message: 'Email, password, and name are required' };
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw { name: 'BadRequest', message: 'Email already registered' };
      }

      const user = await User.create({
        email,
        password: hashPassword(password),
        name
      });

      const access_token = signToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      res.status(201).json({
        access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { name: 'BadRequest', message: 'Email and password are required' };
      }

      const user = await User.findOne({ where: { email } });
      if (!user || !user.password) {
        throw { name: 'InvalidCredentials', message: 'Invalid email/password' };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { name: 'InvalidCredentials', message: 'Invalid email/password' };
      }

      const access_token = signToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      res.json({
        access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { name, picture } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: 'NotFound', message: 'User not found' };
      }

      await user.update({
        name: name || user.name,
        picture: picture || user.picture
      });

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!oldPassword || !newPassword) {
        throw { name: 'BadRequest', message: 'Old password and new password are required' };
      }

      const user = await User.findByPk(userId);
      if (!user || !user.password) {
        throw { name: 'NotFound', message: 'User not found' };
      }

      const isValidPassword = comparePassword(oldPassword, user.password);
      if (!isValidPassword) {
        throw { name: 'InvalidCredentials', message: 'Invalid old password' };
      }

      await user.update({
        password: hashPassword(newPassword)
      });

      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'picture', 'role', 'createdAt']
      });

      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'picture', 'role', 'createdAt']
      });

      if (!user) {
        throw { name: 'NotFound', message: 'User not found' };
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;