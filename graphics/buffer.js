export default class Buffer {

  constructor(context, vertices) {
    
    this.buffer = context.createBuffer();
    this.context = context;

    context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
    context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);
  }

  bind() {
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
  }

  destroy() {
    this.context.deleteBuffer(this.buffer);
  }
};
