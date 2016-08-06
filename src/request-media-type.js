import { ScolaError } from '@scola/error';

export default function requestMediaType(factory) {
  return (request, response, next) => {
    try {
      const transformer = factory.create(request, response);
      request.transformer('Content-Type', transformer);
    } catch (error) {
      next(new ScolaError('406 invalid_request ' + error.message));
      return;
    }

    next();
  };
}
