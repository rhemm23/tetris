import Tetris from './core/tetris.js';

function main() {

  var canvas = document.getElementById('main-canvas');
  var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!context) {
    console.log('Could not get webgl context');
    return;
  }

  let game = new Tetris(context);

  var then = 0;
  var accum = 0;

  const tick = 1.0 / 60.0;

  function render(now) {

    // Fit canvas to window
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
      context.viewport(0, 0, canvas.width, canvas.height);
    }

    // Calculate delta time
    now *= 0.001;
    const timeDelta = now - then;
    then = now;

    accum += timeDelta;
    if (accum >= tick) {
      accum -= tick;
      game.update();
    }

    game.render();

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
