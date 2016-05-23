module.exports = {
  request: {
    encoding: require('./lib/request-encoding'),
    encodings: require('./lib/request-encodings'),
    mediaType: require('./lib/request-media-type'),
    mediaTypes: require('./lib/request-media-types')
  },
  response: {
    encoding: require('./lib/response-encoding'),
    encodings: require('./lib/response-encodings'),
    mediaType: require('./lib/response-media-type'),
    mediaTypes: require('./lib/response-media-types')
  }
};
