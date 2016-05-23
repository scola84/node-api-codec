module.exports = (codec) => {
  return (request, response, next) => {
    response.setTransformer('Content-Encoding', new codec.Encoder());
    response.setHeader('Content-Encoding', codec.encoding);
    next();
  };
};
