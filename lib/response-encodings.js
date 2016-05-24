const Negotiator = require('negotiator');

module.exports = (...factories) => {
  factories = factories.reduce((container, factory) => {
    container[factory.encoding] = factory;
    return container;
  }, {});

  function handle(request, response, next) {
    if (!request.getHeader('Accept-Encoding')) {
      next();
      return;
    }

    const negotiator = new Negotiator(request);
    const encoding = negotiator.encoding(Object.keys(factories));

    if (!encoding) {
      if (/identity/.test(request.getHeader('Accept-Encoding'))) {
        next();
      } else {
        throw new Error('Encoding ' + encoding + ' not supported');
      }

      return;
    }

    const factory = factories[encoding];

    response.setHeader('Content-Encoding', factory.encoding);
    response.setTransformer('Content-Encoding',
      factory.create(request, response));
    next();
  }

  return (request, response, next) => {
    try {
      handle(request, response, next);
    } catch (error) {
      next(new Error('415 ' + error.message));
    }
  };
};
