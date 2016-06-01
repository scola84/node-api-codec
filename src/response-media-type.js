export default function responseMediaType(factory) {
  return (request, response, next) => {
    try {
      const transformer = factory.create(request, response);
      response.setHeader('Content-Type', factory.type);
      response.setTransformer('Content-Type', transformer);
    } catch (error) {
      next(new Error('415 ' + error.message));
      return;
    }

    next();
  };
}
