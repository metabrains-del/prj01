/* ============================================================
   ORBITBOT — Floating Chatbot
   Narrative Orbit design system
   ============================================================ */
(function () {
    'use strict';

    /* ── DATA ─────────────────────────────────────────────── */
    var topics = [
        {
            id: 'services',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
            label: 'Our Services',
            qa: [
                { q: 'What services does Narrative Orbit offer?', a: 'We offer Scriptwriting, Video Editing, Content Strategy, and Full Production pipelines — everything from concept to final export.' },
                { q: 'Do you handle short-form content like Reels?', a: 'Absolutely. Short-form is one of our specialties — hooks, pacing, and platform-native edits for Instagram Reels, TikTok, and YouTube Shorts.' },
                { q: 'Can you write scripts for my YouTube channel?', a: 'Yes. We write long-form YouTube scripts engineered for retention — strong hooks, structured narratives, and platform-optimised pacing.' },
                { q: 'What does Full Production include?', a: 'Full Production covers everything: scripting, editing, motion graphics, thumbnail design, SEO, and final delivery. You just show up and record.' },
                { q: 'Do you offer monthly retainers?', a: 'Yes, we offer monthly retainer packages for creators and brands who need consistent, high-quality content output every month.' },
                { q: 'Do you do motion graphics and color grading?', a: 'Yes — motion graphics, color grading, and sound design are all part of our video editing service.' }
            ]
        },
        {
            id: 'pricing',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
            label: 'Pricing & Packages',
            qa: [
                { q: 'How much does a script cost?', a: 'Pricing depends on length and complexity. We offer custom quotes — reach out via the contact form and we\'ll get back to you within 24 hours.' },
                { q: 'Do you have fixed packages?', a: 'We have flexible packages for scriptwriting, editing, and full production. Contact us for a tailored quote based on your needs.' },
                { q: 'Is there a minimum commitment?', a: 'No minimum for one-off projects. For retainers, we typically work on a monthly basis with a short onboarding period.' },
                { q: 'Do you offer discounts for long-term clients?', a: 'Yes — long-term retainer clients get priority turnaround and preferential rates. We value ongoing partnerships.' },
                { q: 'How do I get a quote?', a: 'Hit the "Get a Quote" button on the site, fill in the contact form, and we\'ll respond within 24 hours with a custom proposal.' },
                { q: 'What payment methods do you accept?', a: 'We accept bank transfers, PayPal, and other major payment methods. Details are shared during onboarding.' }
            ]
        },
        {
            id: 'process',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
            label: 'Our Process',
            qa: [
                { q: 'What does your workflow look like?', a: 'We start with a discovery call, then move to scripting, review, production, and final delivery. Every step is collaborative and transparent.' },
                { q: 'How long does a project take?', a: 'Scripts typically take 2–4 days. Full video edits take 3–7 days depending on length and complexity. Rush delivery is available.' },
                { q: 'How many revisions do I get?', a: 'We include 2 rounds of revisions on all projects. Additional revisions are available at a small fee.' },
                { q: 'Do I need to provide a brief?', a: 'A brief helps, but it\'s not required. We have an onboarding questionnaire that helps us understand your brand, tone, and goals.' },
                { q: 'How do you handle feedback?', a: 'We use a structured feedback loop — you review, leave timestamped notes, and we implement changes in the next revision round.' },
                { q: 'Can I be involved in the creative process?', a: 'Absolutely. We love collaborative clients. You can be as hands-on or hands-off as you prefer.' }
            ]
        },
        {
            id: 'work',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
            label: 'Portfolio & Work',
            qa: [
                { q: 'Can I see examples of your work?', a: 'Yes — check out the Portfolio section on our site. We\'ve worked on documentary-style brand stories, viral reel series, and full course productions.' },
                { q: 'Who is MetaBrains.org?', a: 'MetaBrains is a global coding & AI education platform. We produced 6 courses, 647 lessons, and all promotional content for them — rated 5 stars.' },
                { q: 'What results have your clients seen?', a: 'Our documentary-style brand story hit 2.3M views in 30 days. Our viral reel series generated 500K views across 6 reels in 2 weeks.' },
                { q: 'Do you work with personal brands or just companies?', a: 'Both. We work with individual creators, personal brands, startups, and established companies across industries.' },
                { q: 'What niches do you specialise in?', a: 'We\'re strong in education, tech, AI, finance, and lifestyle content — but our storytelling framework works across any niche.' },
                { q: 'Can I see a case study?', a: 'Yes — visit the Work section on our site for detailed case studies including the Documentary Brand Story and Viral Reel Series projects.' }
            ]
        },
        {
            id: 'team',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            label: 'The Team',
            qa: [
                { q: 'Who runs Narrative Orbit?', a: 'Shah Nawaz is the Founder & CEO, and Mohsin is the Co-Founder & Head of Post-Production. Together they built the studio from the ground up.' },
                { q: 'How big is the team?', a: 'We\'re a tight-knit team of 7 core creatives — founders, editors, and strategists — all operating at the intersection of art and performance.' },
                { q: 'What is Shah Nawaz\'s role?', a: 'Shah is the architect of Narrative Orbit. He leads creative vision, client relationships, and ensures every piece of content is engineered to perform.' },
                { q: 'What does Mohsin do?', a: 'Mohsin owns the entire post-production pipeline — from short-form reels to long-form cinematic cuts. He sets the visual standard for everything we ship.' },
                { q: 'Are the team members specialists?', a: 'Yes — each team member is a specialist. We have dedicated scriptwriters, video editors, and strategists, not generalists.' },
                { q: 'Can I work with a specific team member?', a: 'We assign the best-fit team members based on your project type. You\'re always welcome to request a specific person during onboarding.' }
            ]
        },
        {
            id: 'contact',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
            label: 'Contact & Collab',
            qa: [
                { q: 'How do I start a project?', a: 'Click "Get a Quote" on the site, fill in the form, and we\'ll reach out within 24 hours to schedule a discovery call.' },
                { q: 'What information do I need to provide?', a: 'Just your name, email, project type, and a brief description. We\'ll handle the rest in the discovery call.' },
                { q: 'How fast do you respond?', a: 'We respond to all inquiries within 24 hours on business days. Urgent projects can be flagged for same-day response.' },
                { q: 'Do you take on international clients?', a: 'Yes — we work with clients globally. Time zones are no barrier; we adapt our workflow to suit your schedule.' },
                { q: 'Can I follow Narrative Orbit on social media?', a: 'Yes — find us on Instagram, YouTube, and Twitter. Links are in the footer of the site.' },
                { q: 'Do you offer free consultations?', a: 'Yes, our initial discovery call is completely free. We use it to understand your goals and see if we\'re the right fit.' }
            ]
        },
        {
            id: 'about',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
            label: 'About the Studio',
            qa: [
                { q: 'What is Narrative Orbit?', a: 'Narrative Orbit is a premium content creation studio specialising in cinematic video production, scriptwriting, and brand storytelling.' },
                { q: 'When was Narrative Orbit founded?', a: 'Narrative Orbit was built by creators who were tired of average — a studio born from the belief that every brand deserves world-class storytelling.' },
                { q: 'What makes Narrative Orbit different?', a: 'We\'re story-first, data-informed, and fast. We don\'t just make content — we engineer stories that stick, spread, and sell.' },
                { q: 'How many projects have you completed?', a: 'We\'ve completed 200+ projects with a 98% client satisfaction rate, generating over 50K+ views for our clients.' },
                { q: 'What is your creative philosophy?', a: 'Every frame, every word, every cut is intentional. We operate at the intersection of art and strategy — where storytelling meets performance.' },
                { q: 'Do you work with startups?', a: 'Yes — we love working with ambitious startups. Whether you\'re building a brand from scratch or scaling an existing one, we\'re in.' }
            ]
        }
    ];

    /* ── BUILD UI ─────────────────────────────────────────── */
    // CSS loaded via <link> in HTML head

    var html = [
        /* Toggle button */
        '<button class="orbitbot-toggle" id="orbitbotToggle" aria-label="Open OrbitBot">',
            '<img src="assets/logo.png" alt="" class="orbitbot-toggle-logo">',
            '<span class="orbitbot-toggle-close"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>',
        '</button>',

        /* Chat window */
        '<div class="orbitbot-window" id="orbitbotWindow" role="dialog" aria-label="OrbitBot chat">',

            /* Header */
            '<div class="orbitbot-header">',
                '<div class="orbitbot-header-logo">',
                    '<img src="assets/logo.png" alt="OrbitBot">',
                '</div>',
                '<div class="orbitbot-header-info">',
                    '<div class="orbitbot-header-name">Orbit<em>Bot</em></div>',
                    '<div class="orbitbot-header-status">',
                        '<span class="orbitbot-status-dot"></span>',
                        '<span>Online — Ask me anything</span>',
                    '</div>',
                '</div>',
            '</div>',

            /* Messages */
            '<div class="orbitbot-messages" id="orbitbotMessages"></div>',

            /* Footer */
            '<div class="orbitbot-footer">',
                '<span>Powered by <em>Narrative Orbit</em></span>',
            '</div>',

        '</div>'
    ].join('');

    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    /* ── REFS ─────────────────────────────────────────────── */
    var toggle   = document.getElementById('orbitbotToggle');
    var win      = document.getElementById('orbitbotWindow');
    var messages = document.getElementById('orbitbotMessages');
    var isOpen   = false;

    /* ── HELPERS ──────────────────────────────────────────── */
    function scrollBottom() {
        setTimeout(function () { messages.scrollTop = messages.scrollHeight; }, 50);
    }

    function addBotMsg(text, delay) {
        delay = delay || 0;
        setTimeout(function () {
            var row = document.createElement('div');
            row.className = 'ob-msg';
            row.innerHTML =
                '<div class="ob-msg-avatar"><img src="assets/logo.png" alt=""></div>' +
                '<div class="ob-msg-bubble">' + text + '</div>';
            messages.appendChild(row);
            scrollBottom();
        }, delay);
    }

    function clearMessages() {
        messages.innerHTML = '';
    }

    /* ── HOME SCREEN ──────────────────────────────────────── */
    function showHome() {
        clearMessages();
        addBotMsg('Hey there 👋 I\'m <strong>OrbitBot</strong> — your guide to everything Narrative Orbit. Pick a topic below to get started.', 0);

        setTimeout(function () {
            var list = document.createElement('div');
            list.className = 'ob-topics';

            topics.forEach(function (topic) {
                var btn = document.createElement('button');
                btn.className = 'ob-topic-chip';
                btn.innerHTML =
                    '<span class="ob-topic-chip-icon">' + topic.icon + '</span>' +
                    '<span class="ob-topic-chip-label">' + topic.label + '</span>' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ob-topic-chip-arrow" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';
                btn.addEventListener('click', function () { showTopic(topic); });
                list.appendChild(btn);
            });

            messages.appendChild(list);
            scrollBottom();
        }, 200);
    }

    /* ── TOPIC SCREEN ─────────────────────────────────────── */
    function showTopic(topic) {
        clearMessages();

        /* Back button row */
        var backRow = document.createElement('div');
        backRow.style.marginBottom = '4px';
        var backBtn = document.createElement('button');
        backBtn.className = 'ob-back-btn';
        backBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> All Topics';
        backBtn.addEventListener('click', showHome);
        backRow.appendChild(backBtn);
        messages.appendChild(backRow);

        addBotMsg('Here\'s what people ask about <strong>' + topic.label + '</strong>. Tap any question to see the answer.', 0);

        setTimeout(function () {
            var list = document.createElement('div');
            list.className = 'ob-qa-list';

            topic.qa.forEach(function (item) {
                var wrap = document.createElement('div');
                wrap.className = 'ob-qa-item';

                var qBtn = document.createElement('button');
                qBtn.className = 'ob-qa-q';
                qBtn.innerHTML = item.q + '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ob-qa-q-icon" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

                var aDiv = document.createElement('div');
                aDiv.className = 'ob-qa-a';
                aDiv.textContent = item.a;

                qBtn.addEventListener('click', function () {
                    var isActive = qBtn.classList.contains('active');
                    /* Close all others in this list */
                    list.querySelectorAll('.ob-qa-q').forEach(function (q) { q.classList.remove('active'); });
                    list.querySelectorAll('.ob-qa-a').forEach(function (a) { a.classList.remove('open'); });
                    if (!isActive) {
                        qBtn.classList.add('active');
                        aDiv.classList.add('open');
                        scrollBottom();
                    }
                });

                wrap.appendChild(qBtn);
                wrap.appendChild(aDiv);
                list.appendChild(wrap);
            });

            messages.appendChild(list);
            scrollBottom();
        }, 200);
    }

    /* ── TOGGLE ───────────────────────────────────────────── */
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        isOpen = !isOpen;
        toggle.classList.toggle('open', isOpen);
        win.classList.toggle('open', isOpen);
        if (isOpen && messages.children.length === 0) {
            showHome();
        }
    });

    /* Prevent clicks inside the window from closing it */
    win.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    /* Close on outside click */
    document.addEventListener('click', function () {
        if (isOpen) {
            isOpen = false;
            toggle.classList.remove('open');
            win.classList.remove('open');
        }
    });

})();
