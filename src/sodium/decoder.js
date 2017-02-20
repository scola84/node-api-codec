import Decoder from '../decoder';

export default class SodiumDecoder extends Decoder {
  _transform(data, encoding, callback = () => {}) {
    data = Buffer.from(data);

    const sodium = this._options.sodium;
    const sharedKey = this._connection.upgrade().sharedKey;
    const nonce = data.slice(0, 24);

    data = data.slice(24);
    data = sodium.crypto_box_open_easy_afternm(data, nonce, sharedKey);

    this.push(data);
    callback();
  }
}
