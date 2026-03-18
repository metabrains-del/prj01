/* ============================================================
   NARRATIVE ORBIT — CONTACT FORM JS
   ============================================================ */
(function () {
    'use strict';

    const form = document.getElementById('quoteForm');
    if (!form) return;

    const fields = {
        name:     { el: document.getElementById('fname'),    err: document.getElementById('nameError') },
        email:    { el: document.getElementById('femail'),   err: document.getElementById('emailError') },
        service:  { el: document.getElementById('fservice'), err: document.getElementById('serviceError') },
        budget:   { el: document.getElementById('fbudget'),  err: document.getElementById('budgetError') },
        platform: { el: document.getElementById('fplatform'),err: document.getElementById('platformError') },
        market:   { el: document.getElementById('fmarket'),  err: document.getElementById('marketError') },
        message:  { el: document.getElementById('fmessage'), err: document.getElementById('messageError') }
    };
    const charCount  = document.getElementById('charCount');
    const submitBtn  = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    function sanitize(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#x27;').trim();
    }

    const validators = {
        name:     v => !v ? 'Name is required.' : v.length < 2 ? 'Too short.' : v.length > 80 ? 'Too long.' : !/^[a-zA-Z\s\-'.]+$/.test(v) ? 'Invalid characters.' : '',
        email:    v => !v ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email.' : '',
        service:  v => !v ? 'Please select a service.' : '',
        budget:   v => !v ? 'Please select a budget range.' : '',
        platform: v => !v ? 'Please select a platform.' : '',
        market:   v => !v ? 'Please select your target market.' : '',
        message:  v => !v ? 'Please describe your project.' : v.length < 20 ? 'At least 20 characters.' : v.length > 1000 ? 'Max 1000 characters.' : ''
    };

    function validateField(key) {
        const f = fields[key];
        if (!f || !f.el) return true;
        const val = sanitize(f.el.value);
        const err = validators[key](val);
        if (f.err) f.err.textContent = err;
        f.el.classList.toggle('error', !!err);
        f.el.classList.toggle('success', !err && val.length > 0);
        return !err;
    }

    Object.keys(fields).forEach(key => {
        if (!fields[key].el) return;
        fields[key].el.addEventListener('blur', () => validateField(key));
        fields[key].el.addEventListener('input', () => {
            if (fields[key].el.classList.contains('error')) validateField(key);
        });
    });

    /* Char count */
    if (fields.message.el && charCount) {
        fields.message.el.addEventListener('input', function () {
            const len = this.value.length;
            charCount.textContent = len + ' / 1000';
            charCount.style.color = len > 900 ? '#ef4444' : len > 700 ? '#f59e0b' : '';
        });
    }

    /* Style chips */
    const chips = document.querySelectorAll('.style-chip');
    const styleInput = document.getElementById('fstyle');
    const selected = new Set();
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const val = chip.dataset.val;
            if (selected.has(val)) {
                selected.delete(val);
                chip.classList.remove('active');
                chip.setAttribute('aria-pressed', 'false');
            } else {
                selected.add(val);
                chip.classList.add('active');
                chip.setAttribute('aria-pressed', 'true');
            }
            if (styleInput) styleInput.value = [...selected].join(', ');
        });
    });

    /* Rate limit */
    let lastSubmit = 0;
    const RATE_LIMIT_MS = 30000;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const honey = form.querySelector('input[name="_honey"]');
        if (honey && honey.value) return;
        const now = Date.now();
        if (now - lastSubmit < RATE_LIMIT_MS) { showError('Please wait before submitting again.'); return; }

        let valid = true;
        Object.keys(fields).forEach(key => { if (!validateField(key)) valid = false; });
        if (!valid) { form.querySelector('.error')?.focus(); return; }

        const data = {
            name:      sanitize(fields.name.el.value),
            email:     sanitize(fields.email.el.value),
            phone:     sanitize(document.getElementById('fphone')?.value || ''),
            company:   sanitize(document.getElementById('fcompany')?.value || ''),
            service:   sanitize(fields.service.el.value),
            budget:    sanitize(fields.budget.el.value),
            platform:  sanitize(fields.platform.el.value),
            duration:  sanitize(document.getElementById('fduration')?.value || ''),
            market:    sanitize(fields.market.el.value),
            timeline:  sanitize(document.getElementById('ftimeline')?.value || ''),
            style:     sanitize(styleInput?.value || ''),
            message:   sanitize(fields.message.el.value),
            reference: sanitize(document.getElementById('fref')?.value || ''),
            timestamp: new Date().toISOString()
        };

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        fetch('api/contact.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function (res) { return res.json(); })
        .then(function (result) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            if (result.success) {
                saveSubmission(data);
                formSuccess.classList.add('show');
                form.reset();
                selected.clear();
                chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
                if (styleInput) styleInput.value = '';
                Object.keys(fields).forEach(key => {
                    if (fields[key].el) fields[key].el.classList.remove('success', 'error');
                });
                if (charCount) charCount.textContent = '0 / 1000';
                lastSubmit = Date.now();
            } else {
                const msgs = result.errors ? result.errors.join(' ') : (result.message || 'Something went wrong. Please try again.');
                showError(msgs);
            }
        })
        .catch(function () {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showError('Network error. Please check your connection and try again.');
        });
    });

    function showError(msg) {
        const existing = form.querySelector('.form-global-error');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'form-global-error';
        div.style.cssText = 'color:#ef4444;font-size:0.82rem;margin-bottom:12px;';
        div.textContent = msg;
        submitBtn.parentNode.insertBefore(div, submitBtn);
    }

    function saveSubmission(data) {
        try {
            const key = 'no_submissions';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push(data);
            if (existing.length > 50) existing.shift();
            localStorage.setItem(key, JSON.stringify(existing));
        } catch (e) {}
    }
})();
