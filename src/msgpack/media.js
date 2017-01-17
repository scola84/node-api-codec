import Negotiator from 'negotiator';
import Decoder from './decoder';
import Encoder from './encoder';

const type = 'application/msgpack';

export function msgpackCodec(options) {
  return {
    decoder() {
      return new Decoder()
        .options(options);
    },
    encoder() {
      return new Encoder()
        .options(options);
    },
    type
  };
}

export function msgpackFilter(options) {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.transformer('Content-Type', new Decoder()
        .options(options));
    }

    if (request.header('Accept')) {
      const negotiator = new Negotiator(request);

      if (negotiator.mediaType([type]) === type) {
        response.header('Content-Type', type);
        response.transformer('Content-Type', new Encoder()
          .options(options));
      }
    }

    next();
  };
}
