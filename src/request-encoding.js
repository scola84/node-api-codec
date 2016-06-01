export default function requestEncoding(factory) {
  return (request, response, next) => {
    try {
      const transformer = factory.create(request, response);
      request.setTransformer('Content-Encoding', transformer);
    } catch (error) {
      next(new Error('406 ' + error.message));
      return;
    }

    next();
  };
}
