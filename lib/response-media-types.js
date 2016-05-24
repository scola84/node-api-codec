const Negotiator = require('negotiator');

module.exports = (...factories) => {
  factories = factories.reduce((container, factory) => {
    container[factory.type] = factory;
    return container;
  }, {});

  function handle(request, response, next) {
    if (!request.getHeader('Accept')) {
      next();
      return;
    }

    const negotiator = new Negotiator(request);
    const type = negotiator.mediaType(Object.keys(factories));

    if (!type) {
      throw new Error('Media type ' + type + ' not supported');
    }

    const factory = factories[type];

    response.setHeader('Content-Type', factory.type);
    response.setTransformer('Content-Type', factory.create(request, response));
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
