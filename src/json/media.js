import Negotiator from 'negotiator';
import JsonDecoder from './decoder';
import JsonEncoder from './encoder';

const type = 'application/json';

function jsonCodec() {
  return {
    decoder(stream, connection, request = {}) {
      return stream.pipe(new JsonDecoder()
        .connection(connection)
        .request(request));
    },
    encoder(stream, connection) {
      return stream.pipe(new JsonEncoder()
        .connection(connection));
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
      const negotiator = new Negotiator(request);

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
