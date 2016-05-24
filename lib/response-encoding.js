module.exports = (factory) => {
  return (request, response, next) => {
    try {
      response.setHeader('Content-Encoding', factory.encoding);
      response.setTransformer('Content-Encoding',
        factory.create(request, response));
      next();
    } catch (error) {
      next(new Error('415 ' + error.message));
    }
  };
};
