export default function responseEncoding(factory) {
  return (request, response, next) => {
    try {
      const transformer = factory.create(request, response);
      response.setHeader('Content-Encoding', factory.encoding);
      response.setTransformer('Content-Encoding', transformer);
    } catch (error) {
      next(new Error('415 invalid_response ' + error.message));
      return;
    }

    next();
  };
}
