import Decoder from '../decoder';

export default class FormDataDecoder extends Decoder {
  constructor() {
    super();
    this._decoder = null;
    this._data = {};
  }

  _transform(chunk, encoding, callback) {
    this._instance().write(chunk);
    callback();
  }

  _decoder() {
    if (this._decoder) {
      return this._decoder;
    }

    this._decoder = new this._options.Busboy(Object.assign({
      headers: this._request.headers()
    }, this._options));

    this._decoder.once('error', (error) => {
      this._decoder.removeAllListeners();
      this.emit('error', error);
    });

    this._decoder.addListener('field', (name, value) => {
      this._data[name] = value;
    });

    this._decoder.addListener('file', (name, fileStream, fileName,
      encoding, mimeType) => {

      fileStream.emit('end');
      this._data[name] = {
        fileStream,
        fileName,
        encoding,
        mimeType
      };
    });

    this._decoder.once('finish', () => {
      this._decoder.removeAllListeners();
      this.push(this._data);
    });

    return this._decoder;
  }
}
