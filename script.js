/* === PRELOADER — Single-pen SVG Draw Animation === */
(function () {
  const preloader = document.getElementById('preloader');
  const glow = document.getElementById('preloader-glow');
  const strokePaths = Array.from(document.querySelectorAll('.svg-stroke-path'));

  strokePaths.forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });

  const tl = gsap.timeline();

  tl.to(glow, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);

  const outerPath = strokePaths[0];
  const letterPaths = strokePaths.slice(1);
  const drawTotal = 2.4;

  tl.to(letterPaths, {
    strokeDashoffset: 0,
    duration: drawTotal,
    ease: 'power2.inOut',
  }, 0);

  tl.to(outerPath, {
    strokeDashoffset: 0,
    duration: drawTotal,
    ease: 'power2.inOut',
  }, 0);

  tl.to(preloader, {
    opacity: 0,
    duration: 0.65,
    ease: 'power2.inOut',
    delay: 0.25,
    onComplete() {
      preloader.style.display = 'none';
      document.body.style.overflow = '';
    },
  });

  document.body.style.overflow = 'hidden';
})();


/* === MOBILE DRAWER === */
(function () {
  const btn = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');

  const hamburgerIcon = btn.querySelector('.hamburger-icon');

  function openDrawer() {
    drawer.classList.add('open');
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerIcon.src = 'assets/icons/menu sanduiche sair.svg';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
    hamburgerIcon.src = 'assets/icons/menu sanduiche.svg';
  }

  btn.addEventListener('click', function () {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });
})();


/* === TAB SWITCHING — Residencial / Móvel === */
function switchTab(type) {
  const tabRes = document.getElementById('tab-residencial');
  const tabMov = document.getElementById('tab-movel');
  const gridRes = document.getElementById('grid-residencial');
  const gridMov = document.getElementById('grid-movel');

  if (type === 'residencial') {
    tabRes.className = 'btn btn-sm btn-primary';
    tabRes.style.background = 'var(--c1)';
    tabRes.style.color = '#fff';

    tabMov.className = 'btn btn-sm btn-outline';
    tabMov.style.background = 'transparent';
    tabMov.style.color = 'var(--text-mid)';

    gridRes.style.display = 'grid';
    gridMov.style.display = 'none';
  } else {
    tabRes.className = 'btn btn-sm btn-outline';
    tabRes.style.background = 'transparent';
    tabRes.style.color = 'var(--text-mid)';

    tabMov.className = 'btn btn-sm btn-primary';
    tabMov.style.background = 'var(--c1)';
    tabMov.style.color = '#fff';

    gridRes.style.display = 'none';
    gridMov.style.display = 'grid';
  }
}


/* === DEPOIMENTOS CAROUSEL === */
(function () {
  const track = document.getElementById('dep-track');
  const origCards = Array.from(track.querySelectorAll('.dep-card'));
  const total = origCards.length;
  const GAP = 24;
  let pos = 0;
  let isAnimating = false;

  origCards.forEach(c => track.appendChild(c.cloneNode(true)));
  origCards.forEach(c => track.appendChild(c.cloneNode(true)));
  origCards.slice().reverse().forEach(c => track.insertBefore(c.cloneNode(true), track.firstChild));
  origCards.slice().reverse().forEach(c => track.insertBefore(c.cloneNode(true), track.firstChild));

  const allCards = Array.from(track.querySelectorAll('.dep-card'));
  const OFFSET = total * 2;

  function setCardWidths() {
    const viewport = document.getElementById('dep-viewport');
    const viewportW = viewport ? (viewport.clientWidth - 48) : (window.innerWidth - 48);
    let cardW;
    if (window.innerWidth < 768) {
      cardW = Math.floor(viewportW * 0.9);
    } else if (window.innerWidth < 1024) {
      cardW = Math.floor((viewportW - GAP) / 2);
    } else {
      cardW = Math.floor((viewportW - 2 * GAP) / 3);
    }
    allCards.forEach(c => { c.style.width = cardW + 'px'; c.style.minWidth = cardW + 'px'; });
    track.style.paddingLeft = '0px';
  }

  function cardStep() {
    return allCards[0].getBoundingClientRect().width + GAP;
  }

  function updateActiveCard(idx) {
    const activeIdx = OFFSET + idx;
    allCards.forEach((c, i) => {
      if (i === activeIdx) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  function setPosition(idx, animated) {
    const viewport = document.getElementById('dep-viewport');
    const viewportW = viewport ? (viewport.clientWidth - 48) : (window.innerWidth - 48);
    const step = cardStep();
    const cardW = allCards[0].getBoundingClientRect().width;
    const translateX = (OFFSET + idx) * step - (viewportW / 2 - cardW / 2);
    track.style.transition = animated ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' : 'none';
    track.style.transform = 'translateX(-' + translateX + 'px)';
    updateActiveCard(idx);
  }

  function goTo(delta) {
    if (isAnimating) return;
    pos += delta;
    setPosition(pos, true);
    isAnimating = true;

    track.addEventListener('transitionend', function onEnd() {
      track.removeEventListener('transitionend', onEnd);
      if (pos >= total || pos <= -total) {
        pos = ((pos % total) + total) % total;
        setPosition(pos, false);
      }
      isAnimating = false;
    });
  }

  function init() {
    setCardWidths();
    setPosition(pos, false);
  }

  document.getElementById('dep-prev').addEventListener('click', () => goTo(-1));
  document.getElementById('dep-next').addEventListener('click', () => goTo(1));
  window.addEventListener('resize', init);

  init();
})();


/* === FOOTER — Ano + Newsletter === */
document.getElementById('footer-year').textContent = new Date().getFullYear();

function handleFooterNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('footer-email-input');
  const success = document.getElementById('footer-newsletter-success');
  const btn = document.getElementById('footer-newsletter-btn');

  btn.disabled = true;
  btn.style.opacity = '0.6';
  input.disabled = true;

  setTimeout(() => {
    input.style.display = 'none';
    btn.style.display = 'none';
    success.style.display = 'flex';
  }, 400);
}


/* === ANTIGRAVITY BACKGROUND (Three.js) === */
(function () {
  const canvas = document.getElementById('antigravity-canvas');
  const heroSection = document.getElementById('hero-section');
  if (!canvas || !heroSection) return;

  const count = 300;
  const magnetRadius = 9;
  const ringRadius = 7;
  const waveSpeed = 0.4;
  const waveAmplitude = 1.0;
  const particleSize = 1.5;
  const lerpSpeed = 0.05;
  const color = '#1018c1';
  const autoAnimate = true;
  const particleVariance = 1.0;
  const rotationSpeed = 0.1;
  const depthFactor = 1.0;
  const pulseSpeed = 3.0;
  const fieldStrength = 10.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
  camera.position.set(0, 0, 50);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  let w = heroSection.clientWidth;
  let h = heroSection.clientHeight;
  let vWidth = 0;
  let vHeight = 0;

  function resize() {
    w = heroSection.clientWidth;
    h = heroSection.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    vHeight = 2 * Math.tan((35 * Math.PI) / 360) * 50;
    vWidth = vHeight * camera.aspect;
  }
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: 0, y: 0 };
  const lastMousePos = { x: 0, y: 0 };
  const virtualMouse = { x: 0, y: 0 };
  let lastMouseMoveTime = Date.now();

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const rawY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const dist = Math.sqrt(Math.pow(rawX - lastMousePos.x, 2) + Math.pow(rawY - lastMousePos.y, 2));
    if (dist > 0.001) {
      lastMouseMoveTime = Date.now();
      lastMousePos.x = rawX;
      lastMousePos.y = rawY;
      mouse.x = (rawX * vWidth) / 2;
      mouse.y = (rawY * vHeight) / 2;
    }
  });

  heroSection.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      const rect = heroSection.getBoundingClientRect();
      const rawX = ((t.clientX - rect.left) / rect.width) * 2 - 1;
      const rawY = -((t.clientY - rect.top) / rect.height) * 2 + 1;
      lastMouseMoveTime = Date.now();
      mouse.x = (rawX * vWidth) / 2;
      mouse.y = (rawY * vHeight) / 2;
    }
  }, { passive: true });

  const geometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 6);
  geometry.rotateX(Math.PI / 2);

  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
  scene.add(instancedMesh);

  const dummy = new THREE.Object3D();
  const particles = [];

  for (let i = 0; i < count; i++) {
    const t = Math.random() * 100;
    const speed = 0.01 + Math.random() / 200;
    const rx = (Math.random() - 0.5) * vWidth;
    const ry = (Math.random() - 0.5) * vHeight;
    const rz = (Math.random() - 0.5) * 20;
    particles.push({
      t: t, speed: speed,
      mx: rx, my: ry, mz: rz,
      cx: rx, cy: ry, cz: rz,
      randomRadiusOffset: (Math.random() - 0.5) * 2
    });
  }

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const delta = clock.getDelta();

    let destX = mouse.x;
    let destY = mouse.y;

    if (autoAnimate && (Date.now() - lastMouseMoveTime > 2000)) {
      destX = Math.sin(elapsedTime * 0.5) * (vWidth / 4);
      destY = Math.cos(elapsedTime * 0.5 * 2) * (vHeight / 4);
    }

    virtualMouse.x += (destX - virtualMouse.x) * 0.05;
    virtualMouse.y += (destY - virtualMouse.y) * 0.05;

    const globalRotation = elapsedTime * rotationSpeed;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.t += p.speed / 2;

      const projectionFactor = 1 - p.cz / 50;
      const projectedTargetX = virtualMouse.x * projectionFactor;
      const projectedTargetY = virtualMouse.y * projectionFactor;

      const dx = p.mx - projectedTargetX;
      const dy = p.my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const targetPos = { x: p.mx, y: p.my, z: p.mz * depthFactor };

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(p.t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = p.randomRadiusOffset * (5 / (fieldStrength + 0.1));
        const currentRingRadius = ringRadius + wave + deviation;
        targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetPos.z = p.mz * depthFactor + Math.sin(p.t) * (1 * waveAmplitude * depthFactor);
      }

      p.cx += (targetPos.x - p.cx) * lerpSpeed;
      p.cy += (targetPos.y - p.cy) * lerpSpeed;
      p.cz += (targetPos.z - p.cz) * lerpSpeed;

      dummy.position.set(p.cx, p.cy, p.cz);
      dummy.lookAt(projectedTargetX, projectedTargetY, p.cz);

      const currentDistToMouse = Math.sqrt(
        Math.pow(p.cx - projectedTargetX, 2) + Math.pow(p.cy - projectedTargetY, 2)
      );
      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      let scaleFactor = 1 - distFromRing / 10;
      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale = scaleFactor * (0.8 + Math.sin(p.t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();
})();


/* === ELECTRIC BORDER ANIMATION === */
(function () {
  const container = document.getElementById('electric-combo-card');
  const canvas = document.getElementById('eb-canvas-combo');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const color = '#040DBF';
  const speed = 1.0;
  const chaos = 0.09;
  const borderRadius = 24;
  const octaves = 10;
  const lacunarity = 1.6;
  const gain = 0.7;
  const amplitude = chaos;
  const frequency = 10;
  const baseFlatness = 0;
  const displacement = 60;
  const borderOffset = 60;

  let time = 0;
  let lastFrameTime = performance.now();

  function random(x) {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }

  function noise2D(x, y) {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3.0 - 2.0 * fx);
    const uy = fy * fy * (3.0 - 2.0 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  function octavedNoise(x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, timeVal, seed, baseFlatness) {
    let y = 0;
    let amp = baseAmplitude;
    let freq = baseFrequency;
    for (let i = 0; i < octaves; i++) {
      let octaveAmplitude = amp;
      if (i === 0) { octaveAmplitude *= baseFlatness; }
      y += octaveAmplitude * noise2D(freq * x + seed * 100, timeVal * freq * 0.3);
      freq *= lacunarity;
      amp *= gain;
    }
    return y;
  }

  function getCornerPoint(centerX, centerY, radius, startAngle, arcLength, progress) {
    const angle = startAngle + progress * arcLength;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }

  function getRoundedRectPoint(t, left, top, width, height, radius) {
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    const distance = t * totalPerimeter;
    let accumulated = 0;

    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + radius + progress * straightWidth, y: top };
    }
    accumulated += straightWidth;
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;
    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left + width, y: top + radius + progress * straightHeight };
    }
    accumulated += straightHeight;
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
    }
    accumulated += cornerArc;
    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + width - radius - progress * straightWidth, y: top + height };
    }
    accumulated += straightWidth;
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;
    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left, y: top + height - radius - progress * straightHeight };
    }
    accumulated += straightHeight;
    const progress = (distance - accumulated) / cornerArc;
    return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
  }

  let width = 0;
  let height = 0;
  let lastDpr = 1;

  function updateSize() {
    const rect = container.getBoundingClientRect();
    width = rect.width + borderOffset * 2;
    height = rect.height + borderOffset * 2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    lastDpr = dpr;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }

  updateSize();

  function drawElectricBorder(currentTime) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (dpr !== lastDpr) { updateSize(); }

    const deltaTime = (currentTime - lastFrameTime) / 1000;
    time += deltaTime * speed;
    lastFrameTime = currentTime;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const scale = displacement;
    const left = borderOffset;
    const top = borderOffset;
    const borderWidth = width - 2 * borderOffset;
    const borderHeight = height - 2 * borderOffset;
    const maxRadius = Math.min(borderWidth, borderHeight) / 2;
    const radius = Math.min(borderRadius, maxRadius);

    const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
    const sampleCount = Math.floor(approximatePerimeter / 2);

    ctx.beginPath();

    for (let i = 0; i <= sampleCount; i++) {
      const progress = i / sampleCount;
      const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

      const xNoise = octavedNoise(progress * 8, octaves, lacunarity, gain, amplitude, frequency, time, 0, baseFlatness);
      const yNoise = octavedNoise(progress * 8, octaves, lacunarity, gain, amplitude, frequency, time, 1, baseFlatness);

      const displacedX = point.x + xNoise * scale;
      const displacedY = point.y + yNoise * scale;

      if (i === 0) { ctx.moveTo(displacedX, displacedY); }
      else { ctx.lineTo(displacedX, displacedY); }
    }

    ctx.closePath();
    ctx.stroke();
    requestAnimationFrame(drawElectricBorder);
  }

  const resizeObserver = new ResizeObserver(() => { updateSize(); });
  resizeObserver.observe(container);

  requestAnimationFrame(drawElectricBorder);
})();


/* === GSAP SCROLL ANIMATIONS === */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  function wrapWords(element) {
    if (!element) return;
    const nodes = Array.from(element.childNodes);
    element.innerHTML = '';
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim().length > 0) {
            const wrapper = document.createElement('span');
            wrapper.className = 'word-wrapper';
            const masked = document.createElement('span');
            masked.className = 'masked-word';
            masked.textContent = word;
            wrapper.appendChild(masked);
            element.appendChild(wrapper);
          } else {
            element.appendChild(document.createTextNode(word));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName.toLowerCase() === 'br') {
          element.appendChild(document.createElement('br'));
        } else {
          const clonedNode = node.cloneNode(false);
          wrapWords(node);
          clonedNode.innerHTML = node.innerHTML;
          element.appendChild(clonedNode);
        }
      }
    });
  }

  const heroTitle = document.querySelector('#hero-section h1');
  if (heroTitle) { wrapWords(heroTitle); }

  const heroBadge = document.querySelector('#hero-section .hero-content > div:first-of-type');
  const heroSub = document.querySelector('#hero-section ul');
  const heroModem = document.querySelector('#hero-section .hero-image-wrapper');

  gsap.to('#hero-section h1 .masked-word', {
    y: '0%', duration: 1.2, stagger: 0, ease: 'power4.out', delay: 0.1
  });

  gsap.fromTo([heroBadge, heroSub, heroModem],
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, stagger: 0, ease: 'power3.out', delay: 0.1 }
  );

  gsap.fromTo('#planos h2, #planos .badge',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '#planos', start: 'top 85%' } }
  );

  gsap.fromTo('#grid-residencial .glass-card',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '#grid-residencial', start: 'top 85%' },
      clearProps: "transform" }
  );

  gsap.fromTo('#grid-movel .glass-card',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '#grid-movel', start: 'top 85%' },
      clearProps: "transform" }
  );

  gsap.fromTo('#electric-combo-card',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#electric-combo-card', start: 'top 85%' } }
  );

  gsap.fromTo('#nosso-app .scroll-reveal.from-left',
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#nosso-app', start: 'top 80%' } }
  );

  gsap.fromTo('#nosso-app .scroll-reveal:not(.from-left)',
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#nosso-app', start: 'top 80%' } }
  );

  gsap.fromTo('#depoimentos .scroll-reveal',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#depoimentos', start: 'top 80%' } }
  );

  gsap.fromTo('#dep-viewport',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#dep-viewport', start: 'top 85%' } }
  );

  gsap.fromTo('#footer .scroll-reveal',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '#footer', start: 'top 90%' } }
  );

  const nav = document.querySelector('nav.nav-dark-theme');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        nav.style.top = '0.5rem';
        nav.style.boxShadow = '0 8px 32px rgba(5, 108, 242, 0.18)';
      } else {
        nav.style.top = '1.25rem';
        nav.style.boxShadow = '0 12px 40px rgba(5, 108, 242, 0.3)';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});


/* === MODEM IMAGE SWAP (mobile/desktop) === */
(function () {
  var img = document.getElementById('modem-hero-img');
  if (!img) return;
  var mq = window.matchMedia('(max-width: 768px)');
  function swap(e) {
    img.src = e.matches ? 'assets/img/moldemmm.png' : 'assets/img/moldemIMG.png';
  }
  swap(mq);
  mq.addEventListener('change', swap);
})();
