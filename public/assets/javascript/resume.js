/**
 * resume.js
 *
 * This file contains the frontend logic for managing and editing resume data.
 * It handles fetching, displaying, and updating resume details, work experiences, 
 * education entries, and projects. The script also manages UI interactions such as
 * dragging to resize panels, form submissions, and updating previews.
 *
 * Key functionalities:
 * - Fetch and display resume data, work experiences, educations, and projects.
 * - Manage form submissions for saving or updating resume data, work experiences, educations, and projects.
 * - Handle UI interactions like panel resizing, input validation, and updating previews.
 * - Generate PDF from the resume preview.
  * @deprecated Legacy resume/CV implementation.
 */

const divider = document.querySelector('.divider');
let isDragging = false;

document.addEventListener('DOMContentLoaded', function() {
    setInitialWidths();
    fetchResumeData();
    fetchWorkExperiences();
    fetchEducations();
    fetchProjects();
    addEventListeners();
    initializeSortable();
    setStartingDates();
});

/**
 * Converts a date string into a format suitable for input elements (YYYY-MM-DD).
 * 
 * @param {string} date - The date string to convert.
 * @returns {string} - The formatted date string.
  * @deprecated Legacy resume/CV implementation.
 */
function getInputDate(date) {
    const now = new Date(date);
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + month + "-" + day;
}

/**
 * Sets the initial widths of the left and right panels based on saved values in localStorage.
 * If no saved values are found, the panels are set to equal widths.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function setInitialWidths() {
    const container = divider.parentNode;
    const leftPanel = container.querySelector('.left');
    const rightPanel = container.querySelector('.right');
    const savedLeftWidth = localStorage.getItem('leftPanelWidth');
    const savedRightWidth = localStorage.getItem('rightPanelWidth');
    const containerWidth = container.clientWidth;

    if (savedLeftWidth && savedRightWidth) {
        leftPanel.style.width = savedLeftWidth;
        rightPanel.style.width = savedRightWidth;
    } else {
        const middleWidth = containerWidth / 2;
        leftPanel.style.width = middleWidth + 'px';
        rightPanel.style.width = middleWidth + 'px';
    }
}

/**
 * Adds event listeners for various user interactions, including panel resizing, form submissions, 
 * button clicks, and input changes.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function addEventListeners() {
    divider.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const container = divider.parentNode;
        const leftPanel = container.querySelector('.left');
        const rightPanel = container.querySelector('.right');
        let newLeftWidth = e.clientX - container.offsetLeft;
        if (newLeftWidth > 100 && newLeftWidth < container.clientWidth - 100) {
            leftPanel.style.width = newLeftWidth + 'px';
            rightPanel.style.width = (container.clientWidth - newLeftWidth) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            const container = divider.parentNode;
            const leftPanel = container.querySelector('.left');
            const rightPanel = container.querySelector('.right');
            localStorage.setItem('leftPanelWidth', leftPanel.style.width);
            localStorage.setItem('rightPanelWidth', rightPanel.style.width);
        }
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // Event listeners for resume, work experience, education, and project forms and buttons
    document.getElementById('saveResume').addEventListener('click', saveOrUpdateResume);
    document.getElementById('addWorkExperienceButton').addEventListener('click', saveOrUpdateWorkExperience);
    document.getElementById('resetWorkExperienceButton').addEventListener('click', () => {
        const id = document.getElementById('workExperienceId').value;
        editWorkExperience(id);
    });
    document.getElementById('cancelWorkExperienceButton').addEventListener('click', () => {
        clearFields('work');
        document.getElementById('workExperienceId').value = '';
        resetWorkExperienceButtons();
    });
    document.getElementById('updateWorkExperienceButton').addEventListener('click', saveOrUpdateWorkExperience);
    document.getElementById('addEducationButton').addEventListener('click', saveOrUpdateEducation);
    document.getElementById('resetEducationButton').addEventListener('click', () => {
        const id = document.getElementById('educationId').value;
        editEducation(id);
    });
    document.getElementById('cancelEducationButton').addEventListener('click', () => {
        clearFields('education');
        document.getElementById('educationId').value = '';
        resetEducationButtons();
    });
    document.getElementById('updateEducationButton').addEventListener('click', saveOrUpdateEducation);
    document.getElementById('addProjectButton').addEventListener('click', saveOrUpdateProject);
    document.getElementById('resetProjectButton').addEventListener('click', () => {
        const id = document.getElementById('projectId').value;
        editProject(id);
    });
    document.getElementById('cancelProjectButton').addEventListener('click', () => {
        clearFields('project');
        document.getElementById('projectId').value = '';
        resetProjectButtons();
    });
    document.getElementById('updateProjectButton').addEventListener('click', saveOrUpdateProject);

    // Event listeners for dynamic date fields
    document.getElementById('stillWorking').addEventListener('change', toggleJobEndDate);
    document.getElementById('stillStudying').addEventListener('change', toggleEducationEndDate);
    document.getElementById('jobBeginDate').addEventListener('change', validateJobDates);
    document.getElementById('jobEndDate').addEventListener('change', validateJobDates);
    document.getElementById('educationFrom').addEventListener('change', validateEducationDates);
    document.getElementById('educationUntil').addEventListener('change', validateEducationDates);

    // Event listeners for resume preview updates
    document.getElementById('firstName').addEventListener('input', updatePreview);
    document.getElementById('lastName').addEventListener('input', updatePreview);
    document.getElementById('town').addEventListener('input', updatePreview);
    document.getElementById('country').addEventListener('input', updatePreview);
    document.getElementById('email').addEventListener('input', updatePreview);
    document.getElementById('linkedin').addEventListener('input', updatePreview);
    document.getElementById('github').addEventListener('input', updatePreview);
    document.getElementById('website').addEventListener('input', updatePreview);
    document.getElementById('skills').addEventListener('input', updatePreview);
    document.getElementById('languages').addEventListener('input', updatePreview);
    document.getElementById('interests').addEventListener('input', updatePreview);
}

/**
 * Fetches and displays the main resume data (e.g., name, contact info).
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function fetchResumeData() {
    try {
        const data = await fetchData('/api/resume');
        document.getElementById('firstName').value = data.first_name || '';
        document.getElementById('lastName').value = data.last_name || '';
        document.getElementById('town').value = data.town || '';
        document.getElementById('country').value = data.country || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('linkedin').value = data.linkedin || '';
        document.getElementById('github').value = data.github || '';
        document.getElementById('website').value = data.website || '';
        document.getElementById('skills').value = data.skills || '';
        document.getElementById('languages').value = data.languages || '';
        document.getElementById('interests').value = data.interests || '';
        let sectionOrder = data.settings ? data.settings["sectionOrder"] : null
        updatePreview(null, sectionOrder);
    } catch (error) {
        console.warn(error.message);
        clearResumeFields();
    }
}

/**
 * Updates the resume preview section with the latest input values.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function updatePreview(event=null, sectionOrder=null) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const town = document.getElementById('town').value;
    const country = document.getElementById('country').value;
    const email = document.getElementById('email').value;
    const linkedin = document.getElementById('linkedin').value;
    const github = document.getElementById('github').value;
    const website = document.getElementById('website').value;
    const skills = document.getElementById('skills').value;
    const languages = document.getElementById('languages').value;
    const interests = document.getElementById('interests').value;

    if(sectionOrder){
        orderElements('cvPreview', sectionOrder.split(','));
    }

    if (!interests && !interests.replace(/ /g,'')){
        let toRemove = document.getElementById("interestsContainer");
        if(toRemove) document.getElementById("interestsContainer").remove();
    }else{
        let container = document.getElementById("interestsContainer");
        if(!container){
            //Create the container
            const interestsContainer = document.createElement('div');
            interestsContainer.id = 'interestsContainer';
            const heading = document.createElement('h2');
            heading.textContent = 'Interests';
            const ul = document.createElement('ul');
            ul.id = 'previewInterests';
            ul.textContent = 'Your skills and interests will be shown here.';
            interestsContainer.appendChild(heading);
            interestsContainer.appendChild(ul);

            //Add it to the 'others' div
            let others = document.getElementById("others");
            others.appendChild(interestsContainer);
        }
    }

    document.getElementById('previewName').textContent = `${firstName} ${lastName}`;

    const contactInfo = [];
    if (town && country) contactInfo.push(`${town}, ${country}`);
    if (email) contactInfo.push(`<a href="mailto:${email}"><div><img src="/assets/images/icons/cv/gmail.webp" class="icon" alt="Email Icon" />${email} </div></a>`);
    if (linkedin) contactInfo.push(`<a href="${linkedin}" target="_blank"><div><img src="/assets/images/icons/cv/linkedin.webp" class="icon" alt="LinkedIn Icon" />${createDisplayName(linkedin)} </div></a>`);
    if (github) contactInfo.push(`<a href="${github}" target="_blank"><div><img src="/assets/images/icons/cv/github.webp" class="icon" alt="GitHub Icon" />${createDisplayName(github)} </div></a>`);
    if (website) contactInfo.push(`<a href="${website}" target="_blank"><div><img src="/assets/images/logo.webp" class="icon" alt="Website Icon" />${createDisplayName(website)} </div></a>`);

    document.getElementById('previewContact').innerHTML = contactInfo.join(' | ');
    document.getElementById('previewSkills').innerHTML = formatList(skills);
    document.getElementById('previewLanguages').innerHTML = formatList(languages);
    if(interests) document.getElementById('previewInterests').innerHTML = formatList(interests);
}

/**
 * Creates a short display label from a URL.
 *
 * @param {string} url - The URL to transform into a display label.
 * @returns {string} - The display label extracted from the URL.
 * @deprecated Legacy resume/CV implementation.
 */
function createDisplayName(url) {
    if (!url) return '';
    const displayText = url.split('/').pop();
    return displayText;
  }

/**
 * Clears all input fields related to the resume data.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function clearResumeFields() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('town').value = '';
    document.getElementById('country').value = '';
    document.getElementById('email').value = '';
    document.getElementById('linkedin').value = '';
    document.getElementById('github').value = '';
    document.getElementById('website').value = '';
    document.getElementById('skills').value = '';
    document.getElementById('languages').value = '';
    document.getElementById('interests').value = '';
    updatePreview();
}

/**
 * Saves or updates the main resume data on the server.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function saveOrUpdateResume() {
    const requiredFields = ['firstName', 'lastName', 'town', 'country', 'email', 'languages', 'skills'];
    const dbFields = ['first_name', 'last_name', 'town', 'country', 'email', 'languages', 'skills'];

    const resumeData = {};

    for (let i = 0; i < requiredFields.length; i++) {
        const value = document.getElementById(requiredFields[i]).value.trim();
        if (!value) {
            alert(`${requiredFields[i].replace(/([A-Z])/g, ' $1')} is required.`);
            return;
        }
        resumeData[dbFields[i]] = value;
    }

    resumeData.linkedin = document.getElementById('linkedin').value;
    resumeData.github = document.getElementById('github').value;
    resumeData.website = document.getElementById('website').value;
    resumeData.interests = document.getElementById('interests').value;

    let jsonData = {};
    jsonData["sectionOrder"] = sessionStorage.getItem("sectionOrder");
    resumeData.settings = jsonData;

    try {
        const data = await postData('/api/resume/save', resumeData);
        alert(data.message);
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Fetches and displays the work experiences associated with the resume.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function fetchWorkExperiences() {
    try {
        const data = await fetchData('/api/resume/work-experiences');
        data.sort((a, b) => new Date(a.job_begin_date) - new Date(b.job_begin_date));

        const list = document.getElementById('workExperienceList');
        list.innerHTML = '';
        if (data.length === 0) {
            const item = document.createElement('div');
            item.classList.add('no-work-experience');
            item.textContent = 'No work experiences available.';
            list.appendChild(item);
        } else {
            data.forEach(exp => {
                const item = document.createElement('div');
                item.classList.add('work-experience-item');
                item.innerHTML = `
                    <div>
                        <strong>${exp.job_title}</strong>
                        <span class="dates">${new Date(exp.job_begin_date).toDateString()} - ${exp.still_working ? 'Present' : new Date(exp.job_end_date).toDateString()}</span>
                    </div>
                    <div class="buttons">
                        <button onclick="editWorkExperience(${exp.id})">Edit</button>
                        <button onclick="deleteWorkExperience(${exp.id})">Delete</button>
                    </div>
                `;
                list.appendChild(item);
            });
        }
        updateWorkExperiencePreview();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Saves or updates a work experience entry associated with the resume.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function saveOrUpdateWorkExperience() {
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();
    const jobBeginDate = document.getElementById('jobBeginDate').value;
    const stillWorking = document.getElementById('stillWorking').checked;
    const jobEndDate = stillWorking ? null : document.getElementById('jobEndDate').value;

    if (!jobTitle || !jobDescription || !jobBeginDate || (!stillWorking && !jobEndDate)) {
        alert('All fields are required except Job End Date if still working is checked.');
        return;
    }

    const workExperienceData = {
        id: document.getElementById('workExperienceId').value,
        jobTitle,
        jobDescription,
        jobBeginDate,
        stillWorking,
        jobEndDate
    };

    try {
        const data = await postData('/api/resume/work-experience', workExperienceData);
        alert(data.message);
        fetchWorkExperiences();
        clearFields('work');
        resetWorkExperienceButtons();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Resets the work experience form buttons to their default states.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function resetWorkExperienceButtons() {
    document.getElementById('addWorkExperienceButton').style.display = 'inline-block';
    document.getElementById('updateWorkExperienceButton').style.display = 'none';
    document.getElementById('resetWorkExperienceButton').style.display = 'none';
    document.getElementById('cancelWorkExperienceButton').style.display = 'none';
}

/**
 * Loads a specific work experience entry into the form for editing.
 * 
 * @param {number} id - The ID of the work experience entry to edit.
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function editWorkExperience(id) {
    try {
        const data = await fetchData(`/api/resume/work-experience/${id}`);
        document.getElementById('workExperienceId').value = data.id;
        document.getElementById('jobTitle').value = data.job_title;
        document.getElementById('jobDescription').value = data.job_description;
        document.getElementById('jobBeginDate').value = getInputDate(data.job_begin_date);
        document.getElementById('stillWorking').checked = data.still_working;
        document.getElementById('jobEndDate').value = getInputDate(data.job_end_date);
        toggleJobEndDate.call(document.getElementById('stillWorking'));
        document.getElementById('addWorkExperienceButton').style.display = 'none';
        document.getElementById('updateWorkExperienceButton').style.display = 'inline-block';
        document.getElementById('resetWorkExperienceButton').style.display = 'inline-block';
        document.getElementById('cancelWorkExperienceButton').style.display = 'inline-block';
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Deletes a specific work experience entry associated with the resume.
 * 
 * @param {number} id - The ID of the work experience entry to delete.
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function deleteWorkExperience(id) {
    try {
        const data = await deleteData('/api/resume/work-experience', { id });
        alert(data.message);
        fetchWorkExperiences();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Fetches and displays the education entries associated with the resume.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function fetchEducations() {
    try {
        const data = await fetchData('/api/resume/educations');
        data.sort((a, b) => new Date(a.from_date) - new Date(b.from_date));

        const list = document.getElementById('educationList');
        list.innerHTML = '';
        if (data.length === 0) {
            const item = document.createElement('div');
            item.classList.add('no-education');
            item.textContent = 'No educations available.';
            list.appendChild(item);
        } else {
            data.forEach(edu => {
                const item = document.createElement('div');
                item.classList.add('education-item');
                item.innerHTML = `
                    <div>
                        <strong>${edu.name}</strong>
                        <span class="dates">${new Date(edu.from_date).toDateString()} - ${edu.still_studying ? 'Present' : new Date(edu.until_date).toDateString()}</span>
                    </div>
                    <div class="buttons">
                        <button onclick="editEducation(${edu.id})">Edit</button>
                        <button onclick="deleteEducation(${edu.id})">Delete</button>
                    </div>
                `;
                list.appendChild(item);
            });
        }
        updateEducationPreview();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Saves or updates an education entry associated with the resume.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function saveOrUpdateEducation() {
    const name = document.getElementById('educationName').value.trim();
    const description = document.getElementById('educationDescription').value.trim();
    const fromDate = document.getElementById('educationFrom').value;
    const stillStudying = document.getElementById('stillStudying').checked;
    const untilDate = stillStudying ? null : document.getElementById('educationUntil').value;

    if (!name || !description || !fromDate || (!stillStudying && !untilDate)) {
        alert('All fields are required except Until Date if still studying is checked.');
        return;
    }

    const educationData = {
        id: document.getElementById('educationId').value,
        name,
        description,
        fromDate,
        stillStudying,
        untilDate
    };

    try {
        const data = await postData('/api/resume/education', educationData);
        alert(data.message);
        fetchEducations();
        clearFields('education');
        resetEducationButtons();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Resets the education form buttons to their default states.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function resetEducationButtons() {
    document.getElementById('addEducationButton').style.display = 'inline-block';
    document.getElementById('updateEducationButton').style.display = 'none';
    document.getElementById('resetEducationButton').style.display = 'none';
    document.getElementById('cancelEducationButton').style.display = 'none';
}

/**
 * Loads a specific education entry into the form for editing.
 * 
 * @param {number} id - The ID of the education entry to edit.
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function editEducation(id) {
    try {
        const data = await fetchData(`/api/resume/education/${id}`);
        document.getElementById('educationId').value = data.id;
        document.getElementById('educationName').value = data.name;
        document.getElementById('educationDescription').value = data.description;
        document.getElementById('educationFrom').value = getInputDate(data.from_date);
        document.getElementById('stillStudying').checked = data.still_studying;
        document.getElementById('educationUntil').value = getInputDate(data.until_date);
        toggleEducationEndDate.call(document.getElementById('stillStudying'));
        document.getElementById('addEducationButton').style.display = 'none';
        document.getElementById('updateEducationButton').style.display = 'inline-block';
        document.getElementById('resetEducationButton').style.display = 'inline-block';
        document.getElementById('cancelEducationButton').style.display = 'inline-block';
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Deletes a specific education entry associated with the resume.
 * 
 * @param {number} id - The ID of the education entry to delete.
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function deleteEducation(id) {
    try {
        const data = await deleteData('/api/resume/education', { id });
        alert(data.message);
        fetchEducations();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Fetches and displays the projects associated with the resume.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function fetchProjects() {
    try {
        const data = await fetchData('/api/resume/projects');
        const list = document.getElementById('projectList');
        list.innerHTML = '';
        if (data.length === 0) {
            const item = document.createElement('div');
            item.classList.add('no-projects');
            item.textContent = 'No projects available.';
            list.appendChild(item);
        } else {
            data.forEach(proj => {
                const item = document.createElement('div');
                item.classList.add('project-item');
                item.innerHTML = `
                    <div>
                        <strong>${proj.name}</strong>
                    </div>
                    <div class="buttons">
                        <button onclick="editProject(${proj.id})">Edit</button>
                        <button onclick="deleteProject(${proj.id})">Delete</button>
                    </div>
                `;
                list.appendChild(item);
            });
        }
        updateProjectsPreview();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Saves or updates a project entry associated with the resume.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function saveOrUpdateProject() {
    const name = document.getElementById('projectName').value.trim();
    const description = document.getElementById('projectDescription').value.trim();

    if (!name || !description) {
        alert('All fields are required.');
        return;
    }

    const projectData = {
        id: document.getElementById('projectId').value,
        name,
        description
    };

    try {
        const data = await postData('/api/resume/project', projectData);
        alert(data.message);
        fetchProjects();
        clearFields('project');
        resetProjectButtons();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Resets the project form buttons to their default states.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function resetProjectButtons() {
    document.getElementById('addProjectButton').style.display = 'inline-block';
    document.getElementById('updateProjectButton').style.display = 'none';
    document.getElementById('resetProjectButton').style.display = 'none';
    document.getElementById('cancelProjectButton').style.display = 'none';
}

/**
 * Loads a specific project entry into the form for editing.
 * 
 * @param {number} id - The ID of the project entry to edit.
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function editProject(id) {
    try {
        const data = await fetchData(`/api/resume/project/${id}`);
        document.getElementById('projectId').value = data.id;
        document.getElementById('projectName').value = data.name;
        document.getElementById('projectDescription').value = data.description;
        document.getElementById('addProjectButton').style.display = 'none';
        document.getElementById('updateProjectButton').style.display = 'inline-block';
        document.getElementById('resetProjectButton').style.display = 'inline-block';
        document.getElementById('cancelProjectButton').style.display = 'inline-block';
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Deletes a specific project entry associated with the resume.
 * 
 * @param {number} id - The ID of the project entry to delete.
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function deleteProject(id) {
    try {
        const data = await deleteData('/api/resume/project', { id });
        alert(data.message);
        fetchProjects();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Toggles the enabled/disabled state of the job end date field based on the 'Still Working' checkbox.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function toggleJobEndDate() {
    const jobEndDate = document.getElementById('jobEndDate');
    jobEndDate.disabled = this.checked;
    if (this.checked) {
        jobEndDate.value = '';
    }
    validateJobDates();
}

/**
 * Toggles the enabled/disabled state of the education end date field based on the 'Still Studying' checkbox.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function toggleEducationEndDate() {
    const educationUntil = document.getElementById('educationUntil');
    educationUntil.disabled = this.checked;
    if (this.checked) {
        educationUntil.value = '';
    }
    validateEducationDates();
}

/**
 * Initializes all the date inputs to have the maximum date until today.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function setStartingDates(){
    document.getElementById('jobBeginDate').max = new Date().toISOString().split('T')[0];
    document.getElementById('jobEndDate').max = new Date().toISOString().split('T')[0];
    document.getElementById('educationFrom').max = new Date().toISOString().split('T')[0];
    document.getElementById('educationUntil').max = new Date().toISOString().split('T')[0];
}

/**
 * Sets the minimum date of the job end date input to the selected job begin date input. 
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function validateJobDates() {
    document.getElementById('jobEndDate').min = document.getElementById('jobBeginDate').value;
}

/**
 * Sets the minimum date of the education until date input to the selected education from date input. 
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function validateEducationDates() {    
    document.getElementById('educationUntil').min = document.getElementById('educationFrom').value;
}

/**
 * Clears input fields for a specific section (work, education, or project).
 * 
 * @param {string} section - The section to clear ('work', 'education', or 'project').
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
function clearFields(section) {
    if (section === 'work') {
        document.getElementById('jobTitle').value = '';
        document.getElementById('jobDescription').value = '';
        document.getElementById('jobBeginDate').value = '';
        document.getElementById('stillWorking').checked = false;
        document.getElementById('jobEndDate').value = '';
        toggleJobEndDate.call(document.getElementById('stillWorking'));
    } else if (section === 'education') {
        document.getElementById('educationName').value = '';
        document.getElementById('educationDescription').value = '';
        document.getElementById('educationFrom').value = '';
        document.getElementById('stillStudying').checked = false;
        document.getElementById('educationUntil').value = '';
        toggleEducationEndDate.call(document.getElementById('stillStudying'));
    } else if (section === 'project') {
        document.getElementById('projectName').value = '';
        document.getElementById('projectDescription').value = '';
    }
}

/**
 * Updates the work experience preview section with the latest data.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function updateWorkExperiencePreview() {
    try {
        const data = await fetchData('/api/resume/work-experiences');
        data.sort((a, b) => new Date(a.job_begin_date) - new Date(b.job_begin_date));

        const previewExperience = document.getElementById('previewExperience');
        previewExperience.innerHTML = '';
        data.forEach(exp => {
            const item = document.createElement('div');
            item.classList.add('experience-item');
            const beginDate = new Date(exp.job_begin_date);
            const endDate = new Date(exp.job_end_date);
            const endDateString = exp.still_working ? 'Present' : `${endDate.toLocaleString('en-GB', { month: 'long' })}, ${endDate.getFullYear()}`;
            const [mainTitle, subTitle] = splitTitle(exp.job_title);
            item.innerHTML = `
                <div>
                    <strong class="title-main">${mainTitle}</strong><span class="title-sub">${subTitle}</span>
                    <span class="dates">${beginDate.toLocaleString('en-GB', { month: 'long' }) }, ${beginDate.getFullYear()}  - ${endDateString}</span>
                </div>
                <ul>${formatList(exp.job_description)}</ul>
            `;
            previewExperience.appendChild(item);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Updates the education preview section with the latest data.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function updateEducationPreview() {
    try {
        const data = await fetchData('/api/resume/educations');
        data.sort((a, b) => new Date(a.from_date) - new Date(b.from_date));

        const previewEducation = document.getElementById('previewEducation');
        previewEducation.innerHTML = '';
        data.forEach(edu => {
            const item = document.createElement('div');
            item.classList.add('education-item');

            const [mainTitle, subTitle] = splitTitle(edu.name);
            const fromDate = new Date(edu.from_date);
            const endDate = new Date(edu.until_date);
            const untilDate = edu.still_studying ? 'Present' : `${endDate.toLocaleString('en-GB', { month: 'long' })}, ${endDate.getFullYear()}`;

            item.innerHTML = `
                <div>
                    <strong class="title-main">${mainTitle}</strong><span class="title-sub">${subTitle}</span>
                    <span class="dates">${fromDate.toLocaleString('en-GB', { month: 'long' })}, ${fromDate.getFullYear()} - ${untilDate}</span>
                </div>
                <ul>${formatList(edu.description)}</ul>
            `;
            previewEducation.appendChild(item);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Updates the projects preview section with the latest data.
 * 
 * @returns {Promise<void>}
  * @deprecated Legacy resume/CV implementation.
 */
async function updateProjectsPreview() {
    try {
        const data = await fetchData('/api/resume/projects');
        const previewProjects = document.getElementById('previewProjects');
        previewProjects.innerHTML = '';
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
            previewProjects.appendChild(item);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Event listener for downloading the resume as a PDF.
 * 
 * @returns {void}
  * @deprecated Legacy resume/CV implementation.
 */
document.getElementById('downloadPDF').addEventListener('click', function () {
    const element = document.getElementById('cvPreview');
    const opt = {
        margin: 5,
        filename: 'StanimirMonevResume.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});

/**
 * Initializes sortable behavior for the CV preview sections.
 *
 * @returns {void}
 * @deprecated Legacy resume/CV implementation.
 */
function initializeSortable(){
    var cvPreview = document.getElementById('cvPreview');
    Sortable.create(cvPreview, {
        animation: 150,
        handle: '.cv-section h2',
        onEnd: function (evt) {
            var sectionOrder = Array.from(cvPreview.children).map(section => section.id);
            sessionStorage.setItem("sectionOrder", sectionOrder);
        }
    });
}
