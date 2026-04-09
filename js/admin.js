/* ============================================================
   NARRATIVE ORBIT — ADMIN JS
   Login, Dashboard, Quote Management
   ============================================================ */

(function () {
    'use strict';

    /* ===== CONFIG ===== */
    // In production, replace with server-side auth. This is a client-side demo.
    const ADMIN_KEY = 'no_admin_session';
    const SUBMISSIONS_KEY = 'no_submissions';
    const SETTINGS_KEY = 'no_admin_settings';

    // Default credentials (hashed comparison in real app — this is demo only)
    const DEFAULT_CREDS = { username: 'admin', password: 'NarrativeOrbit2025!' };

    function getSettings() {
        try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch { return {}; }
    }
    function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

    function getSubmissions() {
        try { return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]'); } catch { return []; }
    }
    function saveSubmissions(arr) { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(arr)); }

    function isLoggedIn() { return sessionStorage.getItem(ADMIN_KEY) === 'true'; }
    function login() { sessionStorage.setItem(ADMIN_KEY, 'true'); }
    function logout() { sessionStorage.removeItem(ADMIN_KEY); window.location.href = 'login.html'; }

    /* ===== SANITIZE ===== */
    function esc(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatDate(iso) {
        if (!iso) return '—';
        try {
            return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch { return iso; }
    }

    /* ===== LOGIN PAGE ===== */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Redirect if already logged in
        if (isLoggedIn()) { window.location.href = 'index.html'; return; }

        const loginError = document.getElementById('loginError');
        const loginBtn = document.getElementById('loginBtn');
        const togglePw = document.getElementById('togglePw');
        const pwIcon = document.getElementById('pwIcon');
        const pwInput = document.getElementById('lpassword');

        // Toggle password visibility
        if (togglePw) {
            togglePw.addEventListener('click', function () {
                const isText = pwInput.type === 'text';
                pwInput.type = isText ? 'password' : 'text';
                pwIcon.className = isText ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed';
            });
        }

        // Rate limiting
        let attempts = 0;
        let lockUntil = 0;

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const now = Date.now();
            if (now < lockUntil) {
                const secs = Math.ceil((lockUntil - now) / 1000);
                loginError.textContent = 'Too many attempts. Try again in ' + secs + 's.';
                return;
            }

            const username = document.getElementById('lusername').value.trim();
            const password = document.getElementById('lpassword').value;

            if (!username || !password) {
                loginError.textContent = 'Please enter both username and password.';
                return;
            }

            loginBtn.querySelector('.lb-text').style.display = 'none';
            loginBtn.querySelector('.lb-icon').style.display = 'none';
            loginBtn.querySelector('.lb-loader').style.display = 'block';
            loginBtn.disabled = true;

            setTimeout(function () {
                const settings = getSettings();
                const storedUser = settings.username || DEFAULT_CREDS.username;
                const storedPass = settings.password || DEFAULT_CREDS.password;

                if (username === storedUser && password === storedPass) {
                    attempts = 0;
                    login();
                    window.location.href = 'index.html';
                } else {
                    attempts++;
                    if (attempts >= 5) {
                        lockUntil = Date.now() + 60000;
                        loginError.textContent = 'Too many failed attempts. Locked for 60 seconds.';
                    } else {
                        loginError.textContent = 'Invalid credentials. ' + (5 - attempts) + ' attempts remaining.';
                    }
                    loginBtn.querySelector('.lb-text').style.display = '';
                    loginBtn.querySelector('.lb-icon').style.display = '';
                    loginBtn.querySelector('.lb-loader').style.display = 'none';
                    loginBtn.disabled = false;
                }
            }, 800);
        });

        return; // Stop here for login page
    }

    /* ===== DASHBOARD PAGE ===== */
    if (!isLoggedIn()) { window.location.href = 'login.html'; return; }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Live clock
    function updateClock() {
        const el = document.getElementById('dashTime');
        if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ===== PANEL NAVIGATION ===== */
    const panels = { overview: 'Overview', quotes: 'Quote Requests', team: 'Team', settings: 'Settings' };
    document.querySelectorAll('.sb-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const panelId = this.getAttribute('data-panel');
            document.querySelectorAll('.sb-link').forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');
            document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
            const panel = document.getElementById('panel-' + panelId);
            if (panel) panel.classList.add('active');
            document.getElementById('panelTitle').textContent = panels[panelId] || panelId;
            if (panelId === 'quotes') renderQuotesTable();
            if (panelId === 'team') renderTeam();
        });
    });

    /* ===== SUBMISSIONS ===== */
    function renderOverview() {
        const subs = getSubmissions();
        const today = new Date().toDateString();
        const todayCount = subs.filter(function (s) { return new Date(s.timestamp).toDateString() === today; }).length;

        document.getElementById('totalQuotes').textContent = subs.length;
        document.getElementById('newQuotes').textContent = subs.filter(function (s) { return !s.read; }).length;
        document.getElementById('todayQuotes').textContent = todayCount;
        document.getElementById('quoteBadge').textContent = subs.filter(function (s) { return !s.read; }).length;

        const tbody = document.getElementById('recentTableBody');
        const recent = subs.slice(-5).reverse();
        if (!recent.length) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No submissions yet.</td></tr>';
            return;
        }
        tbody.innerHTML = recent.map(function (s, i) {
            return '<tr>' +
                '<td class="td-name">' + esc(s.name) + '</td>' +
                '<td>' + esc(s.email) + '</td>' +
                '<td><span class="td-service">' + esc(s.service || '—') + '</span></td>' +
                '<td>' + esc(s.budget || '—') + '</td>' +
                '<td>' + formatDate(s.timestamp) + '</td>' +
                '<td><button class="btn-view" data-idx="' + (subs.length - 1 - i) + '">View</button></td>' +
                '</tr>';
        }).join('');
        attachViewButtons(tbody);
    }

    function renderQuotesTable(filter, serviceFilter) {
        let subs = getSubmissions();
        if (filter) {
            const q = filter.toLowerCase();
            subs = subs.filter(function (s) {
                return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
            });
        }
        if (serviceFilter) {
            subs = subs.filter(function (s) { return s.service === serviceFilter; });
        }
        const tbody = document.getElementById('quotesTableBody');
        if (!subs.length) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No submissions found.</td></tr>';
            return;
        }
        tbody.innerHTML = subs.slice().reverse().map(function (s, i) {
            const realIdx = subs.length - 1 - i;
            return '<tr>' +
                '<td class="td-name">' + esc(s.name) + '</td>' +
                '<td>' + esc(s.email) + '</td>' +
                '<td><span class="td-service">' + esc(s.service || '—') + '</span></td>' +
                '<td>' + esc(s.budget || '—') + '</td>' +
                '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc((s.message || '').substring(0, 60)) + '…</td>' +
                '<td>' + formatDate(s.timestamp) + '</td>' +
                '<td>' +
                    '<button class="btn-view" data-idx="' + realIdx + '">View</button>' +
                    '<button class="btn-delete" data-idx="' + realIdx + '"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');
        attachViewButtons(tbody);
        attachDeleteButtons(tbody);
    }

    /* ===== MODAL ===== */
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    document.getElementById('modalClose').addEventListener('click', function () {
        modalOverlay.classList.remove('open');
    });
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });

    function openModal(idx) {
        const subs = getSubmissions();
        const s = subs[idx];
        if (!s) return;
        // Mark as read
        subs[idx].read = true;
        saveSubmissions(subs);
        renderOverview();

        modalContent.innerHTML =
            '<h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:24px;">Quote Request</h3>' +
            row('Name', s.name) + row('Email', s.email) +
            row('Service', s.service) + row('Budget', s.budget) +
            row('Message', s.message) + row('Submitted', formatDate(s.timestamp));
        modalOverlay.classList.add('open');
    }

    function row(label, val) {
        return '<div class="modal-row"><div class="modal-label">' + esc(label) + '</div><div class="modal-val">' + esc(val || '—') + '</div></div>';
    }

    function attachViewButtons(container) {
        container.querySelectorAll('.btn-view').forEach(function (btn) {
            btn.addEventListener('click', function () { openModal(parseInt(this.getAttribute('data-idx'), 10)); });
        });
    }

    function attachDeleteButtons(container) {
        container.querySelectorAll('.btn-delete').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (!confirm('Delete this submission?')) return;
                const idx = parseInt(this.getAttribute('data-idx'), 10);
                const subs = getSubmissions();
                subs.splice(idx, 1);
                saveSubmissions(subs);
                renderQuotesTable();
                renderOverview();
            });
        });
    }

    /* ===== SEARCH & FILTER ===== */
    const quoteSearch = document.getElementById('quoteSearch');
    const serviceFilter = document.getElementById('serviceFilter');
    if (quoteSearch) {
        quoteSearch.addEventListener('input', function () {
            renderQuotesTable(this.value, serviceFilter.value);
        });
    }
    if (serviceFilter) {
        serviceFilter.addEventListener('change', function () {
            renderQuotesTable(quoteSearch.value, this.value);
        });
    }

    /* ===== CLEAR ALL ===== */
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function () {
            if (!confirm('Delete ALL submissions? This cannot be undone.')) return;
            saveSubmissions([]);
            renderQuotesTable();
            renderOverview();
        });
    }

    /* ===== EXPORT ===== */
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            const subs = getSubmissions();
            const blob = new Blob([JSON.stringify(subs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'narrative-orbit-quotes-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', function () {
            if (!confirm('Clear ALL data? This cannot be undone.')) return;
            saveSubmissions([]);
            renderOverview();
        });
    }

    /* ===== CHANGE PASSWORD ===== */
    const changePwForm = document.getElementById('changePasswordForm');
    if (changePwForm) {
        changePwForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const msg = document.getElementById('settingsMsg');
            const current = document.getElementById('currentPw').value;
            const newPw = document.getElementById('newPw').value;
            const confirm = document.getElementById('confirmPw').value;
            const settings = getSettings();
            const storedPass = settings.password || DEFAULT_CREDS.password;

            if (current !== storedPass) { msg.textContent = 'Current password is incorrect.'; msg.className = 'settings-msg error'; return; }
            if (newPw.length < 8) { msg.textContent = 'New password must be at least 8 characters.'; msg.className = 'settings-msg error'; return; }
            if (newPw !== confirm) { msg.textContent = 'Passwords do not match.'; msg.className = 'settings-msg error'; return; }

            settings.password = newPw;
            saveSettings(settings);
            msg.textContent = 'Password updated successfully.';
            msg.className = 'settings-msg success';
            changePwForm.reset();
        });
    }

    /* ===== TEAM ===== */
    const teamData = [
        { name: 'Shah Nawaz', role: 'Content Creator · Founder' },
        { name: 'Khizar', role: 'Scriptwriter' },
        { name: 'Mehmood', role: 'Video Editor' },
        { name: 'Mohsin', role: 'Video Editor' },
        { name: 'Hammad', role: 'Scriptwriter' }
    ];

    function renderTeam() {
        const grid = document.getElementById('teamAdminGrid');
        if (!grid) return;
        grid.innerHTML = teamData.map(function (m) {
            return '<div class="ta-card">' +
                '<div class="ta-avatar"><i class="fas fa-user"></i></div>' +
                '<h4>' + esc(m.name) + '</h4>' +
                '<div class="ta-role">' + esc(m.role) + '</div>' +
                '</div>';
        }).join('');
    }

    /* ===== INIT ===== */
    renderOverview();

})();
