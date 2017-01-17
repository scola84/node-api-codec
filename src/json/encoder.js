import { Transform } from 'stream';

export default class JsonEncoder extends Transform {
  constructor() {
    super({
      objectMode: true
    });
  }

  _transform(data, encoding, callback) {
    try {
      this.push(JSON.stringify(data));
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
