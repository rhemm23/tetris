import ShaderProgram from "./shader_program.js";

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texcoord;

  uniform mat4 u_projection;
  uniform mat4 u_model;

  varying vec2 v_texcoord;

  void main() {
    v_texcoord = a_texcoord;
    gl_Position = u_projection * u_model * vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;

export default class TextShaderProgram extends ShaderProgram {

  constructor(context) {

    super(context, vertexShaderSource, fragmentShaderSource);

    this.positionLocation = context.getAttribLocation(this.shaderProgram, 'a_position');
    this.textureCoordLocation = context.getAttribLocation(this.shaderProgram, 'a_texcoord');

    this.projectionLocation = context.getUniformLocation(this.shaderProgram, 'u_projection');
    this.textureLocation = context.getUniformLocation(this.shaderProgram, 'u_texture');
    this.modelLocation = context.getUniformLocation(this.shaderProgram, 'u_model');
  }

  bindPositionBuffer(positionBuffer) {
    this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer.buffer);
    this.context.vertexAttribPointer(this.positionLocation, 2, this.context.FLOAT, false, 0, 0);
    this.context.enableVertexAttribArray(this.positionLocation);
  }

  bindTexCoordBuffer(texCoordBuffer) {
    this.context.bindBuffer(this.context.ARRAY_BUFFER, texCoordBuffer.buffer);
    this.context.vertexAttribPointer(this.textureCoordLocation, 2, this.context.FLOAT, false, 0, 0);
    this.context.enableVertexAttribArray(this.textureCoordLocation);
  }

  setProjectionMatrix(projectionMatrix) {
    this.context.uniformMatrix4fv(this.projectionLocation, false, projectionMatrix);
  }

  setModelMatrix(modelMatrix) {
    this.context.uniformMatrix4fv(this.modelLocation, false, modelMatrix);
  }

  setTexture(texture) {
    this.context.uniform1i(this.textureLocation, texture);
  }
};
