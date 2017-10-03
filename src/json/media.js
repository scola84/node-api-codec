import Negotiator from 'negotiator';
import JsonDecoder from './decoder';
import JsonEncoder from './encoder';

const type = 'application/json';

function jsonCodec() {
  return {
    decoder(stream, connection, source = false) {
      return stream.pipe(new JsonDecoder()
        .connection(connection)
        .source(source));
    },
    encoder(stream, connection, target = false) {
      return stream.pipe(new JsonEncoder()
        .connection(connection)
        .target(target));
    },
    type
  };
}

function jsonFilter() {
  return (request, response, next) => {
    const header = request.header('Content-Type', true);

    if (header[0] === type) {
      request.codec(jsonCodec());
    }

    if (request.header('Accept') !== null) {
      const negotiator = new Negotiator({
        headers: request.headers()
      });

      if (negotiator.mediaType([type]) === type) {
        response.header('Content-Type', type);
        response.codec(jsonCodec());
      }
    }

    next();
  };
}

export {
  jsonCodec,
  jsonFilter
};
