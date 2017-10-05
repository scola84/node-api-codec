import Encoder from '../encoder';

export default class JsonEncoder extends Encoder {
  _transform(data, encoding, callback = () => {}) {
    try {
      data = JSON.stringify(data);
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
