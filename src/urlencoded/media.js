import Decoder from './decoder';

const type = 'application/x-www-form-urlencoded';

export function urlencodedCodec(options) {
  return {
    decoder() {
      return new Decoder()
        .options(options);
    },
    type
  };
}

export function urlencodedFilter(options) {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.transformer('Content-Type', new Decoder()
        .options(options));
    }

    next();
  };
}
