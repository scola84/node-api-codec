module.exports = (factory) => {
  return (request, response, next) => {
    try {
      request.setTransformer('Content-Encoding',
        factory.create(request, response));
      next();
    } catch (error) {
      next(new Error('406 ' + error.message));
    }
  };
};
