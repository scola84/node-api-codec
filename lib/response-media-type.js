module.exports = (factory) => {
  return (request, response, next) => {
    try {
      response.setHeader('Content-Type', factory.type);
      response.setTransformer('Content-Type', factory
        .create(request, response));
      next();
    } catch (error) {
      next(new Error('415 ' + error.message));
    }
  };
};
