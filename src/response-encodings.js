import Negotiator from 'negotiator';
import { ScolaError } from '@scola/core';

function handle(factories, request, response) {
  if (!request.header('Accept-Encoding')) {
    return;
  }

  const negotiator = new Negotiator(request);
  const encoding = negotiator.encoding(Object.keys(factories));

  if (!encoding) {
    if (!(/identity/.test(request.header('Accept-Encoding')))) {
      throw new Error('Encoding ' + encoding + ' not supported');
    }

    return;
  }

  const factory = factories[encoding];
  const transformer = factory.create(request, response);

  response.header('Content-Encoding', factory.encoding);
  response.transformer('Content-Encoding', transformer);
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
      next(new ScolaError('415 invalid_response ' + error.message));
      return;
    }

    next();
  };
}
