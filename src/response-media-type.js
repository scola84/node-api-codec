import { ScolaError } from '@scola/error';

export default function responseMediaType(factory) {
  return (request, response, next) => {
    try {
      const transformer = factory.create(request, response);
      response.header('Content-Type', factory.type);
      response.transform('Content-Type', transformer);
    } catch (error) {
      next(new ScolaError('415 invalid_response ' + error.message));
      return;
    }

    next();
  };
}
