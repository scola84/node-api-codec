import { ScolaError } from '@scola/core';

export default function responseEncoding(factory) {
  return (request, response, next) => {
    try {
      const transformer = factory.create(request, response);
      response.header('Content-Encoding', factory.encoding);
      response.transformer('Content-Encoding', transformer);
    } catch (error) {
      next(new ScolaError('415 invalid_response ' + error.message));
      return;
    }

    next();
  };
}
