module.exports = (...factories) => {
  factories = factories.reduce((container, factory) => {
    container[factory.encoding] = factory;
    return container;
  }, {});

  function handle(request, response, next) {
    const encoding = request.getHeader('Content-Encoding');

    if (!encoding) {
      next();
      return;
    }

    const factory = factories[encoding];

    if (!factory) {
      response.setHeader('Accept-Encoding',
        Object.keys(factories).join(', '));

      throw new Error('Encoding ' + encoding + ' not acceptable');
    }

    request.setTransformer('Content-Encoding',
      factory.create(request, response));

    next();
  }

  return (request, response, next) => {
    try {
      handle(request, response, next);
    } catch (error) {
      next(new Error('406 ' + error.message));
    }
  };
};
