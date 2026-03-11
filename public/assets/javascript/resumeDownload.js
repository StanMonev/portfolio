// === Config / Selectors ======================================================
const IDS = {
  downloadBtnDesktop: 'downloadButtonDesktop',
  downloadBtnMobile: 'downloadButtonMobile',
  cvPreview: 'cvPreview',
  previewName: 'previewName',
  previewContact: 'previewContact',
  previewSkills: 'previewSkills',
  previewLanguages: 'previewLanguages',
  previewInterests: 'previewInterests',
  previewEducation: 'previewEducation',
  previewProjects: 'previewProjects',
  previewExperience: 'previewExperience'
};

const PDF_OPTIONS = {
  margin: 5,
  filename: 'StanimirMonevResume.pdf',
  image: { type: 'jpeg', quality: 1 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

// === Boot ====================================================================
document.addEventListener('DOMContentLoaded', addClickToDownloadButtons);

/**
 * Wire up the download button click -> update preview -> watermark -> pdf -> cleanup
  * @deprecated Legacy resume/CV implementation.
 */
function addClickToDownloadButtons() {
  const btns = [
    document.getElementById(IDS.downloadBtnDesktop), 
    document.getElementById(IDS.downloadBtnMobile)
  ];
  
  // Check if both buttons exist
  if (!btns[0] || !btns[1]) {
    console.warn(`[resume] Missing #${IDS.downloadBtnDesktop} or #${IDS.downloadBtnMobile}`);
    return;
  }

  // Add event listener to both buttons
  btns.forEach(btn => {
    if (!btn) return; // Extra safety check
    
    btn.addEventListener('click', async () => {
      // enter loading immediately
      setLoading(btn, true);

      // build the PDF with a temporary watermark style attached
      const cleanup = attachWatermarkStyle();
      try {
        await updatePreview(); // refresh data before export

        const container = document.getElementById(IDS.cvPreview);
        if (!container) {
          console.error(`[resume] Missing #${IDS.cvPreview}`);
          return;
        }

        await html2pdf().set(PDF_OPTIONS).from(container).save();
      } catch (err) {
        console.error('[resume] PDF generation failed:', err);
      } finally {
        cleanup();               // always remove temporary style
        setLoading(btn, false);  // always reset loading
      }
    });
  });
}

// === UI State ================================================================

/**
 * Toggle loading state for the neon button
 * @param {HTMLElement} btn
 * @param {boolean} isLoading
  * @deprecated Legacy resume/CV implementation.
 */
function setLoading(btn, isLoading) {
  if (!btn) return;
  const label = btn.querySelector('.label');
  const live  = btn.querySelector('.sr-only');

  btn.classList.toggle('is-loading', isLoading);
  btn.setAttribute('aria-busy', String(isLoading));
  btn.setAttribute('aria-disabled', String(isLoading));

  if (label) label.textContent = isLoading ? (label.dataset.loadingTranslate || 'Loading…')
                                           : (label.dataset.translate || 'Download');
  if (live)  live.textContent  = isLoading ? 'Downloading started' : '';
  window.translationService?.translatePage();
}

/**
 * Injects a transient stylesheet that adds the watermark. Returns a cleanup fn.
 * @returns {() => void}
  * @deprecated Legacy resume/CV implementation.
 */
function attachWatermarkStyle() {
  const style = document.createElement('style');
  style.setAttribute('data-watermark-style', 'true');
  style.textContent = `
    #about #resumeContainer {
      display: block !important;
    }
    .watermark {
      position: relative;
    }
    .watermark::before {
      content: 'Copyright of Stanimir Monev';
      font-size: 50px;
      color: rgba(0, 0, 0, 0.1);
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      transform: rotate(-45deg);
      display: grid;
      place-items: center;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  return () => {
    if (style.parentNode) style.parentNode.removeChild(style);
  };
}

// === Data Loading / Rendering ================================================

/**
 * Fetches the resume data and updates the preview sections.
 * Relies on fetchData, orderElements, formatList, splitTitle existing globally.
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function updatePreview() {
  try {
    const data = await fetchData('/api/resume/admin');
    if (!data) return;

    // order
    if (data.settings && data.settings['sectionOrder']) {
      const sectionOrder = data.settings['sectionOrder'].split(',');
      orderElements('cvPreview', sectionOrder);
    }

    // top info
    const nameEl = document.getElementById(IDS.previewName);
    if (nameEl) nameEl.textContent = `${data.first_name || ''} ${data.last_name || ''}`.trim();

    const contactEl = document.getElementById(IDS.previewContact);
    if (contactEl) contactEl.innerHTML = buildContactHTML({
      town: data.town,
      country: data.country,
      email: data.email,
      linkedin: data.linkedin,
      github: data.github,
      website: data.website
    });

    const skillsEl = document.getElementById(IDS.previewSkills);
    if (skillsEl) skillsEl.innerHTML = formatList(data.skills);

    const langEl = document.getElementById(IDS.previewLanguages);
    if (langEl) langEl.innerHTML = formatList(data.languages);

    const interestsEl = document.getElementById(IDS.previewInterests);
    if (interestsEl) interestsEl.innerHTML = formatList(data.interests);
  } catch (error) {
    console.error('[resume] updatePreview failed:', error);
  }

  // Update other sections even if the top block errored
  await updateEducationPreview();
  await updateProjectsPreview();
  await updateWorkExperiencePreview();
}

/**
 * Education section
  * @deprecated Legacy resume/CV implementation.
 */
async function updateEducationPreview() {
  try {
    const data = await fetchData('/api/resume/educations-admin');
    if (!Array.isArray(data)) return;

    // oldest -> newest (kept same as original)
    data.sort((a, b) => new Date(a.from_date) - new Date(b.from_date));

    const root = document.getElementById(IDS.previewEducation);
    if (!root) return;

    root.innerHTML = '';
    data.forEach(edu => {
      const item = document.createElement('div');
      item.classList.add('education-item');

      const [mainTitle, subTitle] = splitTitle(edu.name);
      const fromDate = new Date(edu.from_date);
      const endDate = new Date(edu.until_date);
      const untilDate = edu.still_studying
        ? 'Present'
        : `${fromDateLocale(endDate)}, ${endDate.getFullYear()}`;

      item.innerHTML = `
        <div>
          <strong class="title-main">${mainTitle}</strong><span class="title-sub">${subTitle}</span>
          <span class="dates">${fromDateLocale(fromDate)}, ${fromDate.getFullYear()} - ${untilDate}</span>
        </div>
        <ul>${formatList(edu.description)}</ul>
      `;
      root.appendChild(item);
    });
  } catch (error) {
    console.error('[resume] updateEducationPreview failed:', error);
  }
}

/**
 * Projects section
  * @deprecated Legacy resume/CV implementation.
 */
async function updateProjectsPreview() {
  try {
    const data = await fetchData('/api/resume/projects-admin');
    if (!Array.isArray(data)) return;

    const root = document.getElementById(IDS.previewProjects);
    if (!root) return;

    root.innerHTML = '';
    data.forEach(proj => {
      const item = document.createElement('div');
      item.classList.add('project-item');

      const [mainTitle, subTitle] = splitTitle(proj.name);
      item.innerHTML = `
        <div>
          <strong class="title-main">${mainTitle}</strong><span class="title-sub">${subTitle}</span>
        </div>
        <ul class="bullet-points">${formatList(proj.description)}</ul>
      `;
      root.appendChild(item);
    });
  } catch (error) {
    console.error('[resume] updateProjectsPreview failed:', error);
  }
}

/**
 * Work experience section
  * @deprecated Legacy resume/CV implementation.
 */
async function updateWorkExperiencePreview() {
  try {
    const data = await fetchData('/api/resume/work-experiences-admin');
    if (!Array.isArray(data)) return;

    // oldest -> newest (kept same as original)
    data.sort((a, b) => new Date(a.job_begin_date) - new Date(b.job_begin_date));

    const root = document.getElementById(IDS.previewExperience);
    if (!root) return;

    root.innerHTML = '';
    data.forEach(exp => {
      const item = document.createElement('div');
      item.classList.add('experience-item');

      const beginDate = new Date(exp.job_begin_date);
      const endDate = new Date(exp.job_end_date);
      const endDateString = exp.still_working
        ? 'Present'
        : `${fromDateLocale(endDate)}, ${endDate.getFullYear()}`;

      const [mainTitle, subTitle] = splitTitle(exp.job_title);
      item.innerHTML = `
        <div>
          <strong class="title-main">${mainTitle}</strong><span class="title-sub">${subTitle}</span>
          <span class="dates">${fromDateLocale(beginDate)}, ${beginDate.getFullYear()} - ${endDateString}</span>
        </div>
        <ul>${formatList(exp.job_description)}</ul>
      `;
      root.appendChild(item);
    });
  } catch (error) {
    console.error('[resume] updateWorkExperiencePreview failed:', error);
  }
}

// === Small helpers ============================================================

/**
 * Build contact HTML segments with icons. Matches your original output exactly.
 * @param {{town?:string,country?:string,email?:string,linkedin?:string,github?:string,website?:string}} info
  * @deprecated Legacy resume/CV implementation.
 */
function buildContactHTML(info) {
  const parts = [];
  if (info.town && info.country) parts.push(`${info.town}, ${info.country}`);
  if (info.email)    parts.push(`<a href="mailto:${info.email}"><img src="/assets/images/gmail.png" class="icon" alt="Email Icon" /> E-Mail</a>`);
  if (info.linkedin) parts.push(`<a href="${info.linkedin}" target="_blank"><img src="/assets/images/linkedin.png" class="icon" alt="LinkedIn Icon" /> LinkedIn</a>`);
  if (info.github)   parts.push(`<a href="${info.github}" target="_blank"><img src="/assets/images/github.png" class="icon" alt="GitHub Icon" /> GitHub</a>`);
  if (info.website)  parts.push(`<a href="${info.website}" target="_blank"><img src="/assets/images/smworks_logo_cropped.png" class="icon" alt="Website Icon" /> www.stanimirmonevworks.com</a>`);
  return parts.join(' | ');
}

/**
 * Month name in en-GB like your original usage
 * @deprecated Legacy resume/CV implementation.
 */
function fromDateLocale(d) {
  return d.toLocaleString('en-GB', { month: 'long' });
}
