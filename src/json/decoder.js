import Decoder from '../decoder';

function reviver(key, value) {
  if (value && value.type === 'Buffer') {
    return Buffer.from(value.data);
  }

  return value;
}

export default class JsonDecoder extends Decoder {
  _transform(data, encoding, callback) {
    try {
      this.push(JSON.parse(data, reviver));
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
