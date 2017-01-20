import Negotiator from 'negotiator';
import JsonDecoder from './decoder';
import JsonEncoder from './encoder';

const type = 'application/json';

export function jsonCodec() {
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

export function jsonFilter() {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.codec(jsonCodec());
    }

    if (request.header('Accept')) {
      const negotiator = new Negotiator(request);

      if (negotiator.mediaType([type]) === type) {
        response.header('Content-Type', type);
        response.codec(jsonCodec());
      }
    }

    next();
  };
}
