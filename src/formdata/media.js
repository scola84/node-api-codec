import FormDataDecoder from './decoder';

const type = 'multipart/form-data';

function formDataCodec(options = {}) {
  return {
    decoder(stream, connection, request = {}) {
      return stream.pipe(new FormDataDecoder()
        .connection(connection)
        .request(request)
        .options(options));
    }
  };
}

function formDataFilter(options = {}) {
  return (request, response, next) => {
    if (request.header('Content-Type') === type) {
      request.codec(formDataCodec(options));
    }

    next();
  };
}

export {
  formDataCodec,
  formDataFilter
};
