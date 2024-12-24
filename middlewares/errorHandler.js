function errorHandler(err, req, res, next) {
    console.error(err);
  
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';
  
    if (err.name === 'SequelizeValidationError') {
      status = 400;
      message = err.errors.map(e => e.message);
    }
  
    res.status(status).json({ message });
  }
  
  module.exports = errorHandler;