import ShaderProgram from './shader_program.js';

const vertexShaderSource = `
  attribute vec3 position;
  attribute vec2 texcoord;

  uniform mat4 projection;
  uniform mat4 model;

  varying vec2 v_texcoord;

  void main() {
    v_texcoord = texcoord;
    gl_Position = projection * model * vec4(position, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  uniform vec4 color;

  varying vec2 v_texcoord;

  void main() {

    float dark = min(1.0 - v_texcoord.s, v_texcoord.t);
    float light = min(1.0 - v_texcoord.t, v_texcoord.s);

    if (dark < 0.1 || light < 0.1) {
      if (dark < light) {
        gl_FragColor = mix(color, vec4(0, 0, 0, 1), 0.6);
      } else {
        gl_FragColor = mix(color, vec4(1, 1, 1, 1), 0.6);
      }
    } else {
      gl_FragColor = color;
    }
  }
`;

export default class ColoredShaderProgram extends ShaderProgram {

  constructor(context) {

    super(context, vertexShaderSource, fragmentShaderSource);

    this.positionLocation = context.getAttribLocation(this.shaderProgram, 'position');
    this.texCoordLocation = context.getAttribLocation(this.shaderProgram, 'texcoord');

    this.projectionLocation = context.getUniformLocation(this.shaderProgram, 'projection');
    this.modelLocation = context.getUniformLocation(this.shaderProgram, 'model');
    this.colorLocation = context.getUniformLocation(this.shaderProgram, 'color');
  }

  setTexCoordBuffer(texCoordBuffer) {
    texCoordBuffer.bind();
    this.context.vertexAttribPointer(this.texCoordLocation, 2, this.context.FLOAT, false, 0, 0);
    this.context.enableVertexAttribArray(this.texCoordLocation);
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
