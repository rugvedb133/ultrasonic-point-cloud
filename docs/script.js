'use strict';

/* Interactive spherical-coordinates viewer.
   three.js is only downloaded when the visitor clicks the button. If that
   fails (offline, no WebGL, old browser) the static diagram stays visible. */
(function () {
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  var btn = document.getElementById('viewer-toggle');
  if (!btn) return;

  var staticView = document.getElementById('coords-static');
  var viewer = document.getElementById('coords-viewer');
  var msg = document.getElementById('viewer-msg');
  var api = null;

  function setMode(on) {
    viewer.hidden = !on;
    staticView.hidden = on;
    btn.textContent = on ? 'Back to diagram' : 'Start interactive viewer';
    btn.setAttribute('aria-expanded', String(on));
    if (on && api) api.resize();
  }

  async function start() {
    btn.disabled = true;
    btn.textContent = 'Loading viewer\u2026';
    msg.hidden = true;
    try {
      var THREE = api ? null : await import(THREE_URL);
      setMode(true); // show first so the canvas can measure its container
      if (!api) api = createScene(THREE);
    } catch (err) {
      setMode(false);
      msg.textContent = 'The interactive viewer could not start (it needs WebGL and a connection to load three.js), so the static diagram stays.';
      msg.hidden = false;
    } finally {
      btn.disabled = false;
    }
  }

  btn.addEventListener('click', function () {
    if (!viewer.hidden) setMode(false);
    else start();
  });

  function createScene(THREE) {
    var $ = function (id) { return document.getElementById(id); };
    var wrap = $('scene');
    var pan = $('pan'), tilt = $('tilt'), dist = $('dist');
    var SCALE = 0.01; // 1 scene unit = 100 cm

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // throws without WebGL
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Interactive 3D view of a point at the chosen pan, tilt and distance. Drag or use the arrow keys to look around.');
    wrap.appendChild(canvas);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1.6, 0.1, 100);
    camera.up.set(0, 0, 1); // z is up, matching the diagram

    var grid = new THREE.GridHelper(8, 16, 0x6f7bc0, 0x4b4e7a);
    grid.rotation.x = Math.PI / 2; // lay the grid in the x-y plane
    scene.add(grid);

    function makeLine(color, dashed) {
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      var mat = dashed
        ? new THREE.LineDashedMaterial({ color: color, dashSize: 0.08, gapSize: 0.06 })
        : new THREE.LineBasicMaterial({ color: color });
      var line = new THREE.Line(geo, mat);
      scene.add(line);
      return {
        set: function (a, b) {
          geo.attributes.position.set(a.concat(b));
          geo.attributes.position.needsUpdate = true;
          if (dashed) line.computeLineDistances();
        }
      };
    }
    var axes = [[0xe0383f, [3.8, 0, 0]], [0x35d07f, [0, 3.8, 0]], [0x6f86ff, [0, 0, 3.8]]];
    axes.forEach(function (a) { makeLine(a[0], false).set([0, 0, 0], a[1]); });
    var ray = makeLine(0xf08a24, false);
    var drop = makeLine(0xb4b9d8, true);
    var foot = makeLine(0xb4b9d8, true);

    var dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), new THREE.MeshBasicMaterial({ color: 0xd3222a }));
    scene.add(dot);

    var dropped = [];
    var cloud = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xf2f4ff, size: 0.07 }));
    scene.add(cloud);

    // camera orbit
    var az = -0.8, pol = 1.15, rad = 9;
    function placeCamera() {
      camera.position.set(rad * Math.sin(pol) * Math.cos(az), rad * Math.sin(pol) * Math.sin(az), 0.8 + rad * Math.cos(pol));
      camera.lookAt(0, 0, 0.8);
    }
    function orbit(dAz, dPol) {
      az += dAz;
      pol = Math.min(Math.max(pol + dPol, 0.2), Math.PI - 0.2);
      placeCamera();
      render();
    }
    var last = null;
    canvas.addEventListener('pointerdown', function (e) { last = e; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (!last) return;
      orbit(-(e.clientX - last.clientX) * 0.008, -(e.clientY - last.clientY) * 0.008);
      last = e;
    });
    ['pointerup', 'pointercancel'].forEach(function (n) { canvas.addEventListener(n, function () { last = null; }); });
    canvas.addEventListener('keydown', function (e) {
      var k = { ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key];
      if (k) { e.preventDefault(); orbit(k[0], k[1]); }
    });

    function render() { renderer.render(scene, camera); }
    function resize() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(wrap);

    var cur = [0, 0, 0];
    function update() {
      var t = pan.value * Math.PI / 180, p = tilt.value * Math.PI / 180, r = +dist.value;
      var x = r * Math.sin(p) * Math.cos(t), y = r * Math.sin(p) * Math.sin(t), z = r * Math.cos(p);
      cur = [x * SCALE, y * SCALE, z * SCALE];
      $('pan-out').value = pan.value + '\u00b0';
      $('tilt-out').value = tilt.value + '\u00b0';
      $('dist-out').value = r + ' cm';
      $('xyz').textContent = 'x = ' + x.toFixed(1) + '  y = ' + y.toFixed(1) + '  z = ' + z.toFixed(1) + '  (cm)';
      dot.position.set(cur[0], cur[1], cur[2]);
      ray.set([0, 0, 0], cur);
      drop.set([cur[0], cur[1], 0], cur);
      foot.set([0, 0, 0], [cur[0], cur[1], 0]);
      render();
    }
    [pan, tilt, dist].forEach(function (el) { el.addEventListener('input', update); });

    function syncCloud() {
      cloud.geometry.dispose();
      cloud.geometry = new THREE.BufferGeometry();
      cloud.geometry.setAttribute('position', new THREE.Float32BufferAttribute(dropped, 3));
      render();
    }
    $('drop').addEventListener('click', function () { dropped.push(cur[0], cur[1], cur[2]); syncCloud(); });
    $('clear').addEventListener('click', function () { dropped = []; syncCloud(); });

    placeCamera();
    update();
    resize();
    return { resize: resize };
  }
})();

/* Table of contents: mark the section being read with aria-current. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (!links.length) return;

  var items = links.map(function (a) {
    return { link: a, section: document.getElementById(a.getAttribute('href').slice(1)) };
  }).filter(function (item) { return item.section; });
  var strip = links[0].closest('ul');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var current = null;
  var queued = false;

  function pick() {
    queued = false;
    var line = window.innerHeight * 0.3; // a section is current once its top passes this line
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    var found = null;
    items.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= line) found = item;
    });
    if (atBottom) found = items[items.length - 1];
    if (found === current) return;
    current = found;
    items.forEach(function (item) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
    // keep the active link visible when the bar scrolls sideways on small screens
    if (current && strip.scrollWidth > strip.clientWidth) {
      var a = current.link;
      strip.scrollTo({ left: a.offsetLeft - (strip.clientWidth - a.offsetWidth) / 2, behavior: reduce.matches ? 'auto' : 'smooth' });
    }
  }

  function queue() {
    if (!queued) { queued = true; window.requestAnimationFrame(pick); }
  }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  pick();
})();

/* Lightbox: any element with data-target opens a copy of the element with that id in the single <dialog>. */
(function () {
  var dlg = document.getElementById('lightbox');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var body = document.getElementById('lightbox-body');
  var caption = document.getElementById('lightbox-caption');
  var containers = Array.prototype.slice.call(document.querySelectorAll('[data-target]'));

  // A click inside an <object> never reaches the page, so every container also gets a real button.
  // Added here, not in the HTML, so there is no dead button without JavaScript.
  containers.forEach(function (box) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'enlarge';
    btn.textContent = 'Enlarge';
    btn.setAttribute('aria-label', 'Enlarge ' + (box.dataset.label || 'this image'));
    box.appendChild(btn);
  });

  function open(box) {
    var target = document.getElementById(box.dataset.target);
    if (!target) return;

    var clone = target.cloneNode(true);
    clone.removeAttribute('id');
    Array.prototype.forEach.call(clone.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
    if (clone.tagName === 'IMG') clone.loading = 'eager';
    if (clone.tagName === 'OBJECT') {
      var w = parseFloat(clone.getAttribute('width')), h = parseFloat(clone.getAttribute('height'));
      if (w && h) clone.style.setProperty('--ar', String(w / h));
    }

    var cap = box.querySelector('figcaption');
    caption.textContent = cap ? cap.textContent : '';
    caption.hidden = !cap;
    dlg.setAttribute('aria-label', target.getAttribute('alt') || target.getAttribute('aria-label') || 'Enlarged view');

    body.replaceChildren(clone);
    dlg.showModal();
  }

  document.addEventListener('click', function (e) {
    var box = e.target.closest('[data-target]');
    if (box && !dlg.contains(box)) open(box);
  });
  document.getElementById('lightbox-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // click on the backdrop
  dlg.addEventListener('close', function () { body.replaceChildren(); });
})();
