import Buffer from "./buffer.js";

const vertices = [
  -0.5, -0.5, 0,
   0.5, -0.5, 0,
  -0.5,  0.5, 0,
  -0.5,  0.5, 0,
   0.5, -0.5, 0,
   0.5,  0.5, 0
];
const texCoords = [
  0.0, 0.0,
  1.0, 0.0,
  0.0, 1.0,
  0.0, 1.0,
  1.0, 0.0,
  1.0, 1.0
];

export default class SquareRenderer {

  constructor(context, shaderProgram) {
    this.texCoordBuffer = new Buffer(context, new Float32Array(texCoords));
    this.vertexBuffer = new Buffer(context, new Float32Array(vertices));
    this.shaderProgram = shaderProgram;
    this.context = context;
  }

  draw(modelMatrix, color) {

    this.shaderProgram.use();
    this.shaderProgram.setModelMatrix(modelMatrix);
    this.shaderProgram.setPositionBuffer(this.vertexBuffer);
    this.shaderProgram.setTexCoordBuffer(this.texCoordBuffer);
    this.shaderProgram.setColor(new Float32Array(color));

    this.context.drawArrays(this.context.TRIANGLES, 0, 6);
  }
};