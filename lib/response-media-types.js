const Negotiator = require('negotiator');

module.exports = (...codecs) => {
  const encoders = codecs.reduce((container, codec) => {
    container[codec.type] = codec.Encoder;
    return container;
  }, {});

  return (request, response, next) => {
    if (!request.getHeader('Accept')) {
      next();
      return;
    }

    const negotiator = new Negotiator(request);
    const type = negotiator.mediaType(Object.keys(encoders));

    if (!type) {
      next(new Error('415 Media type ' + type + ' not supported'));
      return;
    }

    const Encoder = encoders[type];
    response.setTransformer('Content-Type', new Encoder());
    response.setHeader('Content-Type', type);
    next();
  };
};
