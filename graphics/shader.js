export default class Shader {

  constructor(context, type, source) {

    this.shader = context.createShader(type);
    this.context = context;

    context.shaderSource(this.shader, source);
    context.compileShader(this.shader);

    if (!context.getShaderParameter(this.shader, context.COMPILE_STATUS)) {
      throw 'Failed to compile shader: ' + context.getShaderInfoLog(this.shader);
    }
  }

  destroy() {
    this.context.deleteShader(this.shader);
  }
};