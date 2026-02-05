(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const overlay = document.getElementById("overlay");
  const btnStart = document.getElementById("btn-start");
  const btnExit = document.getElementById("btn-exit");

  const STATE = {
    READY: "ready",
    RUNNING: "running",
    DEAD: "dead",
  };

  let state = STATE.READY;
  let lastTime = 0;
  let score = 0;

  const world = {
    width: 480,
    height: 640,
    gravity: 900,
    jumpVelocity: -300,
    maxFall: 500,
    pipeGap: 170,
    pipeSpeed: 190,
    pipeInterval: 1.5,
    ballX: 120,
    ballDiameter: 32,
    pipeTileW: 48,
    pipeTileH: 48,
  };

  let ballY = world.height / 2;
  let ballVy = 0;
  let pipes = [];
  let spawnTimer = 0;

  const ballImg = new Image();
  ballImg.src = "zm.jpg";

  const pipeTile = new Image();
  pipeTile.src = "sld.jpg";

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * ratio);
    canvas.height = Math.floor(h * ratio);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function resetGame() {
    ballY = world.height / 2;
    ballVy = 0;
    pipes = [];
    spawnTimer = 0;
    score = 0;
    scoreEl.textContent = "0";
  }

  function startGame() {
    resetGame();
    state = STATE.RUNNING;
    overlay.classList.remove("show");
  }

  function showOverlay(message) {
    overlay.classList.add("show");
    overlay.querySelector("p").textContent = message;
  }

  function getScale() {
    const scaleX = window.innerWidth / world.width;
    const scaleY = window.innerHeight / world.height;
    return Math.min(scaleX, scaleY);
  }

  function drawTiled(tile, rect) {
    const scale = getScale();
    const tileW = world.pipeTileW * scale;
    const tileH = world.pipeTileH * scale;
    const left = rect.x * scale;
    const top = rect.y * scale;
    const right = (rect.x + rect.w) * scale;
    const bottom = (rect.y + rect.h) * scale;

    for (let y = top; y < bottom; y += tileH) {
      const h = Math.min(tileH, bottom - y);
      for (let x = left; x < right; x += tileW) {
        const w = Math.min(tileW, right - x);
        if (w === tileW && h === tileH) {
          ctx.drawImage(tile, x, y, tileW, tileH);
        } else {
          ctx.drawImage(tile, 0, 0, world.pipeTileW * (w / tileW), world.pipeTileH * (h / tileH), x, y, w, h);
        }
      }
    }
  }

  function circleRectCollision(cx, cy, radius, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= radius * radius;
  }

  function spawnPipe() {
    const gapCenter = Math.floor(120 + Math.random() * (world.height - 240));
    pipes.push({ x: world.width + 30, gapY: gapCenter, passed: false });
  }

  function update(dt) {
    if (state !== STATE.RUNNING) return;

    ballVy = Math.min(ballVy + world.gravity * dt, world.maxFall);
    ballY += ballVy * dt;

    spawnTimer += dt;
    if (spawnTimer >= world.pipeInterval) {
      spawnTimer = 0;
      spawnPipe();
    }

    pipes.forEach((pipe) => {
      pipe.x -= world.pipeSpeed * dt;
    });

    pipes = pipes.filter((pipe) => pipe.x + world.pipeTileW > 0);

    const radius = world.ballDiameter / 2;
    for (const pipe of pipes) {
      const topRect = { x: pipe.x, y: 0, w: world.pipeTileW, h: pipe.gapY - world.pipeGap / 2 };
      const bottomRect = {
        x: pipe.x,
        y: pipe.gapY + world.pipeGap / 2,
        w: world.pipeTileW,
        h: world.height - (pipe.gapY + world.pipeGap / 2),
      };

      if (circleRectCollision(world.ballX, ballY, radius, topRect) ||
          circleRectCollision(world.ballX, ballY, radius, bottomRect)) {
        state = STATE.DEAD;
        showOverlay("You crashed! Tap to restart.");
        return;
      }

      if (!pipe.passed && pipe.x + world.pipeTileW < world.ballX) {
        pipe.passed = true;
        score += 1;
        scoreEl.textContent = String(score);
      }
    }

    if (ballY - radius <= 0 || ballY + radius >= world.height) {
      state = STATE.DEAD;
      showOverlay("You crashed! Tap to restart.");
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = getScale();
    const offsetX = (window.innerWidth - world.width * scale) / 2;
    const offsetY = (window.innerHeight - world.height * scale) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    pipes.forEach((pipe) => {
      const topRect = { x: pipe.x, y: 0, w: world.pipeTileW, h: pipe.gapY - world.pipeGap / 2 };
      const bottomRect = {
        x: pipe.x,
        y: pipe.gapY + world.pipeGap / 2,
        w: world.pipeTileW,
        h: world.height - (pipe.gapY + world.pipeGap / 2),
      };
      drawTiled(pipeTile, topRect);
      drawTiled(pipeTile, bottomRect);
    });

    const ballSize = world.ballDiameter * scale;
    const ballX = world.ballX * scale - ballSize / 2;
    const ballYDraw = ballY * scale - ballSize / 2;

    ctx.drawImage(ballImg, ballX, ballYDraw, ballSize, ballSize);

    ctx.restore();
  }

  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.033);
    lastTime = timestamp;

    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function handleTap(event) {
    event.preventDefault();
    if (state === STATE.READY) {
      startGame();
      return;
    }
    if (state === STATE.DEAD) {
      startGame();
      return;
    }
    if (state === STATE.RUNNING) {
      ballVy = world.jumpVelocity;
    }
  }

  function handleExit() {
    state = STATE.READY;
    showOverlay("Tap to start again.");
  }

  btnStart.addEventListener("click", (event) => {
    event.preventDefault();
    startGame();
  });

  btnExit.addEventListener("click", (event) => {
    event.preventDefault();
    handleExit();
  });

  canvas.addEventListener("pointerdown", handleTap, { passive: false });
  canvas.addEventListener("touchstart", handleTap, { passive: false });

  window.addEventListener("resize", resize);

  function boot() {
    resize();
    showOverlay("Tap to start.");
    requestAnimationFrame(loop);
  }

  if (ballImg.complete && pipeTile.complete) {
    boot();
  } else {
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded >= 2) boot();
    };
    ballImg.onload = done;
    pipeTile.onload = done;
  }
})();
