const identityMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];

export default class Mat4 extends Float32Array {

  constructor(values = null) {
    if (values !== null) {
      super(values);
    } else {
      super(identityMatrix);
    }
  }

  multiply(operand) {
    let result = new Mat4();
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this[(row * 4) + k] * operand[(k * 4) + col];
        }
        result[(row * 4) + col] = sum;
      }
    }
    return result;
  }

  static translate(x, y, z) {
    return new Mat4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
  }

  static scale(x, y, z) {
    return new Mat4([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ]);
  }
}