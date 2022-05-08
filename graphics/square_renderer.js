import Buffer from "./buffer.js";

const vertices = [
  -0.5, -0.5, 0,
   0.5, -0.5, 0,
  -0.5,  0.5, 0,
  -0.5,  0.5, 0,
   0.5, -0.5, 0,
   0.5,  0.5, 0
];

export default class SquareRenderer {

  constructor(context, shaderProgram) {
    this.vertexBuffer = new Buffer(context, new Float32Array(vertices));
    this.shaderProgram = shaderProgram;
    this.context = context;
  }

  draw(square) {

    this.shaderProgram.use();
    this.shaderProgram.setModelMatrix(square.modelMatrix);
    this.shaderProgram.setPositionBuffer(this.vertexBuffer);
    this.shaderProgram.setColor(new Float32Array(square.color));

    this.context.drawArrays(this.context.TRIANGLES, 0, 6);
  }
};