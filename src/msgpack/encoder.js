import Encoder from '../encoder';

export default class MsgPackEncoder extends Encoder {
  _transform(data, encoding, callback = () => {}) {
    try {
      this.push(this._options.msgpack.encode(data));
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
