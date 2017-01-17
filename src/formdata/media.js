import Decoder from './decoder';

const type = 'multipart/form-data';

export function formdataCodec(options) {
  return {
    decoder(request) {
      return new Decoder()
        .options(options)
        .request(request);
    },
    type
  };
}

export function formdataFilter(options) {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.transformer('Content-Type', new Decoder()
        .options(options)
        .request(request));
    }

    next();
  };
}
