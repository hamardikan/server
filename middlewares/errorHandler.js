const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  let statusCode = 500;
  let message = "Internal Server Error";

  switch (err.name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      statusCode = 400;
      message = err.errors[0].message;
      break;
    
    case "BadRequest":
      statusCode = 400;
      message = err.message;
      break;
    
    case 'InvalidCredentials':
      statusCode = 401;
      message = err.message;
      break;
    
    case 'InvalidToken':
    case 'JsonWebTokenError':
      statusCode = 401;
      message = 'Invalid token';
      break;
    
    case 'Forbidden':
      statusCode = 403;
      message = err.message || 'Forbidden';
      break;
    
    case 'NotFound':
      statusCode = 404;
      message = err.message || 'Data not found';
      break;
  }

  res.status(statusCode).json({ 
    statusCode, 
    name: err.name, 
    message 
  });
}

module.exports = errorHandler;