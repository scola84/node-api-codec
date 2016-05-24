const wildcard = require('wildcard');

module.exports = (...factories) => {
  factories = factories.reduce((container, factory) => {
    container[factory.type] = factory;
    return container;
  }, {});

  function find(type) {
    const keys = Object.keys(factories);

    for (let i = 0; i < keys.length; i += 1) {
      if (wildcard(keys[i], type)) {
        return factories[keys[i]];
      }
    }

    return null;
  }

  function handle(request, response, next) {
    const type = request.getHeader('Content-Type', true);

    if (!type) {
      next();
      return;
    }

    const factory = factories[type[0]] || find(type[0]);

    if (!factory) {
      response.setHeader('Accept', Object.keys(factories).join(', '));
      throw new Error('Media type ' + type[0] + ' is not acceptable');
    }

    request.setTransformer('Content-Type', factory.create(request, response));
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
