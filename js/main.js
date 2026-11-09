/* buro OSNOVA — landing scripts. © 2026 Полунин Лев */
(function () {
  'use strict';
  var d = document, w = window;
  d.documentElement.classList.add('js');
  var WA = 'https://wa.me/77475133001?text=';
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header + mobile bar ---------- */
  var hdr = $('.hdr'), mbar = $('.mbar');
  function onScroll() {
    var y = w.pageYOffset || d.documentElement.scrollTop;
    hdr.classList.toggle('is-scrolled', y > 20);
    if (mbar) mbar.classList.toggle('is-on', y > w.innerHeight * 0.6);
  }
  w.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Burger ---------- */
  var burger = $('#burger'), nav = $('#nav');
  function setNav(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    d.body.classList.toggle('nav-open', open);
  }
  burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setNav(false); closeLb(); }
  });
  w.addEventListener('resize', function () { if (w.innerWidth > 1024) setNav(false); });

  /* ---------- Active nav link ---------- */
  var links = $$('.nav > a[href^="#"]');
  if ('IntersectionObserver' in w) {
    var secObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) secObs.observe(s); });
  }

  /* ---------- Reveal ---------- */
  var rvTargets = $$('.sec__head, .paper, .clip, .pack__note, .ticket, .pricelist__col, .cert__text, .cert__stage, .rib-card, .kit, .work, .qa, .contacts__info, .map');
  if ('IntersectionObserver' in w && !reduce) {
    var rvObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); rvObs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rvTargets.forEach(function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      rvObs.observe(el);
    });
  }

  /* ---------- Lazy videos (play only when visible) ---------- */
  var vids = $$('video[data-lazy-video]');
  function loadVid(v) {
    if (v.dataset.loaded) return;
    $$('source[data-src]', v).forEach(function (s) { s.src = s.dataset.src; });
    v.load(); v.dataset.loaded = '1';
  }
  if ('IntersectionObserver' in w) {
    var vObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          loadVid(v);
          if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '200px 0px', threshold: 0.1 });
    vids.forEach(function (v) { vObs.observe(v); });
  } else {
    vids.forEach(function (v) { loadVid(v); });
  }

  /* ---------- Paper flip on touch ---------- */
  $$('.paper').forEach(function (p) {
    p.addEventListener('click', function () { p.classList.toggle('is-flipped'); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.classList.toggle('is-flipped'); } });
  });

  /* ---------- Currency toggle ---------- */
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function setCur(cur) {
    $$('.cur__btn').forEach(function (b) {
      var on = b.dataset.cur === cur;
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $$('.price[data-kzt]').forEach(function (el) {
      el.classList.add('is-swap');
      setTimeout(function () {
        var val = el.dataset[cur], sign = cur === 'kzt' ? ' ₸' : ' ₽';
        el.textContent = (el.hasAttribute('data-from') ? 'от ' : '') + fmt(val) + sign;
        el.classList.remove('is-swap');
      }, 180);
    });
    try { localStorage.setItem('osnova-cur', cur); } catch (e) {}
  }
  $$('.cur__btn').forEach(function (b) { b.addEventListener('click', function () { setCur(b.dataset.cur); }); });
  try { var saved = localStorage.getItem('osnova-cur'); if (saved === 'rub') setCur('rub'); } catch (e) {}

  /* ---------- Certificate ---------- */
  var gc = $('#gc'), env = $('#envelope'), envBtn = $('#envBtn'), amount = $('#gcAmount');
  if (gc) {
    var canHover = w.matchMedia && w.matchMedia('(hover: hover)').matches;
    function tilt(x, y) {
      var r = env.getBoundingClientRect();
      var px = Math.min(Math.max((x - r.left) / r.width, 0), 1);
      var py = Math.min(Math.max((y - r.top) / r.height, 0), 1);
      gc.style.setProperty('--ry', ((px - 0.5) * 18).toFixed(2) + 'deg');
      gc.style.setProperty('--rx', ((0.5 - py) * 14).toFixed(2) + 'deg');
      gc.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      gc.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    }
    function resetTilt() { gc.style.setProperty('--rx', '0deg'); gc.style.setProperty('--ry', '0deg'); }
    if (!reduce) {
      if (canHover) {
        env.addEventListener('pointermove', function (e) { tilt(e.clientX, e.clientY); });
        env.addEventListener('pointerleave', resetTilt);
      } else {
        env.addEventListener('touchmove', function (e) { var t = e.touches[0]; tilt(t.clientX, t.clientY); }, { passive: true });
        env.addEventListener('touchend', resetTilt);
        /* мягкий автоблик на тач-устройствах */
        var t0 = 0;
        (function shimmer(ts) {
          if (!t0) t0 = ts;
          var k = ((ts - t0) / 4000) % 1;
          gc.style.setProperty('--mx', (50 + Math.sin(k * Math.PI * 2) * 45).toFixed(1) + '%');
          w.requestAnimationFrame(shimmer);
        })(0);
      }
    }
    function toggleEnv() {
      var open = !env.classList.contains('is-open');
      env.classList.toggle('is-open', open);
      envBtn.setAttribute('aria-pressed', open ? 'true' : 'false');
      envBtn.textContent = open ? 'Вернуть в конверт' : 'Достать из конверта';
    }
    envBtn.addEventListener('click', toggleEnv);
    env.addEventListener('click', function (e) { if (e.target.closest('.gc') || e.target.closest('.envelope__back')) toggleEnv(); });
    $$('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        $$('.chip').forEach(function (o) { o.classList.remove('is-on'); o.setAttribute('aria-checked', 'false'); });
        c.classList.add('is-on'); c.setAttribute('aria-checked', 'true');
        amount.textContent = c.dataset.amount;
        $('#gcNum').textContent = String(Math.floor(100 + Math.random() * 9800)).padStart(4, '0');
      });
    });
  }

  /* ---------- Ribbon palette ---------- */
  var loop = $('#ribbonLoop'), rName = $('#ribbonName'), ctaName = $('#ribbonCtaName'), rCta = $('#ribbonCta');
  function setRibbon(btn) {
    $$('.palette button').forEach(function (b) { b.classList.remove('is-on'); b.setAttribute('aria-checked', 'false'); });
    btn.classList.add('is-on'); btn.setAttribute('aria-checked', 'true');
    var c = btn.style.getPropertyValue('--c'), n = btn.dataset.name;
    loop.style.setProperty('--rb', c);
    rName.textContent = n; ctaName.textContent = n;
    rName.style.color = c;
    rCta.href = WA + encodeURIComponent('ЛЕНТА. Здравствуйте! Интересует бархатная лента, цвет «' + n + '». Подскажите ширину, стоимость и сроки.');
  }
  $$('.palette button').forEach(function (b) { b.addEventListener('click', function () { setRibbon(b); }); });
  var firstRb = $('.palette button.is-on'); if (firstRb) setRibbon(firstRb);

  /* ---------- Kit builder ---------- */
  var kit = $('#kit');
  if (kit) {
    var list = $('#kitList'), count = $('#kitCount'), send = $('#kitSend'), biz = $('#kitBiz');
    function upd() {
      var sel = $$('input[name="kit"]:checked', kit).map(function (i) { return i.value; });
      count.textContent = sel.length;
      send.disabled = !sel.length;
      list.innerHTML = '';
      if (!sel.length) { var li = d.createElement('li'); li.className = 'kit__empty'; li.textContent = 'Пока пусто — отметьте хотя бы одну позицию'; list.appendChild(li); return; }
      sel.forEach(function (s) { var li = d.createElement('li'); li.textContent = s; list.appendChild(li); });
    }
    kit.addEventListener('change', upd);
    kit.addEventListener('submit', function (e) {
      e.preventDefault();
      var sel = $$('input[name="kit"]:checked', kit).map(function (i, n) { return (n + 1) + '. ' + i.value; });
      if (!sel.length) return;
      var msg = 'Здравствуйте! Хочу собрать фирменный комплект:\n' + sel.join('\n');
      if (biz.value.trim()) msg += '\nСфера: ' + biz.value.trim();
      msg += '\nПодскажите стоимость и сроки.';
      w.open(WA + encodeURIComponent(msg), '_blank', 'noopener');
    });
    upd();
  }

  /* ---------- Reviews slider ---------- */
  var slider = $('#revSlider'), track = $('#revTrack');
  if (slider && track) {
    var slides = $$('.review', track), dotsWrap = $('#revDots'), prev = $('#revPrev'), next = $('#revNext');
    var idx = 0, perView = 3, maxIdx = 0, dots = [];
    function calc() {
      perView = w.innerWidth <= 700 ? 1 : (w.innerWidth <= 1024 ? 2 : 3);
      maxIdx = Math.max(0, slides.length - perView);
      dotsWrap.innerHTML = ''; dots = [];
      for (var i = 0; i <= maxIdx; i++) {
        var b = d.createElement('button');
        b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Отзыв ' + (i + 1));
        (function (n) { b.addEventListener('click', function () { go(n); }); })(i);
        dotsWrap.appendChild(b); dots.push(b);
      }
      go(Math.min(idx, maxIdx), true);
    }
    function offsetFor(n) { return slides[n] ? slides[n].offsetLeft - slides[0].offsetLeft : 0; }
    function go(n, instant) {
      idx = Math.max(0, Math.min(n, maxIdx));
      if (instant) track.style.transition = 'none';
      track.style.transform = 'translate3d(' + (-offsetFor(idx)) + 'px,0,0)';
      if (instant) { track.offsetHeight; track.style.transition = ''; }
      dots.forEach(function (b, i) { b.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
      prev.disabled = idx === 0; next.disabled = idx === maxIdx;
      slides.forEach(function (s, i) { s.setAttribute('aria-hidden', (i < idx || i >= idx + perView) ? 'true' : 'false'); });
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
    });

    /* swipe / drag */
    var sx = 0, sy = 0, dx = 0, dragging = false, locked = null;
    function start(x, y) { sx = x; sy = y; dx = 0; dragging = true; locked = null; }
    function move(x, y, e) {
      if (!dragging) return;
      var mx = x - sx, my = y - sy;
      if (locked === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) locked = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (locked !== 'x') return;
      if (e && e.cancelable) e.preventDefault();
      dx = mx; slider.classList.add('is-drag');
      var edge = (idx === 0 && dx > 0) || (idx === maxIdx && dx < 0) ? 0.35 : 1;
      track.style.transform = 'translate3d(' + (-offsetFor(idx) + dx * edge) + 'px,0,0)';
    }
    function end() {
      if (!dragging) return;
      dragging = false; slider.classList.remove('is-drag');
      var th = Math.min(80, slider.offsetWidth * 0.12);
      if (locked === 'x' && dx < -th) go(idx + 1); else if (locked === 'x' && dx > th) go(idx - 1); else go(idx);
    }
    slider.addEventListener('touchstart', function (e) { start(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    slider.addEventListener('touchmove', function (e) { move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
    slider.addEventListener('touchend', end);
    slider.addEventListener('touchcancel', end);
    slider.addEventListener('mousedown', function (e) { e.preventDefault(); start(e.clientX, e.clientY); });
    w.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY, e); });
    w.addEventListener('mouseup', end);

    var rt; w.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(calc, 150); });
    calc();

    /* autoplay while visible and not interacted */
    var auto = null, touched = false;
    ['mousedown', 'touchstart', 'focusin'].forEach(function (ev) { slider.addEventListener(ev, function () { touched = true; }, { passive: true }); });
    [prev, next].forEach(function (b) { b.addEventListener('click', function () { touched = true; }); });
    if (!reduce && 'IntersectionObserver' in w) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          clearInterval(auto);
          if (e.isIntersecting) auto = setInterval(function () { if (!touched) go(idx >= maxIdx ? 0 : idx + 1); }, 5500);
        });
      }, { threshold: 0.4 }).observe(slider);
    }
  }

  /* ---------- Lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lastFocus = null;
  function openLb(src, alt) {
    lastFocus = d.activeElement;
    lbImg.src = src; lbImg.alt = alt || '';
    lb.hidden = false; d.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }
  function closeLb() {
    if (!lb || lb.hidden) return;
    lb.hidden = true; d.body.style.overflow = ''; lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }
  $$('.work[data-full]').forEach(function (b) {
    b.addEventListener('click', function () { var im = $('img', b); openLb(b.dataset.full, im ? im.alt : ''); });
  });
  if (lb) {
    $('#lbClose').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  }

  /* ---------- Map: load on demand / when near ---------- */
  var map = $('#map'), mapBtn = $('#mapLoad');
  function loadMap() {
    if (!map || map.dataset.loaded) return;
    var f = d.createElement('iframe');
    f.src = map.dataset.src; f.title = 'buro OSNOVA на карте: Костанай, проспект Аль-Фараби, 19';
    f.loading = 'lazy'; f.setAttribute('allowfullscreen', '');
    f.referrerPolicy = 'no-referrer-when-downgrade';
    map.appendChild(f); map.dataset.loaded = '1';
    if (mapBtn) mapBtn.remove();
  }
  if (mapBtn) mapBtn.addEventListener('click', loadMap);
  if (map && 'IntersectionObserver' in w) {
    var mObs = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadMap(); mObs.disconnect(); } }, { rootMargin: '300px 0px' });
    mObs.observe(map);
  }

  /* ---------- Year ---------- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
