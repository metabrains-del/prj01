/* ============================================================
   NARRATIVE ORBIT — MAIN JS  (Performance-Optimised)
   ============================================================ */
(function () {
    'use strict';

    /* ── LOADER ─────────────────────────────────────────── */
    window.addEventListener('load', function () {
        setTimeout(function () {
            var loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
            }
        }, 1600);
    });

    /* ── CUSTOM CURSOR (desktop / fine pointer only) ─────── */
    if (window.matchMedia('(pointer: fine)').matches) {
        var cursor   = document.getElementById('cursor');
        var follower = document.getElementById('cursorFollower');
        var mx = 0, my = 0, fx = 0, fy = 0;
        var rafId;

        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            // Move dot immediately via transform (no layout)
            cursor.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
        }, { passive: true });

        function tickFollower() {
            fx += (mx - fx) * 0.12;
            fy += (my - fy) * 0.12;
            follower.style.transform = 'translate(' + (fx - 18) + 'px,' + (fy - 18) + 'px)';
            rafId = requestAnimationFrame(tickFollower);
        }
        rafId = requestAnimationFrame(tickFollower);

        // Hover states — event delegation instead of per-element listeners
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest('a, button, [data-cursor]')) {
                cursor.classList.add('hovering');
                follower.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest('a, button, [data-cursor]')) {
                cursor.classList.remove('hovering');
                follower.classList.remove('hovering');
            }
        });

        // Clean up RAF when tab hidden
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
            } else {
                rafId = requestAnimationFrame(tickFollower);
            }
        });
    }

    /* ── NAVBAR scroll (throttled) ───────────────────────── */
    var nav = document.getElementById('nav');
    var navTicking = false;
    window.addEventListener('scroll', function () {
        if (!navTicking) {
            requestAnimationFrame(function () {
                nav.classList.toggle('scrolled', window.scrollY > 60);
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });

    /* ── MOBILE MENU ─────────────────────────────────────── */
    var hamburger    = document.getElementById('hamburger');
    var mobileOverlay = document.getElementById('mobileOverlay');

    hamburger.addEventListener('click', function () {
        var open = mobileOverlay.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileOverlay.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ── SCROLL REVEAL (IntersectionObserver) ────────────── */
    var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('[data-scroll]').forEach(function (el) {
        revealObs.observe(el);
    });

    /* ── COUNTER ANIMATION (RAF-based, not setInterval) ──── */
    function runCounter(el, target) {
        var start = performance.now();
        var duration = 1400;
        function step(now) {
            var p = Math.min((now - start) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    var counterObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                runCounter(el, parseInt(el.getAttribute('data-count'), 10));
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(function (el) {
        counterObs.observe(el);
    });

    /* ── SMOOTH SCROLL ───────────────────────────────────── */
    document.addEventListener('click', function (e) {
        var anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        var href = anchor.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
        }
    });

    /* ── ACTIVE NAV (IntersectionObserver, not scroll) ───── */
    var navLinks = document.querySelectorAll('.nav-link');
    var sectionObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('section[id]').forEach(function (s) { sectionObs.observe(s); });

    /* ── LAZY IMAGES (native + fade-in) ─────────────────── */
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        if (img.complete) { img.classList.add('loaded'); return; }
        img.addEventListener('load',  function () { img.classList.add('loaded'); }, { once: true });
        img.addEventListener('error', function () { img.classList.add('loaded'); }, { once: true });
    });

    /* ── WORK CARD TILT (subtle, GPU only) ───────────────── */
    document.querySelectorAll('.work-item').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var x = ((e.clientX - r.left) / r.width  - 0.5) * 6;
            var y = ((e.clientY - r.top)  / r.height - 0.5) * -6;
            card.style.transform = 'perspective(800px) rotateX(' + y + 'deg) rotateY(' + x + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

})();
