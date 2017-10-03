import Negotiator from 'negotiator';
import MsgPackDecoder from './decoder';
import MsgPackEncoder from './encoder';

const type = 'application/msgpack';

function msgPackCodec(options = {}) {
  return {
    decoder(stream, connection, source = false) {
      return stream.pipe(new MsgPackDecoder()
        .connection(connection)
        .source(source)
        .options(options));
    },
    encoder(stream, connection, target = false) {
      return stream.pipe(new MsgPackEncoder()
        .connection(connection)
        .target(target)
        .options(options));
    },
    type
  };
}

function msgPackFilter(options = {}) {
  return (request, response, next) => {
    const header = request.header('Content-Type', true);

    if (header[0] === type) {
      request.codec(msgPackCodec(options));
    }

    if (request.header('Accept') !== null) {
      const negotiator = new Negotiator({
        headers: request.headers()
      });

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
