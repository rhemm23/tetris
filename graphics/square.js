import Mat4 from '../core/mat4.js';

export default class Square {

  constructor(position, size, color) {
    this.modelMatrix = this.calculateModelMatrix(position, size);
    this.color = color;
  }

  calculateModelMatrix(position, size) {
    let translationMatrix = Mat4.translate(
      position[0] / size[0],
      position[1] / size[1],
      position[2]
    );
    let scaleMatrix = Mat4.scale(size[0], size[1], 1.0);
    return translationMatrix.multiply(scaleMatrix);
  }
}
