/**
 * index.js
 *
 * This file contains the main frontend logic for initializing and handling various interactions on the website.
 * It includes functions for setting up navigation, handling form submissions, managing modals, controlling the matrix background animation,
 * managing cookies and policies, and ensuring smooth scrolling behavior.
 *
 * Key functionalities:
 * - Setup event listeners and initialize page components on DOMContentLoaded.
 * - Handle email form submission with validation and error handling.
 * - Manage navigation links for smooth scrolling to sections.
 * - Implement modal display and hide functionality.
 * - Manage user cookie preferences and load cookies accordingly.
 * - Handle dynamic background effects like the matrix animation.
 *
 * This script is essential for ensuring that the website's interactive elements function correctly and that user actions are handled smoothly.
 */

document.addEventListener("DOMContentLoaded", () => {
  preloadImages();
  setNavbar();
  setupNavigationLinks();
  sendEmailHandler();
  checkInputFilled();
  setupMatrixBackground();
  setupModal();
  setupPolicies();
  setupCookies();
  setupSkillsCarousel();
  setupRoadmap();
  setupLanguageSwitcher();
});

/**
 * Sets up smooth scrolling for navigation links in the main navbar.
 * 
 * @returns {void}
 */
const setupNavigationLinks = () => {
  const links = document.querySelectorAll('#mainNavbar .links a');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href').substring(1));
      scrollIntoViewWithOffset(target);
    });
  });
};


/**
 * Scrolls the page to the target element with an offset for fixed headers.
 * 
 * @param {HTMLElement} targetElement - The element to scroll to.
 * @param {number} offset - The offset to apply to the scroll position.
 * @returns {void}
 */
const scrollIntoViewWithOffset = (targetElement, offset = 0) => {
  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * The navbar should have a transparent background at the top of the page.
 * 
 * @returns {void}
 */
const setNavbar = () => {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY === 0) {
      navbar.removeAttribute('style');
    } else {
      navbar.style.backgroundColor = 'transparent';
      navbar.style.boxShadow = 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px';
      navbar.style.backdropFilter = 'blur(10px) saturate(0.95) contrast(0.95)';
    }
  };

  // Initial check
  handleScroll();

  // Listen for scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });
};

/**
 * Handles the email form submission, including validation for terms acceptance.
 * 
 * @returns {void}
 */
const sendEmailHandler = () => {
  const form = document.getElementById("sendEmailForm");
  const termsCheckbox = document.getElementById('terms');
  const errorMessage = document.querySelector('#termsContainer .error-message');

  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!termsCheckbox.checked) {
      errorMessage.textContent = 'You must accept the Terms and Conditions and Privacy Policy.';
      errorMessage.classList.remove('hidden');
      return;
    } else {
      errorMessage.classList.add('hidden');
    }

    sendEmail(form);
  });

  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });
};

/**
 * Sends the email form data to the server using an XMLHttpRequest.
 * 
 * @param {HTMLFormElement} form - The form element containing the email data.
 * @returns {void}
 */
const sendEmail = form => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/contact");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) handleXhrResponse(xhr, form);
  };

  const formData = new FormData(form);
  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  xhr.send(JSON.stringify(jsonData));
};

/**
 * Handles the response from the email form submission.
 * 
 * @param {XMLHttpRequest} xhr - The XMLHttpRequest object containing the response.
 * @param {HTMLFormElement} form - The form element that was submitted.
 * @returns {void}
 */
const handleXhrResponse = (xhr, form) => {
  const response = JSON.parse(xhr.responseText);

  switch (xhr.status) {
    case 200:
      showMessage('success', response.msg);
      form.reset();
      break;
    case 400:
      handleValidationErrors(response.data);
      break;
    case 500:
      showMessage('error', 'An error has occurred!');
      console.error(response.msg);
      break;
    default:
      console.log(xhr.status, response);
  }
};

/**
 * Displays a message to the user in a styled alert box.
 * 
 * @param {string} alert - The type of alert ('success' or 'error').
 * @param {string} message - The message to display in the alert box.
 * @returns {void}
 */
const showMessage = (alert, message) => {
  const messageEl = $(`.alert-box.${alert}`);
  const container = messageEl.parent();
  const ratio = 4.7575;
  const width = $(window).width() / ratio;
  const marginToSet = width / 2;

  container.css({
    width: `${width}px`,
    marginLeft: `-${marginToSet}px`
  });

  messageEl.find('span').html(message);
  container.fadeIn(300).delay(1500).fadeOut(400);
};

/**
 * Handles validation errors by displaying error messages next to the corresponding form fields.
 * 
 * @param {Object} errors - An object containing validation errors keyed by field name.
 * @returns {void}
 */
const handleValidationErrors = errors => {
  clearErrors();

  if (typeof errors === 'string') {
    errors = JSON.parse(errors);
  }

  Object.keys(errors).forEach(field => {
    const input = document.getElementById(field);
    if (input) {
      input.classList.add("is-invalid");
      const errorContainer = input.nextElementSibling.nextElementSibling;
      errorContainer.textContent = errors[field].msg;
      errorContainer.classList.remove("hidden");
    }
  });
};

/**
 * Clears the validation error from a specific form input field.
 * 
 * @param {HTMLElement} input - The input element to clear the error from.
 * @returns {void}
 */
const clearError = input => {
  input.classList.remove("is-invalid");
  input.nextElementSibling.nextElementSibling.classList.add("hidden");
};

/**
 * Clears all validation errors from the form.
 * 
 * @returns {void}
 */
const clearErrors = () => {
  document.querySelectorAll(".is-invalid").forEach(clearError);
};

/**
 * Checks if any input fields or text areas in the contact form are filled, and applies appropriate styling.
 * 
 * @returns {void}
 */
const checkInputFilled = () => {
  const formContainer = document.querySelector('.contact-container');
  const inputFields = formContainer.querySelectorAll('input:not(#sendEmailBtn)');
  const textareaField = formContainer.querySelector('textarea');

  inputFields.forEach(input => {
    input.addEventListener('input', e => checkFilled(e, inputFields, textareaField));
  });

  textareaField.addEventListener('input', e => checkFilled(e, inputFields, textareaField));
};

/**
 * Checks if any fields in the form are filled and toggles a class accordingly.
 * 
 * @param {Event} e - The event object from the input event.
 * @param {NodeList} inputFields - A list of input elements in the form.
 * @param {HTMLElement} textareaField - The textarea element in the form.
 * @returns {void}
 */
const checkFilled = (e, inputFields, textareaField) => {
  const anyFieldFilled = [...inputFields].some(input => input.value.trim() !== '') || textareaField.value.trim() !== '';
  e.target.classList.toggle('filled', anyFieldFilled);
};

/**
 * Matrix background — robust, crisp, and leak-free.
 * Usage: call setupMatrixBackground() once after DOM is ready.
 */

const MATRIX = {
  rafId: null,
  state: null,
  fontSize: 14,                        // tweak as you like
  letters: ('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').repeat(6).split(''),
};

/**
 * Initialize and start the matrix background.
 */
const setupMatrixBackground = () => {
  const canvas = document.querySelector('.matrix');
  if (!canvas) {
    console.warn('[matrix] No canvas with class ".matrix" found.');
    return;
  }

  let syncRafId = null;
  const scheduleMatrixSync = () => {
    if (syncRafId != null) return;
    syncRafId = requestAnimationFrame(() => {
      syncRafId = null;
      syncMatrix(canvas);
    });
  };

  window.updateMatrix = () => scheduleMatrixSync();

  // On mobile, scrolling can trigger resize events due browser UI (address bar) changes.
  // Reset only when viewport width changes (real layout shift), not height-only churn.
  let lastViewportWidth = window.innerWidth;
  const onViewportResize = () => {
    const currentWidth = window.innerWidth;
    const widthChanged = Math.abs(currentWidth - lastViewportWidth) > 1;
    if (!widthChanged) return;

    lastViewportWidth = currentWidth;
    scheduleMatrixSync();
  };

  // one-time listeners
  window.addEventListener('resize', onViewportResize, { passive: true });
  window.addEventListener('orientationchange', scheduleMatrixSync, { passive: true });
  window.addEventListener('languageChanged', scheduleMatrixSync, { passive: true });
  window.addEventListener('translationsInitialized', scheduleMatrixSync, { passive: true });

  // Start
  window.addEventListener('load', scheduleMatrixSync, { passive: true });
  scheduleMatrixSync();
};

/**
 * Initialize the loop once, then keep the current animation state across resizes.
 */
const syncMatrix = (canvas) => {
  if (!MATRIX.state) {
    MATRIX.state = initMatrixCanvas(canvas, MATRIX.fontSize);
    startMatrixLoop(MATRIX.state);
    return;
  }

  resizeMatrixState(canvas, MATRIX.state);
};

/**
 * Resize the backing canvas without restarting the animation from scratch.
 */
const resizeMatrixState = (canvas, state) => {
  const { dpr, widthCSS, heightCSS } = getMatrixCanvasMetrics();
  const previousWidthCSS = state.widthCSS;
  const previousHeightCSS = state.heightCSS;

  if (
    previousWidthCSS === widthCSS &&
    previousHeightCSS === heightCSS &&
    state.dpr === dpr
  ) {
    return;
  }

  let snapshot = null;
  if (canvas.width > 0 && canvas.height > 0) {
    snapshot = document.createElement('canvas');
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext('2d').drawImage(canvas, 0, 0);
  }

  configureMatrixCanvas(canvas, widthCSS, heightCSS, dpr);

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${state.fontSize}px monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgb(10, 10, 10)';
  ctx.fillRect(0, 0, widthCSS, heightCSS);

  if (snapshot) {
    ctx.drawImage(snapshot, 0, 0, previousWidthCSS, previousHeightCSS);
  }

  const nextColumnCount = Math.ceil(widthCSS / state.fontSize);
  const maxDropOffset = Math.max(1, Math.ceil(heightCSS / state.fontSize));
  const nextDrops = Array.from({ length: nextColumnCount }, (_, index) => (
    index < state.drops.length
      ? state.drops[index]
      : Math.floor(Math.random() * maxDropOffset)
  ));

  state.ctx = ctx;
  state.widthCSS = widthCSS;
  state.heightCSS = heightCSS;
  state.dpr = dpr;
  state.drops = nextDrops;
};

/**
 * Prepare canvas size (with DPR), compute columns/drops, and return drawing state.
 */
const initMatrixCanvas = (canvas, fontSize) => {
  const { dpr, widthCSS, heightCSS } = getMatrixCanvasMetrics();
  configureMatrixCanvas(canvas, widthCSS, heightCSS, dpr);

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = 'top';

  const columns = Math.ceil(widthCSS / fontSize);
  const drops = new Array(columns).fill(1);

  ctx.fillStyle = 'rgb(10, 10, 10)';
  ctx.fillRect(0, 0, widthCSS, heightCSS);

  return { ctx, widthCSS, heightCSS, drops, fontSize, dpr };
};

const getMatrixCanvasMetrics = () => {
  const main = document.querySelector('.main-container');
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  const widthCSS = Math.ceil(
    (main && main.clientWidth) ||
    document.documentElement.clientWidth ||
    window.innerWidth || 0
  );

  const heightCSS = Math.ceil(
    main
      ? Math.max(main.scrollHeight, main.offsetHeight, main.getBoundingClientRect().height)
      : (document.documentElement.clientHeight || window.innerHeight || 0)
  );

  return { dpr, widthCSS, heightCSS };
};

const configureMatrixCanvas = (canvas, width, height, dpr) => {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
};


/**
 * Start the animation loop (RAF).
 */
const startMatrixLoop = (state) => {
  const { letters } = MATRIX;

  const tick = () => {
    const { ctx, widthCSS, heightCSS, drops, fontSize } = state;

    // trail fade
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, widthCSS, heightCSS);

    for (let i = 0; i < drops.length; i++) {
      const ch = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);

      drops[i] += 1;

      // Randomly reset
      if (drops[i] * fontSize > heightCSS && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }

    MATRIX.rafId = requestAnimationFrame(tick);
  };

  MATRIX.rafId = requestAnimationFrame(tick);
};

/**
 * Sets up the modal functionality, including opening and closing the modal on specific events.
 * 
 * @returns {void}
 */
const setupModal = () => {
  const modal = document.getElementById('modal');
  const closeTop = document.getElementById('modalCloseTop');
  const closeBottom = document.getElementById('modalCloseBottom');

  closeTop?.addEventListener('click', closeModal);
  closeBottom?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
};

function openModal() {
  modal.classList.add('open');
  document.getElementsByTagName('html')[0].style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove('open');
  document.getElementsByTagName('html')[0].removeAttribute('style');
}


/**
 * Sets up event listeners for links that open modals, loading the corresponding content.
 * 
 * @returns {void}
 */
const setupPolicies = () => {
  document.querySelectorAll('.modal-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showPolicy(event.currentTarget.href);
    });
  });
};

/**
 * Sets up cookie management functionality, including handling user preferences for cookies.
 * 
 * @returns {void}
 */
const setupCookies = () => {
  const cookieNotice = document.getElementById('cookieNotice');
  const acceptCookies = document.getElementById('acceptCookies');
  const rejectCookies = document.getElementById('rejectCookies');
  const customizeCookies = document.getElementById('customizeCookies');
  const savePreferences = document.getElementById('savePreferences');
  const cookiePreferences = document.getElementById('cookiePreferences');

  if (!localStorage.getItem('cookiesAccepted')) {
    cookieNotice.style.display = 'block';
  } else {
    loadCookies();
  }

  acceptCookies.addEventListener('click', () => {
    handleCookieConsent(true, true);
  });

  rejectCookies.addEventListener('click', () => {
    handleCookieConsent(true, false);
  });

  customizeCookies.addEventListener('click', () => {
    cookiePreferences.style.display = 'block';
  });

  savePreferences.addEventListener('click', () => {
    const analyticsAllowed = document.getElementById('analyticsCookies').checked;
    handleCookieConsent(true, analyticsAllowed);
  });
};

/**
 * Handles the user's cookie consent preferences and saves them accordingly.
 * 
 * @param {boolean} essential - Whether essential and functional cookies are allowed.
 * @param {boolean} analytics - Whether analytics cookies are allowed.
 * @returns {void}
 */
const handleCookieConsent = (essential, analytics) => {
  localStorage.setItem('cookiesAccepted', 'true');
  setCookie('essentialCookies', essential, 365);
  setCookie('functionalCookies', essential, 365);
  setCookie('analyticsCookies', analytics, 365);
  saveCookiePreference('essentialCookies', essential);
  saveCookiePreference('functionalCookies', essential);
  saveCookiePreference('analyticsCookies', analytics);
  document.getElementById('cookieNotice').style.display = 'none';
  loadCookies();
};

/**
 * Sends analytics data to the server if analytics cookies are allowed.
 * 
 * @returns {Promise<void>} - A promise that resolves when the data is successfully sent.
 */
const sendAnalyticsData = async () => {
  try {
    await postData('/api/track', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId()
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Saves the user's cookie preference by sending it to the server.
 * 
 * @param {string} cookieName - The name of the cookie.
 * @param {boolean} cookieValue - The value of the cookie (true or false).
 * @returns {Promise<void>} - A promise that resolves when the preference is successfully saved.
 */
const saveCookiePreference = async (cookieName, cookieValue) => {
  try {
    await postData('/api/set-preference', {
      sessionId: getSessionId(),
      cookieName,
      cookieValue
    });
  } catch (error) {
    console.error('Error saving cookie preference:', error);
  }
};

/**
 * Loads and displays a policy in the modal based on the provided endpoint.
 * 
 * @param {string} endpoint - The URL endpoint for the policy content.
 * @returns {Promise<void>} - A promise that resolves when the policy content is successfully loaded.
 */
const showPolicy = async endpoint => {
  try {
    const modalBody = document.getElementById('modalBody');
    const data = await fetchData(endpoint, 'HTML');
    modalBody.innerHTML = data;
    openModal();
  } catch (error) {
    console.error('Error:', error);
  }
};

const preloadImages = async () => {
  const paths = await fetchData('/api/images');
  paths.forEach(path => {
    const img = new Image();
    img.src = path;
  });
}

/**
 * Skills carousel: infinitely scroll skills horizontally by duplicating the content.
 * This creates a seamless, jitter-free loop.
 */
const setupSkillsCarousel = () => {
  const track = document.getElementById('skillsTrack');
  const frame = document.querySelector('.skills-section');
  if (!track || !frame) return;

  const DEFAULT_SPEED_PX_S = 36;
  const MIN_SPEED_PX_S = 20;
  const MAX_SPEED_PX_S = 300;

  let offset = 0;
  let loopWidth = 0;
  let rafId = null;

  // positive = move RIGHT, negative = move LEFT
  let baseSpeed = DEFAULT_SPEED_PX_S;

  let isPointerDown = false;
  let startX = 0;
  let lastX = 0;
  let lastT = 0;
  let lastMoveT = 0;
  let vx = 0; // px/ms

  if (!track.hasAttribute('data-cloned')) {
    const children = Array.from(track.children);
    children.forEach(node => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    track.setAttribute('data-cloned', 'true');
  }

  function measure() {
    loopWidth = track.scrollWidth / 2;
  }

  function wrapOffset(x) {
    if (loopWidth <= 0) return x;
    while (x <= -loopWidth) x += loopWidth;
    while (x > 0) x -= loopWidth;
    return x;
  }

  function render() {
    track.style.transform = `translate3d(${offset}px,0,0)`;
  }

  function step(t) {
    if (!lastT) lastT = t;
    const dt = Math.min(50, t - lastT); // ms cap
    lastT = t;

    if (!isPointerDown) {
      // follow our “positive = right” convention
      offset += baseSpeed * (dt / 1000);
      offset = wrapOffset(offset);
      render();
    }
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (rafId == null) rafId = requestAnimationFrame(step);
  }
  function stop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  // Keep visual continuity on resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const prevLoopWidth = loopWidth || 1;
      const progress = offset / prevLoopWidth; // fraction (can be negative)
      measure();
      offset = progress * loopWidth;
      offset = wrapOffset(offset);
      render();
    }, 100);
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Drag/Flick with Pointer Events
  frame.style.touchAction = 'pan-x';
  frame.style.cursor = 'grab';

  function onPointerDown(e) {
    isPointerDown = true;
    frame.setPointerCapture?.(e.pointerId);
    frame.style.cursor = 'grabbing';

    // kill text selection while dragging
    document.body.style.userSelect = 'none';

    startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    lastX = startX;
    lastMoveT = performance.now();
  }

  function onPointerMove(e) {
    if (!isPointerDown) return;
    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const now = performance.now();
    const dx = x - lastX;
    const dt = Math.max(1, now - lastMoveT);

    // direct drag: move with the pointer
    offset += dx;              // dx>0 -> move right
    offset = wrapOffset(offset);
    render();

    vx = dx / dt;              // px/ms
    lastX = x;
    lastMoveT = now;

    if (e.cancelable) e.preventDefault();
  }

  function onPointerUp() {
    if (!isPointerDown) return;
    isPointerDown = false;
    frame.style.cursor = 'grab';
    document.body.style.userSelect = ''; // restore selection

    const flickSpeed = vx * 1000; // px/s, sign follows drag direction
    if (Math.abs(flickSpeed) > MIN_SPEED_PX_S) {
      baseSpeed = Math.max(-MAX_SPEED_PX_S, Math.min(MAX_SPEED_PX_S, flickSpeed));
    } else {
      if (Math.abs(baseSpeed) < MIN_SPEED_PX_S) {
        baseSpeed = (baseSpeed >= 0 ? 1 : -1) * MIN_SPEED_PX_S;
      }
    }
  }

  frame.addEventListener('pointerdown', onPointerDown, { passive: false });
  frame.addEventListener('pointermove', onPointerMove, { passive: false });
  frame.addEventListener('pointerup', onPointerUp, { passive: true });
  frame.addEventListener('pointercancel', onPointerUp, { passive: true });
  frame.addEventListener('pointerleave', onPointerUp, { passive: true });

  // Wheel/trackpad horizontal scroll nudges the position and sets direction
  frame.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    offset += e.deltaX; // natural: deltaX>0 scrolls right
    offset = wrapOffset(offset);
    render();

    const factor = 4;
    const targetSpeed = Math.max(-MAX_SPEED_PX_S, Math.min(MAX_SPEED_PX_S, e.deltaX * factor));
    if (Math.abs(targetSpeed) >= MIN_SPEED_PX_S) baseSpeed = targetSpeed;

    e.preventDefault();
  }, { passive: false });

  requestAnimationFrame(() => {
    measure();
    render();
    start();
  });
};

/** Roadmap: fetch data, render points, handle language switching.
 * Usage: call setupRoadmap() once after DOM is ready.
 */
const setupRoadmap = () => {
  const canvas = document.getElementById('roadmapCanvas');
  const dataUrl = canvas?.getAttribute('data-src');

  // Store the data globally for language switching
  let roadmapData = [];

  // Load data function
  async function loadData() {
    try {
      const res = await fetch(dataUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (e) {
      console.error('Roadmap data error:', e);
      return [];
    }
  }

  // Desktop roadmap setup
  function renderPoints(data, language = 'en') {
    if (!canvas) return;

    const pointsContainer = canvas.querySelector('.roadmap-points-container');
    if (!pointsContainer) return;

    pointsContainer.innerHTML = '';

    data.forEach((item, i) => {
      // Get translations for current language or fallback to English
      const content = item.translations?.[language] || item.translations?.en || {
        title: item.title || 'Untitled',
        org: item.org || '',
        date: item.date || '',
        description: item.description || ''
      };

      // Create point element
      const point = document.createElement('div');
      point.className = 'roadmap-point';
      point.style.left = `${item.x || 50}%`;
      point.style.top = `${item.y || (20 + i * 30)}%`;
      point.style.setProperty('--delay', `${0.2 + i * 0.4}s`);
      point.style.setProperty('--duration', `${1.8 + i * 0.4}s`);
      point.dataset.index = i;
      point.setAttribute('data-direction', item.popup_dir);

      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'roadmap-tooltip';
      tooltip.innerHTML = `
        <h4>${content.title}</h4>
        <div class="meta">${[content.org, content.date].filter(Boolean).join(' · ')}</div>
        <p>${content.description}</p>
        ${item.tags ? `<div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
        ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener">Open</a>` : ''}
      `;

      point.appendChild(tooltip);
      pointsContainer.appendChild(point);
    });
  }

  // Mobile timeline setup function that uses roadmapData
  function setupMobileTimeline(data, language = 'en') {
    const startYear = s => {
      const m = String(s).match(/(\d{4})/);
      return m ? parseInt(m[1], 10) : 0;
    };

    // Use the passed data and language instead of hardcoded 'en'
    const items = data.map(r => {
      const t = r.translations?.[language] || r.translations?.en || {};
      return {
        title: t.title || '',
        org: t.org || '',
        date: t.date || '',
        description: t.description || '',
        tags: r.tags || []
      };
    }).sort((a, b) => startYear(a.date) - startYear(b.date));

    // ---- Render slides ----
    const track = document.getElementById('track');
    if (!track) return;

    track.innerHTML = ''; // Clear existing content

    items.forEach((e, idx) => {
      const el = document.createElement('article');
      el.className = 'slide';
      el.setAttribute('data-index', idx);
      el.innerHTML = `
      <div class="topline">
        <div class="title">${e.title}</div>
        <div class="org">${e.org}</div>
        <div class="date">${e.date}</div>
      </div>
      ${e.description ? `<div class="desc">${e.description}</div>` : ``}
      ${e.tags?.length ? `<div class="tags">${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ``}
    `;
      track.appendChild(el);
    });

    // ---- Year rail ----
    const railTicks = document.getElementById('railTicks');
    if (!railTicks) return;

    railTicks.innerHTML = ''; // Clear existing content

    items.forEach((e, i) => {
      const y = startYear(e.date) || e.date;
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.textContent = y;
      tick.dataset.index = i;
      tick.addEventListener('click', () => snapTo(i));
      railTicks.appendChild(tick);
    });

    // ---- Active slide tracking ----
    let slideWidth = null;
    function computeMetrics() {
      const first = track.querySelector('.slide');
      slideWidth = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 1;
    }

    function nearestIndex() {
      const left = track.scrollLeft;
      const slides = track.querySelectorAll('.slide');
      if (!slides.length) return 0;
      let best = 0, bestDist = Infinity;
      slides.forEach((s, i) => {
        const x = s.offsetLeft;
        const d = Math.abs(x - left);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }

    function setActive(i) {
      document.querySelectorAll('.tick').forEach((t, idx) => {
        t.classList.toggle('active', idx === i);
      });
    }

    function snapTo(i) {
      const target = track.querySelector(`.slide[data-index="${i}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }

    // initial state
    computeMetrics();
    setActive(0);

    // update on scroll (throttled)
    let raf = null;
    track.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        setActive(nearestIndex());
      });
    });

    // make vertical wheels pan horizontally on desktop touchpads/mice
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        track.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    // keyboard left/right support when track is focused
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); snapTo(Math.min(nearestIndex() + 1, items.length - 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); snapTo(Math.max(nearestIndex() - 1, 0)); }
    });

    // nav buttons (desktop nicety)
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    if (btnPrev) btnPrev.addEventListener('click', () => snapTo(Math.max(nearestIndex() - 1, 0)));
    if (btnNext) btnNext.addEventListener('click', () => snapTo(Math.min(nearestIndex() + 1, items.length - 1)));

    // recalc on resize
    window.addEventListener('resize', computeMetrics);
  }

  // Function to update roadmap language
  function updateRoadmapLanguage(language) {
    if (roadmapData.length > 0) {
      if (window.innerWidth >= 1550) {
        renderPoints(roadmapData, language);
      } else {
        setupMobileTimeline(roadmapData, language); // Pass language parameter
      }
    }
  }

  // Store the update function globally
  window.updateRoadmapLanguage = updateRoadmapLanguage;

  // Initialize based on screen size
  async function init() {
    roadmapData = await loadData();

    // Get current language from localStorage or default to 'en'
    const currentLanguage = localStorage.getItem('language') || 'en';

    if (window.innerWidth < 1550) {
      const roadmap = document.getElementById('roadmap');
      if (roadmap) roadmap.style.display = 'none';
      setupMobileTimeline(roadmapData, currentLanguage); // Pass current language
    } else {
      if (canvas && canvas.dataset.initialized !== 'true') {
        canvas.dataset.initialized = 'true';
        renderPoints(roadmapData, currentLanguage); // Pass current language
      }
    }
  }

  // Start initialization
  init();
};

/** Language switcher: accessible dropdown with flags and labels.
 * Usage: call setupLanguageSwitcher() once after DOM is ready.
 */
const setupLanguageSwitcher = () => {
  function initFlagDropdown(root) {
    const trigger = root.querySelector('.fd-trigger');
    const list = root.querySelector('.fd-list');
    const iconEl = root.querySelector('.fd-trigger-icon');
    const labelEl = root.querySelector('.fd-trigger-label');
    const options = Array.from(root.querySelectorAll('.fd-option'));

    // Internal state
    let activeIndex = -1;

    // Helper: apply selection to trigger
    function applySelection(opt) {
      const iconUrl = opt.getAttribute('data-icon-url') || '';
      const label = opt.getAttribute('data-label') || opt.textContent.trim();
      iconEl.src = iconUrl;
      iconEl.alt = '';
      labelEl.textContent = label;
      options.forEach(o => o.setAttribute('aria-selected', String(o === opt)));
      root.dataset.value = opt.getAttribute('data-value') || '';
      localStorage.setItem('language', root.dataset.value);
      root.dispatchEvent(new CustomEvent('change', { detail: { value: root.dataset.value, label, iconUrl } }));
      window.updateRoadmapLanguage ? window.updateRoadmapLanguage(root.dataset.value) : null;
    }

    // Helper: open/close
    function setOpen(open) {
      root.setAttribute('aria-expanded', String(open));
      if (open) {
        // focus active or selected
        const selectedIndex = options.findIndex(o => o.getAttribute('aria-selected') === 'true');
        activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
        setActive(activeIndex);
        list.focus({ preventScroll: true });
      } else {
        activeIndex = -1;
      }
    }

    // Active highlight
    function setActive(index) {
      options.forEach(o => o.removeAttribute('data-active'));
      if (index >= 0 && index < options.length) {
        options[index].setAttribute('data-active', 'true');
        options[index].scrollIntoView({ block: 'nearest' });
      }
    }

    // Click handling
    trigger.addEventListener('click', () => {
      setOpen(root.getAttribute('aria-expanded') !== 'true');
      trigger.style.visibility = 'hidden';
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) {
        trigger.removeAttribute('style');
        setOpen(false);
      }
    });

    options.forEach((opt, i) => {
      // Render icon thumbnails inside options
      const existingImg = opt.querySelector('img');
      if (!existingImg) {
        const img = document.createElement('img');
        img.src = opt.getAttribute('data-icon-url') || '';
        img.alt = '';
        opt.prepend(img);
      }
      opt.addEventListener('click', () => {
        trigger.removeAttribute('style');
        applySelection(opt);
        setOpen(false);
        trigger.focus();
      });
      opt.addEventListener('mousemove', () => { activeIndex = i; setActive(activeIndex); });
    });

    // Keyboard on trigger
    trigger.addEventListener('keydown', (e) => {
      const open = root.getAttribute('aria-expanded') === 'true';
      if ((e.key === 'Enter' || e.key === ' ') && !open) { e.preventDefault(); setOpen(true); return; }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !open) { e.preventDefault(); setOpen(true); }
    });

    // Keyboard on list
    list.addEventListener('keydown', (e) => {
      const open = root.getAttribute('aria-expanded') === 'true';
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); trigger.focus(); return; }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (activeIndex >= 0) options[activeIndex].click();
        return;
      }
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(options.length - 1, (activeIndex + 1)); setActive(activeIndex); }
      if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(0, (activeIndex - 1)); setActive(activeIndex); }
      if (e.key === 'Home') { e.preventDefault(); activeIndex = 0; setActive(activeIndex); }
      if (e.key === 'End') { e.preventDefault(); activeIndex = options.length - 1; setActive(activeIndex); }
    });

    // Initialize default (data-selected) or first
    const preset = options.find(o => o.hasAttribute('data-selected')) || options[0];
    if (preset) applySelection(preset);
  }

  // Init all instances on the page
  document.querySelectorAll('.flag-dropdown').forEach(initFlagDropdown);
};
