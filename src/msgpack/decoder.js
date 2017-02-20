import { Buffer } from 'buffer';
import Decoder from '../decoder';

export default class MsgPackDecoder extends Decoder {
  _transform(data, encoding, callback = () => {}) {
    try {
      if (typeof Blob !== 'undefined' && data instanceof Blob) {
        this._blob(data, callback);
      } else {
        this.push(this._options.msgpack.decode(data));
        callback();
      }
    } catch (error) {
      callback(error);
    }
  }

  _blob(data, callback = () => {}) {
    const reader = new FileReader();
    const msgpack = this._options.msgpack;

    reader.addEventListener('error', () => {
      callback(new Error(reader.error));
    });

    reader.addEventListener('loadend', () => {
      if (reader.error) {
        callback(new Error(reader.error));
        return;
      }

      this.push(msgpack.decode(Buffer.from(reader.result)));
      callback();
    });

    reader.readAsArrayBuffer(data);
  }
}
