/* ============================================
   pscript.js - Portfolio JavaScript
   ============================================ */

'use strict';

// ===== GOOGLE SHEETS URL =====
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwmTlUOg3-bWod0a093a1f45LPfSDNZA4IoaIbrjeXP4ImbDX07-f_En39SEXMJDe4g/exec';

// ===== LOADER =====
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderPercent = document.getElementById('loaderPercent');

if (loader) {
    document.body.classList.add('loading');
    let progress = 0;
    const loaderInterval = setInterval(() => {
        progress += Math.random() * 18;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loaderInterval);
            if (loaderFill) loaderFill.style.width = '100%';
            if (loaderPercent) loaderPercent.textContent = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
                initReveal();
            }, 400);
        }
        if (loaderFill) loaderFill.style.width = Math.min(progress, 100) + '%';
        if (loaderPercent) loaderPercent.textContent = Math.floor(Math.min(progress, 100)) + '%';
    }, 80);
}

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    });

    function animateRing() {
        ringX += (cursorX - ringX) * 0.12;
        ringY += (cursorY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = 'a, button, .skill-card-big, .project-card, .cert-card';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) cursorRing.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) cursorRing.classList.remove('hovering');
    });
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
        handleBackToTop();
    });
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(sec => {
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (link && scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    if (localStorage.getItem('pk-theme') === 'light') {
        document.body.classList.add('light');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        if (themeIcon) themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('pk-theme', isLight ? 'light' : 'dark');
    });
}

// ===== SCROLL REVEAL =====
function initReveal() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!revealEls.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    function update(time) {
        const p = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('[data-target]').forEach(num => {
                    animateCounter(num, parseInt(num.dataset.target));
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    counterObserver.observe(statsStrip);
}

// ===== SKILL BARS =====
document.querySelectorAll('.skills-panel').forEach(panel => {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-bar').forEach(bar => {
                    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
                });
            }
        });
    }, { threshold: 0.2 });
    skillObserver.observe(panel);
});

// ===== HERO TYPEWRITER =====
const roleEl = document.getElementById('roleDynamic');
if (roleEl) {
    const roles = [
        'Data Analyst',
        'Problem Solver',
        'DSA Enthusiast',
        'ML Developer',
        'Python Developer'
    ];
    let roleIdx = 0, charIdx = 0, isDeleting = false, typeDelay = 120;

    function typeRole() {
        const current = roles[roleIdx];
        if (!isDeleting) {
            roleEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                isDeleting = true;
                typeDelay = 2000;
            } else {
                typeDelay = 80 + Math.random() * 60;
            }
        } else {
            roleEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                typeDelay = 300;
            } else {
                typeDelay = 40;
            }
        }
        setTimeout(typeRole, typeDelay);
    }
    setTimeout(typeRole, 1200);
}

// ===== SKILLS TABS =====
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skills-panel');

skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        skillTabs.forEach(t => t.classList.remove('active'));
        skillPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById('tab-' + target);
        if (panel) {
            panel.classList.add('active');
            panel.querySelectorAll('.skill-bar').forEach(bar => {
                bar.style.width = '0%';
                setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 50);
            });
            panel.querySelectorAll('.reveal-up').forEach((el, i) => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), i * 80);
            });
        }
    });
});

window.addEventListener('load', () => {
    setTimeout(() => {
        const activePanel = document.querySelector('.skills-panel.active');
        if (activePanel) {
            activePanel.querySelectorAll('.skill-bar').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }
    }, 600);
});

// ===== PROJECT FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== CONTACT FORM → GOOGLE SHEETS =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: contactForm.querySelector('[name="name"]').value.trim(),
            email: contactForm.querySelector('[name="email"]').value.trim(),
            subject: contactForm.querySelector('[name="subject"]').value.trim(),
            message: contactForm.querySelector('[name="message"]').value.trim()
        };
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';
        if (submitBtn) submitBtn.disabled = true;

        try {
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (formSuccess) {
                formSuccess.style.display = 'flex';
                setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
            }
            contactForm.reset();
        } catch (error) {
            alert('Something went wrong. Please email me directly at pulleskolapalli810@gmail.com');
        } finally {
            if (btnText) btnText.style.display = 'flex';
            if (btnLoading) btnLoading.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
function handleBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== FOOTER YEAR =====
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SKILL CARD TILT =====
document.querySelectorAll('.skill-card-big, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== SECTION ACTIVE NAV =====
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (navLink) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}, { threshold: 0.3, rootMargin: '-80px 0px -20% 0px' });
document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

// ===== CERT CARD SHINE =====
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--card-hover), var(--card))`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

// ===== KEYBOARD NAV =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (hamburger) hamburger.classList.remove('open');
        if (navLinks) navLinks.classList.remove('open');
    }
});

// ===== LAZY IMAGES =====
const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            imgObserver.unobserve(img);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('img').forEach(img => imgObserver.observe(img));

// ===== CONSOLE =====
console.log('%c👋 Hey there, fellow developer!', 'font-size:20px;font-weight:bold;color:#6366f1;');
console.log('%c✅ Portfolio initialized!', 'color:#10b981;font-weight:bold;');
window.addEventListener('scroll', () => {}, { passive: true });