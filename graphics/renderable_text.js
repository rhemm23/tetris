import Buffer from "./buffer.js";
import Mat4 from '../core/mat4.js';

export default class RenderableText {

  constructor(context, string, position, size) {
  
    this.context = context;
    this.modelMatrix = this.calculateModelMatrix(position, size);

    this.setText(string);
    this.loadFontTexture();
  }

  loadFontTexture() {

    this.texture = this.context.createTexture();

    this.fontImage = new Image();
    this.fontImage.src = 'resources/font.png';
    this.fontImage.addEventListener('load', this.onImageLoaded.bind(this));
  }

  onImageLoaded() {
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    this.context.pixelStorei(this.context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    this.context.texImage2D(
      this.context.TEXTURE_2D,
      0,
      this.context.RGBA,
      this.context.RGBA,
      this.context.UNSIGNED_BYTE,
      this.fontImage
    );
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MIN_FILTER, this.context.NEAREST);
    this.context.texParameteri(this.context.TEXTURE_2D, this.context.TEXTURE_MAG_FILTER, this.context.NEAREST);
  }

  calculateModelMatrix(position, size) {
    let translationMatrix = Mat4.translate(
      position[0] / size[0],
      position[1] / size[1],
      0
    );
    let scaleMatrix = Mat4.scale(size[0], size[1], 1.0);
    return translationMatrix.multiply(scaleMatrix);
  }

  setText(string) {
    var positions = new Float32Array(string.length * 12);
    var texCoords = new Float32Array(string.length * 12);
    for (let i = 0; i < string.length; i++) {
      var index;
      if (string.charCodeAt(i) >= 'a'.charCodeAt(0) && string.charCodeAt(i) <= 'z'.charCodeAt(0)) {
        index = string.charCodeAt(i) - 'a'.charCodeAt(0);
      } else if (string.charCodeAt(i) >= 'A'.charCodeAt(0) && string.charCodeAt(i) <= 'Z'.charCodeAt(0)) {
        index = string.charCodeAt(i) - 'A'.charCodeAt(0);
      } else if (string.charCodeAt(i) >= '0'.charCodeAt(0) && string.charCodeAt(i) <= '9'.charCodeAt(0)) {
        index = (string.charCodeAt(i) - '0'.charCodeAt(0)) + 26;
      } else {
        throw 'Invalid character: ' + string.charAt(i);
      }
      let row = Math.floor(index / 8);
      let col = index % 8;
      let u1 = col / 8;
      let u2 = (col * 8 + 7) / 64;
      let v1 = (row * 8 + 7) / 40;
      let v2 = row / 5;
      positions[i * 12] = i * 7;
      positions[(i * 12) + 1] = 0;
      texCoords[i * 12] = u1;
      texCoords[(i * 12) + 1] = v1;
      positions[(i * 12) + 2] = (i + 1) * 7;
      positions[(i * 12) + 3] = 0;
      texCoords[(i * 12) + 2] = u2;
      texCoords[(i * 12) + 3] = v1;
      positions[(i * 12) + 4] = i * 7;
      positions[(i * 12) + 5] = 7;
      texCoords[(i * 12) + 4] = u1;
      texCoords[(i * 12) + 5] = v2;
      positions[(i * 12) + 6] = i * 7;
      positions[(i * 12) + 7] = 7;
      texCoords[(i * 12) + 6] = u1;
      texCoords[(i * 12) + 7] = v2;
      positions[(i * 12) + 8] = (i + 1) * 7;
      positions[(i * 12) + 9] = 0;
      texCoords[(i * 12) + 8] = u2;
      texCoords[(i * 12) + 9] = v1;
      positions[(i * 12) + 10] = (i + 1) * 7;
      positions[(i * 12) + 11] = 7;
      texCoords[(i * 12) + 10] = u2;
      texCoords[(i * 12) + 11] = v2;
    }
    this.positionBuffer = new Buffer(this.context, positions);
    this.texCoordBuffer = new Buffer(this.context, texCoords);
    this.vertexCount = string.length * 6;
  }

  draw(textShaderProgram) {

    this.context.enable(this.context.BLEND);
    this.context.blendFunc(this.context.ONE, this.context.ONE_MINUS_SRC_ALPHA);

    textShaderProgram.use();
    this.context.activeTexture(this.context.TEXTURE0);
    this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    textShaderProgram.setTexture(0);

    textShaderProgram.setModelMatrix(this.modelMatrix);
    textShaderProgram.bindPositionBuffer(this.positionBuffer);
    textShaderProgram.bindTexCoordBuffer(this.texCoordBuffer);

    this.context.drawArrays(this.context.TRIANGLES, 0, this.vertexCount);
    this.context.disable(this.context.BLEND);
  }
};