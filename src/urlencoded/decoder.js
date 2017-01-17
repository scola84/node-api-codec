import { Transform } from 'stream';

export default class UrlDecoder extends Transform {
  constructor() {
    super({
      objectMode: true
    });

    this._options = null;
    this._data = '';
  }

  options(value = null) {
    if (value === null) {
      return this._options;
    }

    this._options = value;
    return this;
  }

  _transform(data, encoding, callback) {
    this._data += data;
    callback();
  }

  _flush(callback) {
    try {
      this.push(this._options.decode(this._data));
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
