import { Transform } from 'stream';

export default class MsgPackEncoder extends Transform {
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
      this.push(this._options.encode(data));
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
