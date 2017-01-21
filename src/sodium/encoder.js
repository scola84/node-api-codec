import Encoder from '../encoder';

export default class SodiumEncoder extends Encoder {
  _transform(data, encoding, callback) {
    const sodium = this._options.sodium;
    const sharedKey = this._connection.upgrade().sharedKey;
    const nonce = Buffer.allocUnsafe(sodium.crypto_box_NONCEBYTES);

    sodium.randombytes_buf(nonce);

    data = Buffer.from(data);
    data = sodium.crypto_box_easy_afternm(data, nonce, sharedKey);
    data = Buffer.concat([nonce, data], nonce.length + data.length);

    this.push(data);
    callback();
  }
}
