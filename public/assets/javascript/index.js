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
  setupNavigationLinks();
  sendEmailHandler();
  checkInputFilled();
  setupMatrixBackground();
  setupModal();
  setupPolicies();
  setupCookies();
  initializeLinks();
  // Start skills carousel
  setupSkillsCarousel();
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
      scrollIntoViewWithOffset(target, 100);
    });
  });
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
 * Sets up the matrix background animation and attaches resize observers to handle screen changes.
 * 
 * @returns {void}
 */
const setupMatrixBackground = async () => {
  let initID = runMatrixBackground();
  localStorage.setItem("matrixBackgroundID", initID);

  const resizeObserver = new ResizeObserver(resetMatrix);
  resizeObserver.observe(document.querySelector('main'));
  screen.orientation.addEventListener("change", resetMatrix);
};

/**
 * Resets the matrix background animation by clearing and restarting the interval.
 * 
 * @returns {void}
 */
const resetMatrix = () => {
  let id = localStorage.getItem("matrixBackgroundID");
  if (id !== undefined) clearInterval(id);
  id = runMatrixBackground();
  localStorage.setItem("matrixBackgroundID", id);
};

/**
 * Runs the matrix background animation by drawing letters on the canvas.
 * 
 * @returns {number} - The interval ID for the animation loop.
 */
const runMatrixBackground = () => {
  const canvas = document.querySelector('.matrix');
  const ctx = canvas.getContext('2d');
  setCanvasHeight(canvas);

  canvas.width = $('html').width();

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'.repeat(6).split('');
  const fontSize = 10;
  const columns = canvas.width / fontSize;
  let drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  return loopMatrixBackground(ctx, canvas, drops, letters, fontSize);
};

/**
 * Loops the matrix background animation, continuously drawing new letters on the canvas.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {HTMLCanvasElement} canvas - The canvas element on which to draw the animation.
 * @param {Array<number>} drops - An array representing the positions of the drops.
 * @param {Array<string>} letters - An array of letters to be drawn in the animation.
 * @param {number} fontSize - The font size for the letters in the animation.
 * @returns {number} - The interval ID for the animation loop.
 */
const loopMatrixBackground = (ctx, canvas, drops, letters, fontSize) => {
  return setInterval(() => {
    ctx.fillStyle = 'rgba(30, 30, 30, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drops.forEach((drop, i) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = '#044804';
      ctx.fillText(text, i * fontSize, drop * fontSize);
      drops[i]++;

      if (drops[i] * fontSize > canvas.height && Math.random() > .99) {
        drops[i] = 0;
      }
    });
  }, 25);
};

/**
 * Sets the height of the canvas element to match the maximum scroll height of the document.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element whose height is to be set.
 * @returns {void}
 */
const setCanvasHeight = canvas => {
  const height = Math.max(document.body.scrollHeight, document.documentElement.clientHeight);
  canvas.height = height;
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
const scrollIntoViewWithOffset = (targetElement, offset) => {
  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY  - offset;

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
function setupSkillsCarousel() {
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
