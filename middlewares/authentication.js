const { verifyToken } = require('../helpers/jwt');

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw { name: 'InvalidToken' };
    }

    const token = authorization.split(' ')[1];
    const payload = verifyToken(token);
    
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;