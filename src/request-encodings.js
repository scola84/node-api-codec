function handle(factories, request, response) {
  const encoding = request.getHeader('Content-Encoding');

  if (!encoding) {
    return;
  }

  const factory = factories[encoding];

  if (!factory) {
    const header = Object.keys(factories).join(', ');
    response.setHeader('Accept-Encoding', header);

    throw new Error('Encoding ' + encoding + ' not acceptable');
  }

  const transformer = factory.create(request, response);
  request.setTransformer('Content-Encoding', transformer);
}

export default function requestEncodings(...factories) {
  factories = factories.reduce((container, factory) => {
    container[factory.encoding] = factory;
    return container;
  }, {});

  return (request, response, next) => {
    try {
      handle(factories, request, response);
    } catch (error) {
      next(new Error('406 invalid_request ' + error.message));
      return;
    }

    next();
  };
}
