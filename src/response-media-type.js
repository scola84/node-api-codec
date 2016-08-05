import { ScolaError } from '@scola/error';

export default function responseMediaType(factory) {
  return (request, response, next) => {
    try {
      const transformer = factory.create(request, response);
      response.setHeader('Content-Type', factory.type);
      response.setTransformer('Content-Type', transformer);
    } catch (error) {
      next(new ScolaError('415 invalid_response ' + error.message));
      return;
    }

    next();
  };
}
