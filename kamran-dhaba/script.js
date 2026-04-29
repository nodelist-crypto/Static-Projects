/* ============================================================
   KAMRAN DHABA — Site Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-mobile-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close on link click
    nav.querySelectorAll('.nav__menu a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-mobile-open');
        toggle.classList.remove('is-open');
      });
    });
  }

  /* ---------- Shadow on scroll ---------- */
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Highlight today's hours ---------- */
  document.querySelectorAll('.hours-card li[data-day]').forEach((li) => {
    const todayIdx = new Date().getDay(); // 0 Sun ... 6 Sat
    const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (li.dataset.day === dayMap[todayIdx]) li.classList.add('is-today');
  });

  /* ---------- Menu category tabs (menu page) ---------- */
  const tabs = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');

  if (tabs.length && sections.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;

        tabs.forEach((t) => t.classList.toggle('is-active', t === tab));

        if (target === 'all') {
          sections.forEach((s) => (s.hidden = false));
        } else {
          sections.forEach((s) => {
            s.hidden = s.dataset.category !== target;
          });
        }

        // Smooth scroll to first visible section
        const firstVisible = Array.from(sections).find((s) => !s.hidden);
        if (firstVisible) {
          const top = firstVisible.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- Toast helper ---------- */
  function showToast(message, isError = false) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle('is-error', !!isError);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('is-visible'), 4000);
  }

  /* ---------- Form: Reservations ---------- */
  const reservationForm = document.querySelector('#reservation-form');
  if (reservationForm) {
    // Set min date to today
    const dateInput = reservationForm.querySelector('input[name="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(reservationForm));
      if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
        showToast('Please fill in all required fields.', true);
        return;
      }
      // Persist locally so the user can see it works without a backend
      const all = JSON.parse(localStorage.getItem('kd_reservations') || '[]');
      all.push({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem('kd_reservations', JSON.stringify(all));

      showToast(`Thank you, ${data.name}! Your table for ${data.guests} on ${data.date} at ${data.time} is requested. We'll call you to confirm.`);
      reservationForm.reset();
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    });
  }

  /* ---------- Form: Contact ---------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm));
      if (!data.name || !data.email || !data.message) {
        showToast('Please fill in all required fields.', true);
        return;
      }
      const all = JSON.parse(localStorage.getItem('kd_messages') || '[]');
      all.push({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem('kd_messages', JSON.stringify(all));

      showToast(`Thanks ${data.name}! We've received your message and will reply soon.`);
      contactForm.reset();
    });
  }

  /* ---------- Footer newsletter ---------- */
  const newsletter = document.querySelector('#newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletter.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      showToast(`Subscribed! We'll send tasty news to ${email}.`);
      newsletter.reset();
    });
  }

  /* ---------- Mark active nav link ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__menu a').forEach((a) => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (
      href === path ||
      (path === '' && href === 'index.html') ||
      (path === 'index.html' && (href === '' || href === 'index.html'))
    ) {
      a.classList.add('is-active');
    }
  });
})();
