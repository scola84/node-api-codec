import { Transform } from 'stream';
import { Buffer } from 'buffer';

export default class MsgPackDecoder extends Transform {
  constructor() {
    super({
      objectMode: true
    });

    this._options = null;
  }

  options(value = null) {
    if (value === null) {
      return this._options;
    }

    this._options = value;
    return this;
  }

  _transform(data, encoding, callback) {
    try {
      if (typeof Blob !== 'undefined' && data instanceof Blob) {
        this._blob(data, callback);
      } else {
        this.push(this._options.decode(data));
        callback();
      }
    } catch (error) {
      callback(error);
    }
  }

  _blob(data, callback) {
    const reader = new FileReader();

    reader.addEventListener('error', () => {
      callback(new Error(reader.error));
    });

    reader.addEventListener('loadend', () => {
      if (reader.error) {
        callback(new Error(reader.error));
        return;
      }

      this.push(this._options.decode(Buffer.from(reader.result)));
      callback();
    });

    reader.readAsArrayBuffer(data);
  }
}
