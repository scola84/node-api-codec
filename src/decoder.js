import { Transform } from 'stream';

export default class Decoder extends Transform {
  constructor() {
    super({
      objectMode: true
    });

    this._connection = null;
    this._source = null;
    this._options = {};
  }

  connection(value = null) {
    if (value === null) {
      return this._connection;
    }

    this._connection = value;
    return this;
  }

  source(value = null) {
    if (value === null) {
      return this._source;
    }

    this._source = value;
    return this;
  }

  options(value = null) {
    if (value === null) {
      return this._options;
    }

    this._options = value;
    return this;
  }

  option(name, value = null) {
    if (value === null) {
      return this._options[name];
    }

    this._options[name] = value;
    return this;
  }
}
