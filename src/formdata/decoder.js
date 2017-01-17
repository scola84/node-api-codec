import { Transform } from 'stream';

export default class FormDataDecoder extends Transform {
  constructor() {
    super({
      objectMode: true
    });

    this._options = null;
    this._request = null;
    this._instance = null;
    this._data = {};
  }

  options(value = null) {
    if (value === null) {
      return this._options;
    }

    this._options = value;
    return this;
  }

  request(value = null) {
    if (value === null) {
      return this._request;
    }

    this._request = value;
    return this;
  }

  _transform(chunk, encoding, callback) {
    this._decoder().write(chunk);
    callback();
  }

  _decoder() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new this._options.Busboy(Object.assign({
      headers: this._request.headers()
    }, this._options));

    this._instance.once('error', (error) => {
      this._instance.removeAllListeners();
      this.emit('error', error);
    });

    this._instance.addListener('field', (name, value) => {
      this._data[name] = value;
    });

    this._instance.addListener('file', (name, fileStream, fileName,
      encoding, mimeType) => {

      fileStream.emit('end');
      this._data[name] = {
        fileStream,
        fileName,
        encoding,
        mimeType
      };
    });

    this._instance.once('finish', () => {
      this._instance.removeAllListeners();
      this.push(this._data);
    });

    return this._instance;
  }
}
