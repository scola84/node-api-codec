import UrlEncodedDecoder from './decoder';

const type = 'application/x-www-form-urlencoded';

function urlEncodedCodec(options = {}) {
  return {
    decoder(stream, connection, request = {}) {
      return stream.pipe(new UrlEncodedDecoder()
        .connection(connection)
        .request(request)
        .options(options));
    }
  };
}

function urlEncodedFilter(options = {}) {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.codec(urlEncodedCodec(options));
    }

    next();
  };
}

export {
  urlEncodedCodec,
  urlEncodedFilter
};
