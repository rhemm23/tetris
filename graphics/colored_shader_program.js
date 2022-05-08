import ShaderProgram from './shader_program.js';

const vertexShaderSource = `
  attribute vec3 position;

  uniform mat4 projection;
  uniform mat4 model;

  void main() {
    gl_Position = projection * model * vec4(position, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 color;

  void main() {
    gl_FragColor = color;
  }
`;

export default class ColoredShaderProgram extends ShaderProgram {

  constructor(context) {

    super(context, vertexShaderSource, fragmentShaderSource);

    this.positionLocation = context.getAttribLocation(this.shaderProgram, 'position');

    this.projectionLocation = context.getUniformLocation(this.shaderProgram, 'projection');
    this.modelLocation = context.getUniformLocation(this.shaderProgram, 'model');
    this.colorLocation = context.getUniformLocation(this.shaderProgram, 'color');
  }

  setPositionBuffer(positionBuffer) {
    positionBuffer.bind();
    this.context.vertexAttribPointer(this.positionLocation, 3, this.context.FLOAT, false, 0, 0);
    this.context.enableVertexAttribArray(this.positionLocation);
  }

  setModelMatrix(modelMatrix) {
    this.context.uniformMatrix4fv(this.modelLocation, false, modelMatrix);
  }

  setProjectionMatrix(projectionMatrix) {
    this.context.uniformMatrix4fv(this.projectionLocation, false, projectionMatrix);
  }

  setColor(color) {
    this.context.uniform4fv(this.colorLocation, color);
  }
};
