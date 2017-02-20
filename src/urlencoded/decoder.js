import Decoder from '../decoder';

export default class UrlEncodedDecoder extends Decoder {
  constructor() {
    super();
    this._data = '';
  }

  _transform(data, encoding, callback = () => {}) {
    this._data += data;
    callback();
  }

  _flush(callback = () => {}) {
    try {
      this.push(this._options.decode(this._data));
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
