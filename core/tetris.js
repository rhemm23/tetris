import ColoredShaderProgram from '../graphics/colored_shader_program.js';
import TextShaderProgram from '../graphics/text_shader_program.js';
import SquareRenderer from '../graphics/square_renderer.js';
import RenderableText from '../graphics/renderable_text.js';
import Mat4 from './mat4.js';

const borderColor = [0.2, 0.2, 0.2, 1.0];

const PIECES = [
  'I',
  'J',
  'L',
  'O',
  'S',
  'T',
  'Z'
];

const pieceColors = {
  'I': [0.675, 0.843, 0.898, 1.0],
  'J': [0.200, 0.200, 0.850, 1.0],
  'L': [0.850, 0.644, 0.200, 1.0],
  'O': [0.800, 0.800, 0.200, 1.0],
  'S': [0.200, 0.850, 0.200, 1.0],
  'T': [0.500, 0.200, 0.500, 1.0],
  'Z': [0.850, 0.200, 0.200, 1.0]
};

const pieceOffsets = {
  'I': [
    [[-1, 0], [1, 0], [2, 0]],
    [[0, 1], [0, -1], [0, -2]],
    [[-2, 0], [-1, 0], [1, 0]],
    [[0, 2], [0, 1], [0, -1]]
  ],
  'J': [
    [[-1, 1], [-1, 0], [1, 0]],
    [[0, 1], [1, 1], [0, -1]],
    [[-1, 0], [1, 0], [1, -1]],
    [[0, 1], [0, -1], [-1, -1]]
  ],
  'L': [
    [[-1, 0], [1, 0], [1, 1]],
    [[0, 1], [0, -1], [1, -1]],
    [[-1, -1], [-1, 0], [1, 0]],
    [[-1, 1], [0, 1], [0, -1]]
  ],
  'O': [
    [[0, 1], [1, 1], [1, 0]],
    [[1, 0], [0, -1], [1, -1]],
    [[-1, -1], [-1, 0], [0, -1]],
    [[-1, 0], [-1, 1], [0, 1]]
  ],
  'S': [
    [[-1, 0], [0, 1], [1, 1]],
    [[0, 1], [1, 0], [1, -1]],
    [[-1, -1], [0, -1], [1, 0]],
    [[-1, 1], [-1, 0], [0, -1]]
  ],
  'T': [
    [[-1, 0], [0, 1], [1, 0]],
    [[0, 1], [1, 0], [0, -1]],
    [[-1, 0], [0, -1], [1, 0]],
    [[-1, 0], [0, 1], [0, -1]]
  ],
  'Z': [
    [[-1, 1], [0, 1], [1, 0]],
    [[0, -1], [1, 0], [1, 1]],
    [[-1, 0], [0, -1], [1, -1]],
    [[-1, -1], [-1, 0], [0, 1]]
  ]
};

export default class Tetris {

  constructor(context) {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    context.clearColor(0, 0, 0, 1);
    this.downArrowPressed = false;
    this.context = context;
    this.init();
  }

  onKeyUp(e) {
    if (e.keyCode == 40) {
      this.downArrowPressed = false;
    }
  }

  onKeyDown(e) {
    if (e.keyCode == 32) {
      let previousRotationIndex = this.rotationIndex;
      this.rotationIndex = (this.rotationIndex + 1) % 4;
      let occupiedSquares = this.getActivePieceOccupiedSquares();
      let validRotation = true;
      for (let i = 0; i < 4; i++) {
        let x = occupiedSquares[i][0];
        let y = occupiedSquares[i][1];
        if (x < 0 || x > 9 || y < 0 || y > 19 || this.grid[y][x] !== null) {
          validRotation = false;
          break;
        }
      }
      if (!validRotation) {
        this.rotationIndex = previousRotationIndex;
      }
    } else if (e.keyCode == 37 || e.keyCode == 39) {
      let previousCenterX = this.centerLocation[0];
      if (e.keyCode == 37) {
        this.centerLocation[0]--;
      } else {
        this.centerLocation[0]++;
      }
      let occupiedSquares = this.getActivePieceOccupiedSquares();
      let validMove = true;
      for (let i = 0; i < 4; i++) {
        let x = occupiedSquares[i][0];
        let y = occupiedSquares[i][1];
        if (x < 0 || x > 9 || y < 0 || y > 19 || this.grid[y][x] !== null) {
          validMove = false;
          break;
        }
      }
      if (!validMove) {
        this.centerLocation[0] = previousCenterX;
      }
    } else if (e.keyCode == 40) {
      this.downArrowPressed = true;
    }
  }

  init() {

    this.textShaderProgram = new TextShaderProgram(this.context);

    this.scoreText = new RenderableText(this.context, "score", [-1.5, 0.5], [0.02, 0.02]);
    this.actualScoreText = new RenderableText(this.context, "0", [-1.21, 0.3], [0.02, 0.02]);
    this.score = 0;

    this.coloredShaderProgram = new ColoredShaderProgram(this.context);
    this.squareRenderer = new SquareRenderer(this.context, this.coloredShaderProgram);

    // Initialize grid
    this.grid = [];
    this.border = [];
    this.gridModelMatrices = [];
    for (let row = 0; row < 20; row++) {
      this.border.push(
        this.calculateModelMatrix(
          [-0.55, -0.95 + row * 0.1, 0],
          [0.1, 0.1]
        )
      );
      this.border.push(
        this.calculateModelMatrix(
          [0.55, -0.95 + row * 0.1, 0],
          [0.1, 0.1]
        )
      );
      let gridRow = [];
      let gridRowModelMatrices = [];
      for (let col = 0; col < 10; col++) {
        gridRow.push(null);
        gridRowModelMatrices.push(
          this.calculateModelMatrix(
            [-0.45 + col * 0.1, -0.95 + row * 0.1],
            [0.1, 0.1]
          )
        );
      }
      this.grid.push(gridRow);
      this.gridModelMatrices.push(gridRowModelMatrices);
    }

    // Setup first falling piece
    this.startNewPiece();
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

  startNewPiece() {
    this.activePiece = PIECES[Math.floor(Math.random() * PIECES.length)];
    this.centerLocation = [4, 19];
    this.rotationIndex = 0;
    this.ticksPassed = 0;
  }

  getActivePieceOccupiedSquares() {
    let pieceDeltas = pieceOffsets[this.activePiece][this.rotationIndex].concat([[0, 0]]);
    let results = [];
    for (let i = 0; i < 4; i++) {
      results.push([
        this.centerLocation[0] + pieceDeltas[i][0],
        this.centerLocation[1] + pieceDeltas[i][1]
      ]);
    }
    return results;
  }

  update() {

    // Assure projection matrix is correct
    this.coloredShaderProgram.use();
    this.coloredShaderProgram.setProjectionMatrix(Mat4.scale(this.context.canvas.height / this.context.canvas.width, 1.0, 1.0));

    // Set for text renderer too
    this.textShaderProgram.use();
    this.textShaderProgram.setProjectionMatrix(Mat4.scale(this.context.canvas.height / this.context.canvas.width, 1.0, 1.0));

    // Update game
    this.ticksPassed++;
    if (this.ticksPassed >= 30 || (this.ticksPassed >= 5 && this.downArrowPressed)) {
      let occupiedSquares = this.getActivePieceOccupiedSquares();
      let obstructed = false;
      for (let i = 0; i < 4; i++) {
        let dx = occupiedSquares[i][0];
        let dy = occupiedSquares[i][1];
        if (dy == 0 || (dy - 1 < 20 && this.grid[dy - 1][dx] !== null)) {
          obstructed = true;
          break;
        }
      }
      if (obstructed) {
        for (let i = 0; i < 4; i++) {
          this.grid[occupiedSquares[i][1]][occupiedSquares[i][0]] = pieceColors[this.activePiece];
        }
        let fullLines = [];
        for (let row = 0; row < 20; row++) {
          let isRowFull = true;
          for (let col = 0; col < 10; col++) {
            if (this.grid[row][col] === null) {
              isRowFull = false;
              break;
            }
          }
          if (isRowFull) {
            fullLines.push(row);
          }
        }
        fullLines.sort(function(a, b) {
          return b - a;
        });
        for (const row of fullLines) {
          this.grid.splice(row, 1);
        }
        for (let i = 0; i < fullLines.length; i++) {
          let gridRow = [];
          for (let j = 0; j < 10; j++) {
            gridRow.push(null);
          }
          this.grid.push(gridRow);
        }
        if (fullLines.length > 0) {
          switch (fullLines.length) {
            case 1:
              this.score += 40;
              break;
  
            case 2:
              this.score += 100;
              break;
  
            case 3:
              this.score += 300;
              break;

            default:
              this.score += 1200;
              break;
          }
          this.actualScoreText.setText(this.score.toString());
        }
        this.startNewPiece();
      } else {
        this.centerLocation[1]--;
        this.ticksPassed = 0;
      }
    }
  }

  render() {
    this.context.clear(this.context.COLOR_BUFFER_BIT);
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (this.grid[row][col] !== null) {
          this.squareRenderer.draw(
            this.gridModelMatrices[row][col],
            this.grid[row][col]
          );
        }
      }
    }
    for (const border of this.border) {
      this.squareRenderer.draw(
        border,
        borderColor
      );
    }
    let occupiedSquares = this.getActivePieceOccupiedSquares();
    for (let i = 0; i < 4; i++) {
      let dx = occupiedSquares[i][0];
      let dy = occupiedSquares[i][1];
      if (dx >= 0 && dx < 10 && dy >= 0 && dy < 20) {
        this.squareRenderer.draw(
          this.gridModelMatrices[dy][dx],
          pieceColors[this.activePiece]
        );
      }
    }
    this.scoreText.draw(this.textShaderProgram);
    this.actualScoreText.draw(this.textShaderProgram);
  }
};