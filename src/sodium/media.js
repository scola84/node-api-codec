import SodiumDecoder from './decoder';
import SodiumEncoder from './encoder';

const type = 'x-application/sodium';

function sodiumCodec(options = {}) {
  return {
    decoder(stream, connection, source = false) {
      return stream.pipe(new SodiumDecoder()
        .connection(connection)
        .source(source)
        .options(options));
    },
    encoder(stream, connection, target = false) {
      return stream.pipe(new SodiumEncoder()
        .connection(connection)
        .target(target)
        .options(options));
    },
    type
  };
}

export {
  sodiumCodec
};
