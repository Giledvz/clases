(() => {
  const model = document.querySelector('.particle-model--gas');
  const frame = model?.querySelector('.particle-model__frame');
  const circles = [...(model?.querySelectorAll('.particle-model__particle circle') || [])];

  if (!model || !frame || circles.length === 0) return;

  const velocitySeeds = [
    [4.6, 3.2],
    [-3.8, 4.5],
    [-4.7, 2.9],
    [4.2, -3.7],
    [-3.6, -4.3],
    [-4.3, -3.1]
  ];

  const particles = circles.map((circle, index) => ({
    circle,
    x: Number(circle.getAttribute('cx')),
    y: Number(circle.getAttribute('cy')),
    radius: Number(circle.getAttribute('r')),
    vx: velocitySeeds[index][0],
    vy: velocitySeeds[index][1]
  }));

  const bounds = {
    left: Number(frame.getAttribute('x')),
    top: Number(frame.getAttribute('y')),
    right: Number(frame.getAttribute('x')) + Number(frame.getAttribute('width')),
    bottom: Number(frame.getAttribute('y')) + Number(frame.getAttribute('height'))
  };

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationFrame = 0;
  let lastTimestamp = 0;
  let isVisible = true;

  function keepInsideFrame(particle) {
    const minX = bounds.left + particle.radius + 1;
    const maxX = bounds.right - particle.radius - 1;
    const minY = bounds.top + particle.radius + 1;
    const maxY = bounds.bottom - particle.radius - 1;

    if (particle.x <= minX) {
      particle.x = minX;
      particle.vx = Math.abs(particle.vx);
    } else if (particle.x >= maxX) {
      particle.x = maxX;
      particle.vx = -Math.abs(particle.vx);
    }

    if (particle.y <= minY) {
      particle.y = minY;
      particle.vy = Math.abs(particle.vy);
    } else if (particle.y >= maxY) {
      particle.y = maxY;
      particle.vy = -Math.abs(particle.vy);
    }
  }

  function resolveParticleCollisions() {
    for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
        const first = particles[firstIndex];
        const second = particles[secondIndex];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const minimumDistance = first.radius + second.radius;
        const squaredDistance = (dx * dx) + (dy * dy);

        if (squaredDistance > minimumDistance * minimumDistance) continue;

        const distance = Math.sqrt(squaredDistance) || minimumDistance;
        const normalX = squaredDistance === 0 ? 1 : dx / distance;
        const normalY = squaredDistance === 0 ? 0 : dy / distance;
        const overlap = minimumDistance - distance;

        /* Se corrige la penetración antes de dibujar el cuadro. De esta manera
           los círculos rebotan cuando se tocan sus bordes y nunca se enciman. */
        if (overlap >= 0) {
          const correction = (overlap / 2) + 0.02;
          first.x -= normalX * correction;
          first.y -= normalY * correction;
          second.x += normalX * correction;
          second.y += normalY * correction;
        }

        const relativeVelocity =
          ((second.vx - first.vx) * normalX) +
          ((second.vy - first.vy) * normalY);

        if (relativeVelocity < 0) {
          first.vx += relativeVelocity * normalX;
          first.vy += relativeVelocity * normalY;
          second.vx -= relativeVelocity * normalX;
          second.vy -= relativeVelocity * normalY;
        }
      }
    }
  }

  function render() {
    particles.forEach((particle) => {
      particle.circle.setAttribute('cx', particle.x.toFixed(2));
      particle.circle.setAttribute('cy', particle.y.toFixed(2));
    });
  }

  function tick(timestamp) {
    const elapsed = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, 0.034) : 0;
    lastTimestamp = timestamp;

    particles.forEach((particle) => {
      particle.x += particle.vx * elapsed;
      particle.y += particle.vy * elapsed;
      keepInsideFrame(particle);
    });

    /* Varias pasadas resuelven también los contactos simultáneos contra
       otra partícula y una pared sin dejar intersecciones residuales. */
    for (let solverPass = 0; solverPass < 3; solverPass += 1) {
      resolveParticleCollisions();
      particles.forEach(keepInsideFrame);
    }
    render();
    animationFrame = window.requestAnimationFrame(tick);
  }

  function shouldAnimate() {
    return !motionPreference.matches && isVisible && !document.hidden;
  }

  function syncAnimation() {
    if (shouldAnimate() && !animationFrame) {
      lastTimestamp = 0;
      animationFrame = window.requestAnimationFrame(tick);
    } else if (!shouldAnimate() && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastTimestamp = 0;
    }
  }

  const visibilityObserver = new IntersectionObserver((entries) => {
    isVisible = entries[0]?.isIntersecting ?? true;
    syncAnimation();
  }, { rootMargin: '120px' });

  visibilityObserver.observe(model);
  document.addEventListener('visibilitychange', syncAnimation);

  if (typeof motionPreference.addEventListener === 'function') {
    motionPreference.addEventListener('change', syncAnimation);
  } else {
    motionPreference.addListener(syncAnimation);
  }

  render();
  syncAnimation();
})();
