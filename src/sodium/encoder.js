import Encoder from '../encoder';

export default class SodiumEncoder extends Encoder {
  _transform(data, encoding, callback = () => {}) {
    const sodium = this._options.sodium;
    const sharedKey = this._connection.key();
    const nonce = Buffer.allocUnsafe(sodium.crypto_box_NONCEBYTES);

    sodium.randombytes_buf(nonce);

    data = Buffer.from(data);
    data = sodium.crypto_box_easy_afternm(data, nonce, sharedKey);
    data = Buffer.concat([nonce, data], nonce.length + data.length);

    const setLength =
      this._options.length === true &&
      Boolean(this._target) === true;

    if (setLength === true) {
      this._target.header('Content-Length', data.length);
    }

    if (this._options.push !== false) {
      this.push(data);
    }

    callback();
  }
}
