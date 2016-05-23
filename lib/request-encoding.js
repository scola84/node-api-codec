module.exports = (codec) => {
  return (request, response, next) => {
    request.setTransformer('Content-Encoding', new codec.Decoder());
    next();
  };
};
