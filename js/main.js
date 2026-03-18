/* ============================================================
   NARRATIVE ORBIT — MAIN JS  (Performance-Optimised)
   ============================================================ */
(function () {
    'use strict';

    /* ── THEME TOGGLE (desktop only) ────────────────────── */
    var themeToggle = document.getElementById('themeToggle');
    var themeIcon   = document.getElementById('themeIcon');

    function applyTheme(isLight) {
        document.body.classList.toggle('light', isLight);
        // swap icon: moon for dark mode, sun for light mode
        themeIcon.className = isLight ? 'fi fi-rr-sun' : 'fi fi-rr-moon';
    }

    // Restore saved preference
    var savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'light');

    themeToggle.addEventListener('click', function () {
        var isLight = !document.body.classList.contains('light');
        applyTheme(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    /* ── LOADER (Netflix-style cinematic exit) ───────────── */
    window.addEventListener('load', function () {
        setTimeout(function () {
            var loader    = document.getElementById('loader');
            if (!loader) return;

            var loaderImg   = loader.querySelector('.loader-logo-img');
            var loaderBrand = loader.querySelector('.loader-brand');
            var loaderBar   = loader.querySelector('.loader-bar');
            var loaderText  = loader.querySelector('.loader-text');

            /* ── Step 1: slowly fade out brand / bar / text ── */
            [loaderBrand, loaderBar, loaderText].forEach(function (el) {
                if (!el) return;
                el.style.transition = 'opacity 0.6s ease';
                el.style.opacity    = '0';
            });

            /* ── Step 2: after text is gone, launch the logo flight ── */
            setTimeout(function () {
                if (!loaderImg) return;

                /* Snapshot logo center before we touch anything */
                var rect = loaderImg.getBoundingClientRect();
                var srcX = rect.left + rect.width  / 2;
                var srcY = rect.top  + rect.height / 2;

                /* Read the actual toggle position — works on every screen size */
                var toggleBtn = document.getElementById('orbitbotToggle');
                var destX, destY;
                if (toggleBtn) {
                    /* Toggle is hidden (scale 0) so getBoundingClientRect gives 0,0.
                       Use its CSS bottom/right to compute center manually. */
                    var vw        = window.innerWidth;
                    var vh        = window.innerHeight;
                    var style     = getComputedStyle(toggleBtn);
                    var btnW      = 60;
                    var btnH      = 60;
                    var bottom    = parseFloat(style.bottom) || (vw <= 480 ? 20 : 28);
                    var right     = parseFloat(style.right)  || (vw <= 480 ? 16 : 28);
                    destX = vw - right  - btnW / 2;
                    destY = vh - bottom - btnH / 2;
                } else {
                    /* Fallback */
                    destX = window.innerWidth  - 58;
                    destY = window.innerHeight - 58;
                }

                /* Scale: 90px → 32px (size of logo inside toggle) */
                var targetScale = 32 / rect.width;

                /* Create a free-floating clone — no CSS animations attached */
                var fly = document.createElement('img');
                fly.src = loaderImg.src;
                fly.setAttribute('aria-hidden', 'true');
                fly.style.cssText = [
                    'position:fixed',
                    'width:'  + rect.width  + 'px',
                    'height:' + rect.height + 'px',
                    'left:'   + srcX + 'px',
                    'top:'    + srcY + 'px',
                    'transform:translate(-50%,-50%) scale(1)',
                    'object-fit:contain',
                    'filter:'  + getComputedStyle(loaderImg).filter,
                    'z-index:10002',
                    'pointer-events:none',
                    'will-change:transform,opacity',
                    'transition:none'
                ].join(';');
                document.body.appendChild(fly);

                /* Hide original so no double */
                loaderImg.style.opacity = '0';

                /* Fade the dark overlay slowly — stays visible while logo travels */
                loader.style.transition = 'opacity 1.1s ease 0.3s';
                loader.style.opacity    = '0';

                /* Force reflow — browser must register start state before animating */
                fly.getBoundingClientRect();

                /* Cinematic flight:
                   - 1.4s travel with a slow-in / ease-out arc
                   - opacity fades only in the last 0.3s of the journey          */
                fly.style.transition = [
                    'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    'opacity   0.35s ease 1.1s'
                ].join(',');
                fly.style.transform = [
                    'translate(-50%,-50%)',
                    'translate(' + (destX - srcX) + 'px,' + (destY - srcY) + 'px)',
                    'scale(' + targetScale + ')'
                ].join(' ');
                fly.style.opacity = '0';

                /* ── Step 3: clean up and pop the toggle in ── */
                setTimeout(function () {
                    loader.classList.add('hidden');
                    document.body.classList.remove('loading');
                    fly.remove();

                    if (toggleBtn) {
                        toggleBtn.classList.add('orbit-land');
                    }
                }, 1550);

            }, 500); /* wait for text/bar to fade */

        }, 1400);
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
