import Encoder from '../encoder';

export default class JsonEncoder extends Encoder {
  _transform(data, encoding, callback) {
    try {
      this.push(JSON.stringify(data));
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
