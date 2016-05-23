module.exports = (...codecs) => {
  const decoders = codecs.reduce((container, codec) => {
    container[codec.encoding] = codec.Decoder;
    return container;
  }, {});

  return (request, response, next) => {
    const encoding = request.getHeader('Content-Encoding');

    if (!encoding) {
      next();
      return;
    }

    const Decoder = decoders[encoding];

    if (!Decoder) {
      response.setHeader('Accept-Encoding', Object.keys(decoders).join(', '));
      next(new Error('406 Not Acceptable'));
      return;
    }

    request.setTransformer('Content-Encoding', new Decoder());
    next();
  };
};
