module.exports = (codec) => {
  return (request, response, next) => {
    response.setTransformer('Content-Type', new codec.Encoder());
    response.setHeader('Content-Type', codec.type);
    next();
  };
};
