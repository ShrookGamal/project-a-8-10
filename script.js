(function () {
  'use strict';

  var html = document.documentElement;
  var hdr = document.getElementById('hdr');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var veil = document.getElementById('veil');
  var links = Array.prototype.slice.call(document.querySelectorAll('.lnk'));
  var ticking = false;

  function openMenu() {
    nav.classList.add('open');
    veil.classList.add('show');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'إغلاق القائمة');
    html.classList.add('lock');
  }

  function closeMenu() {
    nav.classList.remove('open');
    veil.classList.remove('show');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'فتح القائمة');
    html.classList.remove('lock');
  }

  burger.addEventListener('click', function () {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  veil.addEventListener('click', closeMenu);

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1100) {
      closeMenu();
    }
  });

  function setActive(target) {
    links.forEach(function (link) {
      link.classList.toggle('act', link === target);
    });
  }

  function update() {
    ticking = false;

    hdr.classList.toggle('sc', window.scrollY > 30);

    var y = window.scrollY + window.innerHeight * 0.35;
    var current = links[0];
    var lastFound = links[0];

    links.forEach(function (link) {
      var id = link.getAttribute('href');
      var section = id && id.charAt(0) === '#' ? document.querySelector(id) : null;
      if (section) {
        lastFound = link;
        if (section.offsetTop <= y) {
          current = link;
        }
      }
    });

    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom && window.scrollY > 0) {
      current = lastFound;
    }

    setActive(current);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', update);
  update();
})();
(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.rv'));

  function countUp(el) {
    if (el.getAttribute('data-done')) {
      return;
    }
    el.setAttribute('data-done', '1');

    var target = parseInt(el.getAttribute('data-n'), 10) || 0;
    var start = null;

    function step(ts) {
      if (start === null) {
        start = ts;
      }
      var p = Math.min((ts - start) / 1800, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function reveal(el) {
    el.classList.add('in');
    var counters = el.querySelectorAll('[data-n]');
    Array.prototype.forEach.call(counters, countUp);
  }

  if (!('IntersectionObserver' in window)) {
    items.forEach(reveal);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        reveal(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  items.forEach(function (el) {
    io.observe(el);
  });
})();
(function () {
  'use strict';

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sv-tab'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.sv'));

  if (!tabs.length || !cards.length) {
    return;
  }

  function filterBy(key) {
    cards.forEach(function (card) {
      var match = key === 'all' || card.getAttribute('data-c') === key;
      card.classList.toggle('off', !match);
      card.classList.remove('pop');
      if (match) {
        card.classList.add('in');
        void card.offsetWidth;
        card.classList.add('pop');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('on', on);
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      filterBy(tab.getAttribute('data-f'));
    });
  });
})();
(function () {
  'use strict';

  var steps = document.getElementById('hwSteps');
  var fill = document.getElementById('hwFill');

  if (!steps || !fill) {
    return;
  }

  var nodes = Array.prototype.slice.call(steps.querySelectorAll('.hw-node'));
  var ticking = false;

  function update() {
    ticking = false;

    var rect = steps.getBoundingClientRect();
    var mid = window.innerHeight * 0.55;
    var p = (mid - rect.top) / rect.height;
    p = Math.max(0, Math.min(1, p));

    fill.style.height = (p * 100) + '%';

    nodes.forEach(function (node) {
      var r = node.getBoundingClientRect();
      var center = r.top + r.height / 2;
      node.classList.toggle('on', center < mid);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
})();
(function () {
  'use strict';

  var list = document.getElementById('fqList');

  if (!list) {
    return;
  }

  var items = Array.prototype.slice.call(list.querySelectorAll('.fq-q'));

  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) {
        return;
      }
      items.forEach(function (other) {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    });
  });
})();
(function () {
  'use strict';

  var tracks = Array.prototype.slice.call(document.querySelectorAll('.rw-track'));

  tracks.forEach(function (track) {
    var originals = Array.prototype.slice.call(track.children);

    originals.forEach(function (card) {
      var copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  });
})();
(function () {
  'use strict';

  var canHover = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (!canHover) {
    return;
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('.wy-in'));

  cards.forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
    });

    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
})();
(function () {
  'use strict';

  var form = document.getElementById('ctForm');
  var note = document.getElementById('ctNote');
  var yr = document.getElementById('ftYear');
  var up = document.getElementById('fxUp');
  var ticking = false;

  if (yr) {
    yr.textContent = new Date().getFullYear();
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        if (up) {
          up.classList.toggle('show', window.scrollY > 500);
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!form) {
    return;
  }

  var nameEl = document.getElementById('ctName');
  var phoneEl = document.getElementById('ctPhone');
  var serviceEl = document.getElementById('ctService');
  var msgEl = document.getElementById('ctMsg');

  function mark(el, bad) {
    var box = el.closest('.ct-f');
    if (box) {
      box.classList.toggle('bad', bad);
    }
  }

  function show(text, type) {
    note.textContent = text;
    note.className = 'ct-note ' + type;
  }

  [nameEl, phoneEl].forEach(function (el) {
    el.addEventListener('input', function () {
      mark(el, false);
      note.textContent = '';
      note.className = 'ct-note';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = nameEl.value.trim();
    var phone = phoneEl.value.trim();
    var digits = phone.replace(/[^0-9٠-٩]/g, '');
    var okName = name.length >= 2;
    var okPhone = digits.length >= 8;

    mark(nameEl, !okName);
    mark(phoneEl, !okPhone);

    if (!okName) {
      show('من فضلك اكتب اسمك.', 'err');
      nameEl.focus();
      return;
    }

    if (!okPhone) {
      show('من فضلك اكتب رقم جوال صحيح.', 'err');
      phoneEl.focus();
      return;
    }

    var lines = [
      'السلام عليكم، أرغب في طلب خدمة.',
      '',
      'الاسم: ' + name,
      'رقم الجوال: ' + phone,
      'الخدمة المطلوبة: ' + serviceEl.value
    ];

    var msg = msgEl.value.trim();
    if (msg) {
      lines.push('التفاصيل: ' + msg);
    }

    var url = 'https://wa.me/966571153457?text=' + encodeURIComponent(lines.join('\n'));
    var win = window.open(url, '_blank', 'noopener');

    if (!win) {
      window.location.href = url;
    }

    show('تم تجهيز طلبك، أكمل الإرسال من واتساب. شكراً لتواصلك معنا.', 'ok');
    form.reset();
  });
})();