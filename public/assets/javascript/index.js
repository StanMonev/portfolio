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
  initializeLinks();
  setupSkillsCarousel();
  setupRoadmap();
});

/**
 * Toggles the visibility of the download button.
 * 
 * @returns {void}
 */
const toggleDownloadButton = () => {
  const element = document.getElementById("downloadButton");
  if (!element) return;
  element.classList.toggle("hidden");
  element.classList.toggle("visible");
};

/**
 * Sets up smooth scrolling for navigation links in the main navbar.
 * 
 * @returns {void}
 */
const setupNavigationLinks = () => {
  document.querySelectorAll('#mainNavbar .navbar-list .nav-item a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target.id === 'about') {
        scrollIntoViewWithOffset(target, 100);
      } else {
        scrollIntoViewWithOffset(target);
      }
    });
  });
};

/**
 * The navbar should have a transparent background at the top of the page.
 * 
 * @returns {void}
 */
const setNavbar = () => {
  const navbar = document.getElementById('mainNavbar');
  const dropdownList = document.querySelector('#countrySelect .fd-list');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY === 0) {
      navbar.style.backgroundColor = 'transparent';
      navbar.style.boxShadow = 'none';
      navbar.style.backdropFilter = 'none';
      dropdownList.style.backgroundColor = 'transparent';
      dropdownList.style.boxShadow = 'none';
    } else {
      navbar.removeAttribute('style');
      dropdownList.removeAttribute('style');
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
  // one-time listeners
  window.addEventListener('resize', () => resetMatrix(canvas), { passive: true });
  window.addEventListener('orientationchange', () => resetMatrix(canvas), { passive: true });
  // Start
  resetMatrix(canvas);
};

/**
 * Stop (if running), resize, re-init state, and restart.
 */
const resetMatrix = (canvas) => {
  stopMatrix();
  const state = initMatrixCanvas(canvas, MATRIX.fontSize);
  startMatrixLoop(state);
};

/**
 * Cancel the RAF loop if active.
 */
const stopMatrix = () => {
  if (MATRIX.rafId != null) {
    cancelAnimationFrame(MATRIX.rafId);
    MATRIX.rafId = null;
  }
};

/**
 * Prepare canvas size (with DPR), compute columns/drops, and return drawing state.
 */
const initMatrixCanvas = (canvas, fontSize) => {
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  // Full document height (so the background spans long pages)
  const widthCSS = Math.ceil(document.documentElement.clientWidth || window.innerWidth);
  const heightCSS = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.documentElement.clientHeight,
    window.innerHeight
  );

  // Match CSS size
  canvas.style.width = `${widthCSS}px`;
  canvas.style.height = `${heightCSS}px`;

  // Backing store scaled for HiDPI
  canvas.width = Math.floor(widthCSS * dpr);
  canvas.height = Math.floor(heightCSS * dpr);

  const ctx = canvas.getContext('2d');
  // Normalize drawing to CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = 'top';

  // Compute columns & drops
  const columns = Math.ceil(widthCSS / fontSize);
  const drops = new Array(columns).fill(1);

  // Paint initial background
  ctx.fillStyle = 'rgb(10, 10, 10)';
  ctx.fillRect(0, 0, widthCSS, heightCSS);

  return { ctx, widthCSS, heightCSS, drops, fontSize };
};

/**
 * Start the animation loop (RAF).
 */
const startMatrixLoop = ({ ctx, widthCSS, heightCSS, drops, fontSize }) => {
  const { letters } = MATRIX;

  const tick = () => {
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
  const modalCloseTop = document.getElementById('modalCloseTop');
  const modalCloseBottom = document.getElementById('modalCloseBottom');

  [modalCloseTop, modalCloseBottom].forEach(element => {
    element.onclick = () => modal.style.display = 'none';
  });

  window.onclick = event => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
};

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
    document.getElementById('modal').style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Initializes smooth scrolling behavior for links on the page.
 * 
 * @returns {void}
 */
const initializeLinks = () => {
  document.querySelectorAll('.links a').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href').substring(2);
      const targetElement = document.getElementById(targetId);
      if (targetElement) scrollIntoViewWithOffset(targetElement, -125);
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
  if (!track) return;

  const SPEED_PX = 0.6; // lower = slower
  let offset = 0;
  let rafId = null;
  let loopWidth = 0; // width of the original set

  // Don’t double-clone if this runs twice (hot reload, etc.)
  const alreadyCloned = track.hasAttribute('data-cloned');
  if (!alreadyCloned) {
    const children = Array.from(track.children);
    children.forEach(node => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    track.setAttribute('data-cloned', 'true');
  }

  // Measure after layout paints
  function measure() {
    // With one clone pass, half of scrollWidth is the original “lap”
    loopWidth = track.scrollWidth / 2;
  }

  function step() {
    offset -= SPEED_PX;
    if (-offset >= loopWidth) {
      // Snap back by exactly one lap
      offset += loopWidth;
    }
    track.style.transform = `translateX(${offset}px)`;
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

  // Recompute on resize (debounced)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const current = offset % loopWidth; // preserve relative position
      measure();
      offset = current; // keep visual continuity
    }, 100);
  });

  // Pause on hover
  const frame = document.querySelector('.skills-section');
  frame.addEventListener('mouseenter', stop);
  frame.addEventListener('mouseleave', start);

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Kickoff
  requestAnimationFrame(() => {
    measure();
    start();
  });
}

const setupRoadmap = () => {
  const canvas = document.getElementById('roadmapCanvas');
  if (!canvas || canvas.dataset.initialized === 'true') return;
  canvas.dataset.initialized = 'true';

  const dataUrl = canvas.getAttribute('data-src');
  const pointsContainer = canvas.querySelector('.roadmap-points-container');

  // Load data and render points
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

  function renderPoints(data) {
    pointsContainer.innerHTML = '';

    data.forEach((item, i) => {
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
        <h4>${item.title || 'Untitled'}</h4>
        <div class="meta">${[item.org, item.date].filter(Boolean).join(' · ')}</div>
        <p>${item.description || ''}</p>
        ${item.tags ? `<div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
        ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener">Open</a>` : ''}
      `;

      point.appendChild(tooltip);
      pointsContainer.appendChild(point);
    });
  }

  // Initialize
  (async function init() {
    const items = await loadData();
    renderPoints(items);
  })();
}


