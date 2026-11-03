/**
 * MISSION CONTROL CONSOLE ENGINE: BLACK & DARK PURPLE
 * Personal Portfolio for Nishtha Kapoor — Data Science & Analytics
 */

document.addEventListener('DOMContentLoaded', () => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [...document.querySelectorAll('main section[id]')];
  const header = document.querySelector('.site-header');
  const tabs = [...document.querySelectorAll('.tabs a')];

  /* ==========================================================================
     1. SCRAMBLE TEXT EFFECT (MISSION CONTROL TELEMETRY RESOLUTION)
     ========================================================================== */
  const scrambled = new WeakSet();

  function randomLike(ch) {
    if (/\p{Lu}/u.test(ch)) return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    if (/\p{Ll}/u.test(ch)) return String.fromCharCode(97 + Math.floor(Math.random() * 26));
    if (/\p{Nd}/u.test(ch)) return String(Math.floor(Math.random() * 10));
    return ch;
  }

  function scramble(el, delay = 0) {
    if (!el || motion.matches || scrambled.has(el)) return;
    scrambled.add(el);

    const real = [...el.textContent.trim()];
    const view = document.createElement('span');
    view.className = 'sc-view';
    view.setAttribute('aria-hidden', 'true');

    const cells = real.map((ch) => {
      const cell = document.createElement('span');
      cell.textContent = ch;
      view.append(cell);
      return cell;
    });

    const settleAt = real.map((_, i) => (i / real.length) * 0.75 + Math.random() * 0.25);
    el.classList.add('is-scrambling');
    el.append(view);

    const DURATION = 700;
    const TICK = 45;
    let start = 0;
    let lastTick = -TICK;

    function frame(now) {
      if (!start) start = now + delay;
      const t = now - start;

      if (t >= DURATION) {
        view.remove();
        el.classList.remove('is-scrambling');
        return;
      }

      if (t >= 0 && now - lastTick >= TICK) {
        lastTick = now;
        cells.forEach((cell, i) => {
          const settled = t / DURATION >= settleAt[i];
          cell.textContent = settled ? real[i] : randomLike(real[i]);
          cell.classList.toggle('sc-live', !settled && cell.textContent !== ' ');
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Trigger initial hero scramble
  const heroTitle = document.querySelector('.hero-name');
  if (heroTitle) {
    scramble(heroTitle, 150);
  }

  /* ==========================================================================
     2. PANEL RAMP-IN ON SCROLL
     ========================================================================== */
  function ramp(panel, instant = false) {
    if (!panel) return;
    if (instant) panel.classList.add('is-instant');
    if (panel.classList.contains('is-ramped')) return;
    panel.classList.add('is-ramped');
    if (!instant) {
      const heading = panel.querySelector('.scramble');
      if (heading) scramble(heading, 100);
    }
  }

  function replay(panel) {
    if (motion.matches || !panel) return;
    panel.classList.remove('is-ramped', 'is-instant');
    void panel.offsetWidth; // Force reflow
    panel.classList.add('is-ramped');
  }

  if (!motion.matches && 'IntersectionObserver' in window) {
    const arrival = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            ramp(entry.target);
            arrival.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px' }
    );

    document.querySelectorAll('main .panel').forEach((panel) => {
      panel.classList.add('will-ramp');
      arrival.observe(panel);
    });

    // Keyboard Tab access
    document.addEventListener('focusin', (event) => {
      const panel = event.target.closest('.will-ramp');
      if (panel) ramp(panel, true);
    });
  }

  /* ==========================================================================
     3. STICKY TABS & SCROLLSPY
     ========================================================================== */
  let jumpedTo = '';
  let spyQueued = false;

  const releaseJump = () => { jumpedTo = ''; };
  window.addEventListener('wheel', releaseJump, { passive: true });
  window.addEventListener('touchmove', releaseJump, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
      releaseJump();
    }
  });

  function selectTab(id) {
    tabs.forEach((tab) => {
      const on = tab.hash === '#' + id;
      if (on && tab.getAttribute('aria-current') !== 'location') {
        tab.setAttribute('aria-current', 'location');
      } else if (!on && tab.hasAttribute('aria-current')) {
        tab.removeAttribute('aria-current');
      }
    });
  }

  function spy() {
    spyQueued = false;
    if (!header || sections.length === 0) return;

    const line = header.offsetHeight + window.innerHeight * 0.25;
    const tops = sections.map((sec) => sec.getBoundingClientRect());
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    let currentId = sections[0].id;
    sections.forEach((sec, i) => {
      if (tops[i].top <= line) currentId = sec.id;
    });

    if (atBottom) currentId = sections[sections.length - 1].id;
    if (window.scrollY < 10) currentId = sections[0].id;

    const jumpedIdx = sections.findIndex((sec) => sec.id === jumpedTo);
    if (jumpedIdx > -1 && (tops[jumpedIdx].bottom < 0 || tops[jumpedIdx].top > window.innerHeight)) {
      jumpedTo = '';
    }

    selectTab(jumpedTo || currentId);
    if (atBottom) ramp(sections[sections.length - 1]);
  }

  function queueSpy() {
    if (!spyQueued) {
      spyQueued = true;
      requestAnimationFrame(spy);
    }
  }

  window.addEventListener('scroll', queueSpy, { passive: true });
  window.addEventListener('resize', queueSpy);
  window.addEventListener('hashchange', () => {
    const target = document.getElementById(location.hash.slice(1));
    jumpedTo = target && target.matches('main section[id]') ? target.id : '';
    if (jumpedTo) selectTab(jumpedTo);
    if (target && target.classList.contains('will-ramp') && target.classList.contains('is-ramped')) {
      replay(target);
    }
  });

  spy();

  /* ==========================================================================
     4. NEURAL NETWORK CONSOLE ENGINE (REPLACES CIRCULAR ORBIT)
     ========================================================================== */
  const neuralSvg = document.querySelector('.neural-svg');
  const neuralToggle = document.querySelector('.neural-toggle');

  if (neuralSvg) {
    const synapseLayer = neuralSvg.querySelector('.synapse-layer');
    const neuronLayer = neuralSvg.querySelector('.neuron-layer');
    const packetLayer = neuralSvg.querySelector('.packet-layer');

    // Multi-layer Neural Network Architecture: 4 -> 5 -> 5 -> 3
    const layers = [
      { id: 'input', x: 55, count: 4, yOffsets: [60, 115, 170, 225] },
      { id: 'hidden1', x: 160, count: 5, yOffsets: [45, 95, 145, 195, 245] },
      { id: 'hidden2', x: 270, count: 5, yOffsets: [45, 95, 145, 195, 245] },
      { id: 'output', x: 375, count: 3, yOffsets: [85, 145, 205] }
    ];

    const nodes = [];
    const synapses = [];

    // Construct Nodes
    layers.forEach((layer, layerIdx) => {
      layer.yOffsets.forEach((y, nodeIdx) => {
        const nodeId = `n_${layerIdx}_${nodeIdx}`;
        nodes.push({ id: nodeId, layerIdx, nodeIdx, x: layer.x, y: y });

        // Node SVG group
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', `neuron-node layer-${layer.id}`);
        g.setAttribute('id', nodeId);

        // Node base
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', layer.x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', layer.id === 'output' ? '8.5' : '7.5');
        circle.setAttribute('class', 'neuron-base');

        // Node center pip
        const pip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pip.setAttribute('cx', layer.x);
        pip.setAttribute('cy', y);
        pip.setAttribute('r', '2.5');
        pip.setAttribute('class', 'neuron-center');

        g.appendChild(circle);
        g.appendChild(pip);
        neuronLayer.appendChild(g);
      });
    });

    // Construct Synapses (Inter-layer connections)
    for (let l = 0; l < layers.length - 1; l++) {
      const fromNodes = nodes.filter((n) => n.layerIdx === l);
      const toNodes = nodes.filter((n) => n.layerIdx === l + 1);

      fromNodes.forEach((from) => {
        toNodes.forEach((to) => {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', from.x);
          line.setAttribute('y1', from.y);
          line.setAttribute('x2', to.x);
          line.setAttribute('y2', to.y);
          line.setAttribute('class', 'synapse-path');
          synapseLayer.appendChild(line);

          synapses.push({
            from,
            to,
            element: line,
            layerIdx: l
          });
        });
      });
    }

    // Packet / Signal Pulse System
    const packets = [];
    const MAX_PACKETS = 6;
    let animId = 0;
    let isPaused = false;
    let isVisible = false;

    class SignalPacket {
      constructor() {
        this.reset();
        // Stagger initial progress
        this.progress = Math.random();
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.element.setAttribute('r', '3.5');
        this.element.setAttribute('class', 'signal-pulse');
        packetLayer.appendChild(this.element);
      }

      reset() {
        this.currentLayer = 0;
        this.progress = 0;
        this.speed = 0.008 + Math.random() * 0.006;
        this.selectPath();
      }

      selectPath() {
        // Pick an outgoing synapse from the current layer
        const candidateSynapses = synapses.filter((s) => s.layerIdx === this.currentLayer);
        if (this.currentLayer === 0) {
          this.activeSynapse = candidateSynapses[Math.floor(Math.random() * candidateSynapses.length)];
        } else {
          // Continue from previous arrival node if possible, or fallback
          const matching = candidateSynapses.filter((s) => s.from.id === this.arrivalNodeId);
          this.activeSynapse = matching.length > 0
            ? matching[Math.floor(Math.random() * matching.length)]
            : candidateSynapses[Math.floor(Math.random() * candidateSynapses.length)];
        }
      }

      update() {
        if (!this.activeSynapse) return;
        this.progress += this.speed;

        // Active path illumination
        this.activeSynapse.element.classList.add('active');

        if (this.progress >= 1) {
          // Arrived at target node
          this.activeSynapse.element.classList.remove('active');
          const targetNode = this.activeSynapse.to;
          this.arrivalNodeId = targetNode.id;

          // Trigger neuron flash
          const nodeElem = document.getElementById(targetNode.id);
          if (nodeElem) {
            const base = nodeElem.querySelector('.neuron-base');
            const center = nodeElem.querySelector('.neuron-center');
            base.classList.add('firing');
            center.classList.add('firing');
            setTimeout(() => {
              base.classList.remove('firing');
              center.classList.remove('firing');
            }, 200);
          }

          this.currentLayer++;
          this.progress = 0;

          if (this.currentLayer >= layers.length - 1) {
            // Reached output layer, recycle packet
            this.reset();
          } else {
            this.selectPath();
          }
        }

        // Compute current coordinates
        const from = this.activeSynapse.from;
        const to = this.activeSynapse.to;
        const currX = from.x + (to.x - from.x) * this.progress;
        const currY = from.y + (to.y - from.y) * this.progress;

        this.element.setAttribute('cx', currX.toFixed(2));
        this.element.setAttribute('cy', currY.toFixed(2));
      }

      cleanup() {
        if (this.activeSynapse) {
          this.activeSynapse.element.classList.remove('active');
        }
        this.element.remove();
      }
    }

    // Initialize packets
    if (!motion.matches) {
      for (let i = 0; i < MAX_PACKETS; i++) {
        packets.push(new SignalPacket());
      }
    }

    function tick() {
      packets.forEach((p) => p.update());
      animId = requestAnimationFrame(tick);
    }

    function start() {
      if (animId || motion.matches || isPaused || document.hidden || !isVisible) return;
      animId = requestAnimationFrame(tick);
    }

    function stop() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
      // Clear active highlights
      synapses.forEach((s) => s.element.classList.remove('active'));
    }

    // Viewport intersection observer to avoid running off-screen
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    }).observe(neuralSvg);

    // Visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    // Motion preference changes
    motion.addEventListener('change', () => {
      if (motion.matches) {
        stop();
        packets.forEach((p) => p.cleanup());
        packets.length = 0;
      } else {
        for (let i = 0; i < MAX_PACKETS; i++) {
          packets.push(new SignalPacket());
        }
        start();
      }
    });

    // Pause / Resume Button
    if (neuralToggle) {
      neuralToggle.addEventListener('click', () => {
        isPaused = !isPaused;
        neuralToggle.textContent = isPaused ? 'Play network' : 'Pause network';
        if (isPaused) {
          stop();
        } else {
          start();
        }
      });
    }

    // Initial start if visible
    start();
  }

  /* ==========================================================================
     5. PROJECT CATEGORY FILTERS
     ========================================================================== */
  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const projectCards = [...document.querySelectorAll('.project')];

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card) => {
          const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
          if (filter === 'all' || categories.includes(filter)) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }
});

