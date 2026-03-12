/**
 * typewriter.js
 *
 * This script handles the typewriter animation effect for displaying rotating text on a webpage.
 * The text rotates through an array of strings, simulating typing and deleting each string one by one.
 * It can be used to highlight different skills or topics dynamically on a webpage.
 *
 * Key functionalities:
 * - Typewriter effect with typing and deleting animation.
 * - Ability to handle custom text provided via the `data-type` attribute or fallback to default text.
 * - Translation support that updates when language changes.
 */

let typewriterInstances = [];
let typewriterStarted = false;
const TYPEWRITER_FALLBACK_TEXTS = [
  "Backend Development",
  "Frontend Development",
  "App Development",
  "Game Development",
  "Artificial Intelligence"
];

/**
 * @param {HTMLElement} el - The HTML element where the typewriter effect will be applied.
 * @param {Array} toRotate - The array of strings that will be rotated through in the typewriter effect.
 * @param {number} period - The period (in ms) between switching to the next string in the array.
 */
var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.isDeleting = false;
  this.timeoutId = null;
  this.tick();
};

/**
 * Handles the main logic for typing and deleting text.
 * It adjusts the typing speed, handles the deletion process, and schedules the next tick.
 */
TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 200 - Math.random() * 100;  // Random typing speed to simulate human typing

  if (this.isDeleting) {
    delta /= 2;  // Speed up deleting
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;  // Pause after full text is typed out
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;  // Start typing the next string
    this.loopNum++;
    delta = 500;  // Small pause before starting the next word
  }

  this.timeoutId = setTimeout(function () {
    that.tick();
  }, delta);
};

/**
 * Updates the typewriter with new text array
 */
TxtType.prototype.updateText = function(newTextArray) {
  this.toRotate = newTextArray;
  // Reset to start fresh with new text
  this.loopNum = 0;
  this.txt = "";
  this.isDeleting = false;
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
  this.tick();
};

/**
 * Stops the typewriter animation
 */
TxtType.prototype.stop = function() {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
};

/**
 * Initializes the typewriter effect on elements with the class "typewriter".
 * It reads the `data-type` attribute to get the custom text strings if provided, otherwise uses the default text array.
 * 
 * @returns {void}
 */
function startTypewriter() {
  if (typewriterStarted) return;
  typewriterStarted = true;

  var elements = document.getElementsByClassName("typewriter");
  for (var i = 0; i < elements.length; i++) {
    let translationKeys = elements[i].getAttribute('data-type');
    let toRotate = getTranslatedTexts(translationKeys);
    var period = 2000;
    if (toRotate && toRotate.length > 0) {
      const instance = new TxtType(elements[i], toRotate, period);
      typewriterInstances.push({
        element: elements[i],
        instance: instance,
        translationKeys: translationKeys
      });
    }
  }
}

/**
 * Gets translated texts from translation keys
 */
function getTranslatedTexts(translationKeys) {
  if (!translationKeys) return TYPEWRITER_FALLBACK_TEXTS;
  
  try {
    const keys = JSON.parse(translationKeys);
    if (window.translationService) {
      return keys.map((key, index) => {
        const translated = window.translationService.t(key, key);
        return translated === key ? TYPEWRITER_FALLBACK_TEXTS[index] || key : translated;
      });
    } else {
      // Fallback texts if translation service is not available
      return TYPEWRITER_FALLBACK_TEXTS;
    }
  } catch (e) {
    return TYPEWRITER_FALLBACK_TEXTS;
  }
}

/**
 * Updates all typewriter instances when language changes
 */
function updateTypewriterLanguage() {
  typewriterInstances.forEach(item => {
    const newTexts = getTranslatedTexts(item.translationKeys);
    item.instance.updateText(newTexts);
  });
}

/**
 * Listen for language change events
 */
window.addEventListener('languageChanged', function(e) {
  updateTypewriterLanguage();
});

/**
 * Initializes typewriter when translations are ready (or immediately as fallback).
 */
function initializeTypewriter() {
  const readyPromise = window.translationServiceReadyPromise;

  if (readyPromise && typeof readyPromise.then === 'function') {
    readyPromise
      .catch(() => null)
      .finally(() => startTypewriter());
    return;
  }

  if (window.translationService) {
    const fallbackTimer = setTimeout(() => {
      if (!typewriterStarted) startTypewriter();
    }, 1500);

    window.addEventListener('translationsInitialized', () => {
      clearTimeout(fallbackTimer);
      if (!typewriterStarted) startTypewriter();
    }, { once: true });
    return;
  }

  startTypewriter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTypewriter);
} else {
  initializeTypewriter();
}

window.addEventListener('translationsInitialized', () => {
  if (!typewriterStarted) {
    startTypewriter();
  } else {
    updateTypewriterLanguage();
  }
});

/**
 * Checks if a given string is a valid JSON string.
 * 
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is valid JSON, false otherwise.
 */
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
