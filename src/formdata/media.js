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
    const header = request.header('Content-Type', true);

    if (header[0] === type) {
      request.codec(formDataCodec(options));
    }

    next();
  };
}

export {
  formDataCodec,
  formDataFilter
};
