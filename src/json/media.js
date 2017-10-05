import Negotiator from 'negotiator';
import JsonDecoder from './decoder';
import JsonEncoder from './encoder';

const type = 'application/json';

function jsonCodec(options = {}) {
  return {
    decoder(stream, connection, source = false) {
      return stream.pipe(new JsonDecoder()
        .connection(connection)
        .source(source)
        .options(options));
    },
    encoder(stream, connection, target = false) {
      return stream.pipe(new JsonEncoder()
        .connection(connection)
        .target(target)
        .options(options));
    },
    type
  };
}

function jsonFilter(options = {}) {
  return (request, response, next) => {
    const header = request.header('Content-Type', true);

    if (header[0] === type) {
      request.codec(jsonCodec(options));
    }

    if (request.header('Accept') !== null) {
      const negotiator = new Negotiator({
        headers: request.headers()
      });

      if (negotiator.mediaType([type]) === type) {
        response.header('Content-Type', type);
        response.codec(jsonCodec(options));
      }
    }

    next();
  };
}

export {
  jsonCodec,
  jsonFilter
};
