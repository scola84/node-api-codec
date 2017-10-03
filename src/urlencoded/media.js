import UrlEncodedDecoder from './decoder';

const type = 'application/x-www-form-urlencoded';

function urlEncodedCodec(options = {}) {
  return {
    decoder(stream, connection, source = false) {
      return stream.pipe(new UrlEncodedDecoder()
        .connection(connection)
        .source(source)
        .options(options));
    }
  };
}

function urlEncodedFilter(options = {}) {
  return (request, response, next) => {
    const header = request.header('Content-Type', true);

    if (header[0] === type) {
      request.codec(urlEncodedCodec(options));
    }

    next();
  };
}

export {
  urlEncodedCodec,
  urlEncodedFilter
};
