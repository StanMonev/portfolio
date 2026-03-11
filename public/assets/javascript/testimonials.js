/**
 * testimonials.js
 *
 * Loads testimonials from the public data JSON file and renders them into cards.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupTestimonials();
});

const t = (key, fallback) => {
  const translationService = window.translationService;
  if (translationService && typeof translationService.t === 'function') {
    return translationService.t(key, fallback);
  }

  return fallback || key;
};

const setupTestimonials = async () => {
  const section = document.getElementById('testimonials');
  const viewport = section?.querySelector('.testimonials-viewport');
  const track = document.getElementById('testimonialsList');
  const prevBtn = document.getElementById('testimonialsPrev');
  const nextBtn = document.getElementById('testimonialsNext');

  if (!section || !viewport || !track || !prevBtn || !nextBtn) return;

  try {
    const response = await fetch('/assets/data/testimonials.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load testimonials: ${response.status}`);
    }

    const payload = await response.json();
    const testimonials = Array.isArray(payload)
      ? payload
      : (Array.isArray(payload.testimonials) ? payload.testimonials : []);

    renderTestimonials(track, testimonials);

    if (!testimonials.length) {
      hideCarouselControls(prevBtn, nextBtn);
      return;
    }

    setupTestimonialsCarousel(section, viewport, track, prevBtn, nextBtn);
  } catch (error) {
    console.error('[testimonials] load failed:', error);
    track.innerHTML = `<p class="testimonials-empty">${t('about.reviews_unavailable', 'Reviews are currently unavailable.')}</p>`;
    hideCarouselControls(prevBtn, nextBtn);
  }
};

const renderTestimonials = (root, testimonials) => {
  root.innerHTML = '';

  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    root.innerHTML = `<p class="testimonials-empty">${t('about.reviews_empty', 'No reviews yet.')}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  testimonials.forEach(item => {
    const card = document.createElement('article');
    card.className = 'testimonial-card';

    const rating = clampRating(item.rating);
    const stars = document.createElement('div');
    stars.className = 'testimonial-stars';
    stars.setAttribute('aria-label', `${rating} out of 5 stars`);
    stars.textContent = getStars(rating);

    const quote = document.createElement('p');
    quote.className = 'testimonial-text';
    quote.textContent = item.text || '';

    const author = document.createElement('h4');
    author.className = 'testimonial-author';
    author.textContent = item.author || t('about.reviews_anonymous', 'Anonymous');

    const meta = buildMetaLine(item);

    card.appendChild(stars);
    card.appendChild(quote);
    card.appendChild(author);

    if (meta) {
      const metaEl = document.createElement('p');
      metaEl.className = 'testimonial-meta';
      metaEl.textContent = meta;
      card.appendChild(metaEl);
    }

    fragment.appendChild(card);
  });

  root.appendChild(fragment);
};

const setupTestimonialsCarousel = (section, viewport, track, prevBtn, nextBtn) => {
  let visibleCount = getVisibleCount();
  let firstVisibleIndex = 0;
  let maxStartIndex = 0;
  let resizeTimer = null;
  let isWrapping = false;
  const isMobileView = () => window.innerWidth <= 966;

  const getCards = () => Array.from(track.querySelectorAll('.testimonial-card'));

  const updateVisibleCount = (preservePosition = true) => {
    const nextVisibleCount = getVisibleCount();
    const currentStartIndex = firstVisibleIndex;

    visibleCount = nextVisibleCount;
    section.style.setProperty('--visible-count', String(visibleCount));

    if (preservePosition) {
      firstVisibleIndex = currentStartIndex;
    }

    if (isMobileView()) {
      firstVisibleIndex = 0;
      track.classList.add('no-animate');
      track.style.transform = 'translate3d(0, 0, 0)';
      viewport.scrollLeft = 0;
      requestAnimationFrame(() => track.classList.remove('no-animate'));
    }

    rebuildLayout();
    if (!isMobileView()) {
      goToIndex(firstVisibleIndex, false);
    }
  };

  const rebuildLayout = () => {
    const totalCards = getCards().length;
    maxStartIndex = Math.max(0, totalCards - visibleCount);

    const shouldShowControls = totalCards > visibleCount && !isMobileView();
    prevBtn.style.display = shouldShowControls ? 'grid' : 'none';
    nextBtn.style.display = shouldShowControls ? 'grid' : 'none';
    updateControls(shouldShowControls);
  };

  const waitForTrackTransition = () => new Promise(resolve => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      track.removeEventListener('transitionend', onEnd);
      clearTimeout(timer);
      resolve();
    };

    const onEnd = event => {
      if (event.target === track && event.propertyName === 'transform') {
        done();
      }
    };

    const timer = setTimeout(done, 450);
    track.addEventListener('transitionend', onEnd);
  });

  const goToIndex = (nextIndex, animate = true) => {
    if (isMobileView()) return;

    const cards = getCards();
    if (!cards.length) return;

    firstVisibleIndex = Math.max(0, Math.min(nextIndex, maxStartIndex));
    const firstCardIndex = Math.min(firstVisibleIndex, cards.length - 1);
    const firstCard = cards[firstCardIndex];
    const offset = firstCard ? firstCard.offsetLeft : 0;

    if (!animate) {
      track.classList.add('no-animate');
    }

    track.style.transform = `translate3d(${-offset}px, 0, 0)`;

    if (!animate) {
      requestAnimationFrame(() => track.classList.remove('no-animate'));
    }

    updateControls();
  };

  const updateControls = (visible = true) => {
    if (!visible) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    prevBtn.disabled = false;
    nextBtn.disabled = false;
  };

  prevBtn.addEventListener('click', async () => {
    if (isMobileView() || isWrapping) return;

    if (firstVisibleIndex <= 0) {
      const cards = getCards();
      const lastCard = cards[cards.length - 1];
      if (!lastCard) return;

      isWrapping = true;

      const clone = lastCard.cloneNode(true);
      clone.classList.add('testimonial-clone');
      track.insertBefore(clone, track.firstElementChild);

      rebuildLayout();
      goToIndex(1, false); // keep the current viewport visually stable

      requestAnimationFrame(() => {
        goToIndex(0, true); // animate one card step to the right
      });

      await waitForTrackTransition();

      const originalLast = track.lastElementChild;
      if (originalLast) {
        originalLast.remove();
      }
      clone.classList.remove('testimonial-clone');

      rebuildLayout();
      goToIndex(0, false);
      isWrapping = false;
      return;
    }

    goToIndex(firstVisibleIndex - 1);
  });

  nextBtn.addEventListener('click', async () => {
    if (isMobileView() || isWrapping) return;

    if (firstVisibleIndex >= maxStartIndex) {
      const cards = getCards();
      const firstCard = cards[0];
      if (!firstCard) return;

      isWrapping = true;

      const clone = firstCard.cloneNode(true);
      clone.classList.add('testimonial-clone');
      track.appendChild(clone);

      const wrapTargetIndex = firstVisibleIndex + 1;
      rebuildLayout();
      goToIndex(wrapTargetIndex, true); // animate one card step to the left

      await waitForTrackTransition();

      // Normalize before DOM mutation so the visual position does not jump.
      const normalizeIndex = wrapTargetIndex - 1;
      goToIndex(normalizeIndex, false);

      const originalFirst = track.firstElementChild;
      if (originalFirst) {
        originalFirst.remove();
      }
      clone.classList.remove('testimonial-clone');

      rebuildLayout();
      goToIndex(Math.min(normalizeIndex, maxStartIndex), false);
      isWrapping = false;
      return;
    }

    goToIndex(firstVisibleIndex + 1);
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateVisibleCount(true);
    }, 120);
  });

  updateVisibleCount(false);
};

const hideCarouselControls = (prevBtn, nextBtn) => {
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
};

const getVisibleCount = () => {
  if (window.innerWidth >= 1200) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
};

const buildMetaLine = item => {
  const parts = [];

  if (item.role) parts.push(item.role);
  if (item.company) {
    if (parts.length) {
      parts.push(`@ ${item.company}`);
    } else {
      parts.push(item.company);
    }
  } else if (item.source && item.source !== item.author) {
    parts.push(item.source);
  }

  return parts.join(' ');
};

const clampRating = value => {
  const num = Number(value);
  if (Number.isNaN(num)) return 5;
  return Math.min(5, Math.max(0, Math.round(num)));
};

const getStars = rating => {
  const filled = String.fromCharCode(9733); // black star
  const empty = String.fromCharCode(9734);  // white star
  return `${filled.repeat(rating)}${empty.repeat(5 - rating)}`;
};
