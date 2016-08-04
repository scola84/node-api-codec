import Negotiator from 'negotiator';

function handle(factories, request, response) {
  if (!request.getHeader('Accept')) {
    return;
  }

  const negotiator = new Negotiator(request);
  const type = negotiator.mediaType(Object.keys(factories));

  if (!type) {
    throw new Error('Media type ' + type + ' not supported');
  }

  const factory = factories[type];
  const transformer = factory.create(request, response);

  response.setHeader('Content-Type', factory.type);
  response.setTransformer('Content-Type', transformer);
}

export default function responseMediaTypes(...factories) {
  factories = factories.reduce((container, factory) => {
    container[factory.type] = factory;
    return container;
  }, {});

  return (request, response, next) => {
    try {
      handle(factories, request, response);
    } catch (error) {
      next(new Error('415 invalid_response ' + error.message));
      return;
    }

    next();
  };
}
