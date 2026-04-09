/* ============================================================
   NARRATIVE ORBIT — SERVICE DETAIL JS
   Theme toggle + Live Currency Converter
   ============================================================ */
(function () {
    'use strict';

    /* ── THEME TOGGLE ─────────────────────────────────────── */
    var themeToggle = document.getElementById('themeToggle');
    var themeIcon   = document.getElementById('themeIcon');

    function applyTheme(isLight) {
        document.body.classList.toggle('light', isLight);
        themeIcon.innerHTML = isLight
            ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>'
            : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }

    var savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var isLight = !document.body.classList.contains('light');
            applyTheme(isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    /* ── NAVBAR SCROLL ────────────────────────────────────── */
    var nav = document.getElementById('nav');
    if (nav) {
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
    }

    /* ── SCROLL REVEAL ────────────────────────────────────── */
    var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('[data-scroll]').forEach(function (el) {
        revealObs.observe(el);
    });

    /* ── CURRENCY CONVERTER ───────────────────────────────── */
    // Fallback rates (used if API fails)
    var FALLBACK = { USD: 1, EUR: 0.92, PKR: 278 };

    var rates    = Object.assign({}, FALLBACK);
    var currency = 'USD';
    var rateNote = document.getElementById('rateNote');

    // Symbols map
    var SYMBOLS = { USD: '$', EUR: '€', PKR: '₨' };

    function formatAmount(usd, cur) {
        var val = usd * rates[cur];
        if (cur === 'PKR') {
            return SYMBOLS[cur] + Math.round(val).toLocaleString();
        }
        return SYMBOLS[cur] + val.toFixed(2).replace(/\.00$/, '');
    }

    function updatePrices() {
        document.querySelectorAll('.pc-amount[data-usd]').forEach(function (el) {
            var usd = parseFloat(el.getAttribute('data-usd'));
            el.textContent = formatAmount(usd, currency);
        });
    }

    // Fetch live rates from open.er-api.com (free, no key needed)
    function fetchRates() {
        if (rateNote) {
            rateNote.textContent = 'Fetching live rates…';
            rateNote.classList.add('loading');
        }
        fetch('https://open.er-api.com/v6/latest/USD')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data && data.rates) {
                    rates.EUR = data.rates.EUR || FALLBACK.EUR;
                    rates.PKR = data.rates.PKR || FALLBACK.PKR;
                    if (rateNote) {
                        var now = new Date();
                        rateNote.textContent = 'Live rates · ' + now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        rateNote.classList.remove('loading');
                    }
                    updatePrices();
                }
            })
            .catch(function () {
                if (rateNote) {
                    rateNote.textContent = 'Rates · Approx. values';
                    rateNote.classList.remove('loading');
                }
            });
    }

    // Wire up currency buttons
    document.querySelectorAll('.cc-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            currency = btn.getAttribute('data-currency');
            document.querySelectorAll('.cc-btn').forEach(function (b) {
                b.classList.toggle('active', b === btn);
            });
            updatePrices();
        });
    });

    // Init: show USD prices immediately, then fetch live rates
    updatePrices();
    fetchRates();

})();
