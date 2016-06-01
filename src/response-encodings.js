import Negotiator from 'negotiator';

function handle(factories, request, response) {
  if (!request.getHeader('Accept-Encoding')) {
    return;
  }

  const negotiator = new Negotiator(request);
  const encoding = negotiator.encoding(Object.keys(factories));

  if (!encoding) {
    if (!(/identity/.test(request.getHeader('Accept-Encoding')))) {
      throw new Error('Encoding ' + encoding + ' not supported');
    }

    return;
  }

  const factory = factories[encoding];
  const transformer = factory.create(request, response);

  response.setHeader('Content-Encoding', factory.encoding);
  response.setTransformer('Content-Encoding', transformer);
}

export default function responseEncodings(...factories) {
  factories = factories.reduce((container, factory) => {
    container[factory.encoding] = factory;
    return container;
  }, {});

  return (request, response, next) => {
    try {
      handle(factories, request, response);
    } catch (error) {
      next(new Error('415 ' + error.message));
      return;
    }

    next();
  };
}
