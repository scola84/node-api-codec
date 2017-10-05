import { Transform } from 'stream';

export default class Encoder extends Transform {
  constructor() {
    super({
      objectMode: true
    });

    this._connection = null;
    this._target = null;
    this._options = {};
  }

  connection(value = null) {
    if (value === null) {
      return this._connection;
    }

    this._connection = value;
    return this;
  }

  target(value = null) {
    if (value === null) {
      return this._target;
    }

    this._target = value;
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
