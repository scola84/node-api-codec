import { Transform } from 'stream';

export default class Decoder extends Transform {
  constructor() {
    super({
      objectMode: true
    });

    this._connection = null;
    this._request = null;
    this._options = null;
  }

  connection(value = null) {
    if (value === null) {
      return this._connection;
    }

    this._connection = value;
    return this;
  }

  request(value = null) {
    if (value === null) {
      return this._request;
    }

    this._request = value;
    return this;
  }

  options(value = null) {
    if (value === null) {
      return this._options;
    }

    this._options = value;
    return this;
  }
}
