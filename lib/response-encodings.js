const Negotiator = require('negotiator');

module.exports = (...codecs) => {
  const encoders = codecs.reduce((container, codec) => {
    container[codec.encoding] = codec.Encoder;
    return container;
  }, {});

  return (request, response, next) => {
    if (!request.getHeader('Accept-Encoding')) {
      next();
      return;
    }

    const negotiator = new Negotiator(request);
    const encoding = negotiator.encoding(Object.keys(encoders));

    if (!encoding) {
      if (/identity/.test(request.getHeader('Accept-Encoding'))) {
        next();
      } else {
        next(new Error('415 Encoding ' + encoding + ' not supported'));
      }

      return;
    }

    const Encoder = encoders[encoding];
    response.setTransformer('Content-Encoding', new Encoder());
    response.setHeader('Content-Encoding', encoding);
    next();
  };
};
