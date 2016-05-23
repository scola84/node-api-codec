module.exports = (codec) => {
  return (request, response, next) => {
    request.setTransformer('Content-Type', new codec.Decoder());
    next();
  };
};
