import Shader from './shader.js';

export default class ShaderProgram {

  constructor(context, vertexShaderSource, fragmentShaderSource) {

    this.vertexShader = new Shader(context, context.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = new Shader(context, context.FRAGMENT_SHADER, fragmentShaderSource);

    this.shaderProgram = context.createProgram();
    this.context = context;

    context.attachShader(this.shaderProgram, this.vertexShader.shader);
    context.attachShader(this.shaderProgram, this.fragmentShader.shader);
    context.linkProgram(this.shaderProgram);

    if (!context.getProgramParameter(this.shaderProgram, context.LINK_STATUS)) {
      throw 'Failed to link shader program: ' + context.getProgramInfoLog(this.shaderProgram);
    }
  }

  use() {
    this.context.useProgram(this.shaderProgram);
  }
  
  destroy() {
  
    this.context.detachShader(this.shaderProgram, this.vertexShader.shader);
    this.context.detachShader(this.shaderProgram, this.fragmentShader.shader);
  
    this.vertexShader.destroy();
    this.fragmentShader.destroy();
  
    this.context.deleteProgram(this.shaderProgram);
  }
};