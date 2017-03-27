import Negotiator from 'negotiator';
import MsgPackDecoder from './decoder';
import MsgPackEncoder from './encoder';

const type = 'application/msgpack';

function msgPackCodec(options = {}) {
  return {
    decoder(stream, connection, request = {}) {
      return stream.pipe(new MsgPackDecoder()
        .connection(connection)
        .request(request)
        .options(options));
    },
    encoder(stream, connection) {
      return stream.pipe(new MsgPackEncoder()
        .connection(connection)
        .options(options));
    },
    type
  };
}

function msgPackFilter(options = {}) {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.codec(msgPackCodec(options));
    }

    if (request.header('Accept') !== null) {
      const negotiator = new Negotiator(request);

      if (negotiator.mediaType([type]) === type) {
        response.header('Content-Type', type);
        response.codec(msgPackCodec(options));
      }
    }

    next();
  };
}

export {
  msgPackCodec,
  msgPackFilter
};
