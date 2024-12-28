const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const { signToken } = require('../helpers/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
  static async googleLogin(req, res, next) {
    try {
      const { google_token } = req.body;
      if (!google_token) {
        throw { name: 'BadRequest', message: 'Google token is required' };
      }

      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      
      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          googleId: payload.sub
        }
      });

      // Generate JWT token
      const access_token = signToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      res.json({
        access_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email', 'picture']
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

module.exports = AuthController;