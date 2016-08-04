import wildcard from 'wildcard';

function find(factories, type) {
  const keys = Object.keys(factories);

  for (let i = 0; i < keys.length; i += 1) {
    if (wildcard(keys[i], type)) {
      return factories[keys[i]];
    }
  }

  return null;
}

function handle(factories, request, response) {
  const type = request.getHeader('Content-Type', true);

  if (!type) {
    return;
  }

  const factory = factories[type[0]] || find(factories, type[0]);

  if (!factory) {
    const header = Object.keys(factories).join(', ');
    response.setHeader('Accept', header);

    throw new Error('Media type ' + type[0] + ' not acceptable');
  }

  const transformer = factory.create(request, response);
  request.setTransformer('Content-Type', transformer);
}

export default function requestMediaTypes(...factories) {
  factories = factories.reduce((container, factory) => {
    container[factory.type] = factory;
    return container;
  }, {});

  return (request, response, next) => {
    try {
      handle(factories, request, response);
    } catch (error) {
      next(new Error('406 ' + error.message));
      return;
    }

    next();
  };
}
