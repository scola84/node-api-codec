import Decoder from '../decoder';

export default class FormDataDecoder extends Decoder {
  constructor() {
    super();

    this._decoder = null;
    this._data = {};

    this._handleError = (e) => this._error(e);
    this._handleField = (n, v) => this._field(n, v);
    this._handleFile = (n, fs, fn, e, m) => this._file(n, fs, fn, e, m);
    this._handleFinish = () => this._finish();
  }

  _transform(data, encoding, callback = () => {}) {
    try {
      this._setUp().write(data);
      callback();
    } catch (error) {
      callback(error);
    }
  }

  _flush() {
    this.push(this._data);
  }

  _bindDecoder() {
    if (this._decoder) {
      this._decoder.setMaxListeners(this._decoder.getMaxListeners() + 1);
      this._decoder.on('error', this._handleError);
      this._decoder.on('field', this._handleField);
      this._decoder.on('file', this._handleFile);
      this._decoder.on('finish', this._handleFinish);
    }
  }

  _unbindDecoder() {
    if (this._decoder) {
      this._decoder.setMaxListeners(this._decoder.getMaxListeners() - 1);
      this._decoder.removeListener('error', this._handleError);
      this._decoder.removeListener('field', this._handleField);
      this._decoder.removeListener('file', this._handleFile);
      this._decoder.removeListener('finish', this._handleFinish);
    }
  }

  _setUp() {
    if (this._decoder) {
      return this._decoder;
    }

    this._decoder = new this._options.Busboy(Object.assign({
      headers: this._source.headers()
    }, this._options));

    this._bindDecoder();
    return this._decoder;
  }

  _tearDown() {
    this._unbindDecoder();
  }

  _error(error) {
    this._tearDown();
    this.emit('error', error);
  }

  _field(name, value) {
    this._data[name] = value;
  }

  _file(name, fileStream, fileName, encoding, mimeType) {
    this._data[name] = {
      fileStream,
      fileName,
      encoding,
      mimeType
    };
  }

  _finish() {
    this.push(null);
    this._tearDown();
  }
}
