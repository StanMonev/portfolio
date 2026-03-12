(() => {
// === Config / Selectors ======================================================
const IDS = {
  downloadBtnDesktop: 'downloadButtonDesktop',
  downloadBtnMobile: 'downloadButtonMobile',
  resumeContainer: 'resumeContainer'
};

const RESUME_TEMPLATE_PATHS = {
  en: '/assets/resume/resume-en.html',
  de: '/assets/resume/resume-de.html',
  bg: '/assets/resume/resume-bg.html'
};

const RESUME_FILENAMES = {
  en: 'StanimirMonev-CV-en.pdf',
  de: 'StanimirMonev-CV-de.pdf',
  bg: 'StanimirMonev-CV-bg.pdf'
};

const PDF_OPTIONS_BASE = {
  margin: 5,
  image: { type: 'jpeg', quality: 1 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

let isDownloading = false;

// === Boot ====================================================================
document.addEventListener('DOMContentLoaded', initResumeDownload);

/**
 * Initializes click handling for desktop/mobile download buttons.
 * @deprecated Legacy resume/CV implementation.
 */
function initResumeDownload() {
  const buttons = getDownloadButtons();

  if (!buttons.length) {
    console.warn(`[resume] Missing #${IDS.downloadBtnDesktop} and #${IDS.downloadBtnMobile}`);
    return;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleDownload(buttons);
    });
  });

  // Warm the template for initial language to make first click faster.
  prepareResumeTemplate(getActiveLanguage())
    .then(() => hideResumeExportContainer())
    .catch(error => {
      console.error('[resume] template preload failed:', error);
    });

  window.addEventListener('languageChanged', event => {
    const language = normalizeLanguage(event?.detail?.language || getActiveLanguage());
    prepareResumeTemplate(language)
      .then(() => hideResumeExportContainer())
      .catch(error => {
        console.error('[resume] template switch failed:', error);
      });
  });
}

/**
 * Handles the export flow and generates a language-specific PDF.
 * @param {HTMLElement[]} buttons
 * @deprecated Legacy resume/CV implementation.
 */
async function handleDownload(buttons) {
  if (isDownloading) return;

  isDownloading = true;
  setLoadingState(buttons, true);

  const cleanupWatermark = attachWatermarkStyle();
  try {
    const language = getActiveLanguage();
    const cvPreview = await prepareResumeTemplate(language);
    await waitForImages(cvPreview);

    const pdfOptions = {
      ...PDF_OPTIONS_BASE,
      filename: getResumeFilename(language)
    };

    await html2pdf().set(pdfOptions).from(cvPreview).save();
  } catch (error) {
    console.error('[resume] PDF generation failed:', error);
  } finally {
    cleanupWatermark();
    hideResumeExportContainer();
    setLoadingState(buttons, false);
    isDownloading = false;
  }
}

/**
 * Loads the selected language template into #resumeContainer.
 * @param {string} language
 * @returns {Promise<HTMLElement>}
 * @deprecated Legacy resume/CV implementation.
 */
async function prepareResumeTemplate(language) {
  const normalizedLanguage = normalizeLanguage(language);
  const container = document.getElementById(IDS.resumeContainer);

  if (!container) {
    throw new Error(`[resume] Missing #${IDS.resumeContainer}`);
  }

  const hasCurrentTemplate =
    container.dataset.resumeLanguage === normalizedLanguage &&
    !!container.querySelector('#cvPreview');

  if (!hasCurrentTemplate) {
    const templatePath = RESUME_TEMPLATE_PATHS[normalizedLanguage] || RESUME_TEMPLATE_PATHS.en;
    const response = await fetch(templatePath, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load resume template: ${templatePath} (${response.status})`);
    }

    container.innerHTML = await response.text();
    container.dataset.resumeLanguage = normalizedLanguage;
  }

  container.classList.add('resume-export-ready');

  const cvPreview = container.querySelector('#cvPreview');
  if (!cvPreview) {
    throw new Error('[resume] Template is missing #cvPreview');
  }

  return cvPreview;
}

/**
 * Hides the export container after PDF generation.
 * @deprecated Legacy resume/CV implementation.
 */
function hideResumeExportContainer() {
  const container = document.getElementById(IDS.resumeContainer);
  if (!container) return;
  container.classList.remove('resume-export-ready');
}

/**
 * Gets both desktop and mobile resume download buttons.
 * @returns {HTMLElement[]}
 * @deprecated Legacy resume/CV implementation.
 */
function getDownloadButtons() {
  return [
    document.getElementById(IDS.downloadBtnDesktop),
    document.getElementById(IDS.downloadBtnMobile)
  ].filter(Boolean);
}

/**
 * Toggles loading state on all download buttons.
 * @param {HTMLElement[]} buttons
 * @param {boolean} isLoading
 * @deprecated Legacy resume/CV implementation.
 */
function setLoadingState(buttons, isLoading) {
  const downloadingText = getDownloadingText();

  buttons.forEach(button => {
    button.disabled = isLoading;
    button.setAttribute('aria-busy', String(isLoading));
    button.setAttribute('aria-disabled', String(isLoading));
    button.classList.toggle('is-loading', isLoading);

    const label = button.querySelector('.grow') || button.querySelector('span[data-translate]') || button.querySelector('span');
    if (!label) return;

    if (!button.dataset.originalLabel) {
      button.dataset.originalLabel = label.textContent.trim();
    }

    label.textContent = isLoading ? downloadingText : button.dataset.originalLabel;
  });

  if (!isLoading) {
    window.translationService?.translatePage?.();
  }
}

/**
 * Returns translated loading text.
 * @returns {string}
 * @deprecated Legacy resume/CV implementation.
 */
function getDownloadingText() {
  return window.translationService?.t?.('about.downloading', 'Downloading...') || 'Downloading...';
}

/**
 * Resolves the active UI language.
 * @returns {string}
 * @deprecated Legacy resume/CV implementation.
 */
function getActiveLanguage() {
  const lang = window.translationService?.getCurrentLanguage?.()
    || localStorage.getItem('selectedLanguage')
    || localStorage.getItem('language')
    || document.documentElement.lang
    || 'en';

  return normalizeLanguage(lang);
}

/**
 * Normalizes language values like de-DE/bg-BG to en/de/bg.
 * @param {string} language
 * @returns {string}
 * @deprecated Legacy resume/CV implementation.
 */
function normalizeLanguage(language) {
  const code = String(language || 'en').toLowerCase();

  if (code.startsWith('de')) return 'de';
  if (code.startsWith('bg')) return 'bg';
  if (code.startsWith('en')) return 'en';

  return RESUME_TEMPLATE_PATHS[code] ? code : 'en';
}

/**
 * Returns language-specific PDF filename.
 * @param {string} language
 * @returns {string}
 * @deprecated Legacy resume/CV implementation.
 */
function getResumeFilename(language) {
  const normalizedLanguage = normalizeLanguage(language);
  return RESUME_FILENAMES[normalizedLanguage] || RESUME_FILENAMES.en;
}

/**
 * Waits for image assets in the resume preview to finish loading.
 * @param {HTMLElement} root
 * @returns {Promise<void>}
 * @deprecated Legacy resume/CV implementation.
 */
async function waitForImages(root) {
  if (!root) return;

  const images = Array.from(root.querySelectorAll('img'));
  if (!images.length) return;

  await Promise.all(images.map(image => {
    if (image.complete) return Promise.resolve();

    return new Promise(resolve => {
      const done = () => resolve();
      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    });
  }));
}

/**
 * Injects a transient stylesheet that adds watermark only during export.
 * @returns {() => void}
 * @deprecated Legacy resume/CV implementation.
 */
function attachWatermarkStyle() {
  const style = document.createElement('style');
  style.setAttribute('data-watermark-style', 'true');
  style.textContent = `
    #resumeContainer.resume-export-ready .watermark {
      position: relative;
    }

    #resumeContainer.resume-export-ready .watermark::before {
      content: 'Copyright of Stanimir Monev';
      font-size: 50px;
      color: rgba(0, 0, 0, 0.1);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-45deg);
      display: grid;
      place-items: center;
      pointer-events: none;
    }
  `;

  document.head.appendChild(style);

  return () => {
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  };
}
})();

