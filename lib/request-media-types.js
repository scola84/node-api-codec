const wildcard = require('wildcard');

module.exports = (...codecs) => {
  const decoders = codecs.reduce((container, codec) => {
    container[codec.type] = codec.Decoder;
    return container;
  }, {});

  function find(type) {
    const keys = Object.keys(decoders);

    for (let i = 0; i < keys.length; i += 1) {
      if (wildcard(keys[i], type)) {
        return decoders[keys[i]];
      }
    }

    return null;
  }

  return (request, response, next) => {
    const type = request.getHeader('Content-Type');

    if (!type) {
      next();
      return;
    }

    const Decoder = decoders[type] || find(type);

    if (!Decoder) {
      response.setHeader('Accept', Object.keys(decoders).join(', '));
      next(new Error('406 Not Acceptable'));
      return;
    }

    request.setTransformer('Content-Type', new Decoder());
    next();
  };
};
