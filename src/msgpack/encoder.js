import Encoder from '../encoder';

export default class MsgPackEncoder extends Encoder {
  _transform(data, encoding, callback = () => {}) {
    try {
      data = this._options.msgpack.encode(data);
    } catch (error) {
      callback(error);
      return;
    }

    const setLength =
      this._options.length === true &&
      Boolean(this._target) === true;

    if (setLength === true) {
      this._target.header('Content-Length', data.length);
    }

    this.push(data);
    callback();
  }
}
