import SodiumDecoder from './decoder';
import SodiumEncoder from './encoder';

const type = 'x-application/sodium';

function sodiumCodec(options = {}) {
  return {
    decoder(stream, connection, request = {}) {
      return stream.pipe(new SodiumDecoder()
        .connection(connection)
        .request(request)
        .options(options));
    },
    encoder(stream, connection) {
      return stream.pipe(new SodiumEncoder()
        .connection(connection)
        .options(options));
    },
    type
  };
}

export {
  sodiumCodec
};
