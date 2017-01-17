import Negotiator from 'negotiator';
import Decoder from './decoder';
import Encoder from './encoder';

const type = 'application/json';

export function jsonCodec() {
  return {
    decoder() {
      return new Decoder();
    },
    encoder() {
      return new Encoder();
    },
    type
  };
}

export function jsonFilter() {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.transformer('Content-Type', new Decoder());
    }

    if (request.header('Accept')) {
      const negotiator = new Negotiator(request);

      if (negotiator.mediaType([type]) === type) {
        response.header('Content-Type', type);
        response.transformer('Content-Type', new Encoder());
      }
    }

    next();
  };
}
