/**
 * resumeController.js
 *
 * This file contains controller functions responsible for managing resume-related data,
 * including CRUD operations for resumes, work experiences, education entries, and projects.
 * The controller interacts with the resumeService to perform these operations and handle
 * both user-specific and admin-specific requests.
 *
 * Key functionalities:
 * - Save or update resume information for a user.
 * - Add, update, or delete work experiences, education entries, and projects.
 * - Retrieve resume information, work experiences, education entries, and projects for users and admins.
 *
 * This controller ensures that resume data is managed effectively and that requests are handled
 * securely and efficiently.
  * @deprecated Legacy resume/CV implementation.
 */

const resumeService = require('../services/resumeService');
const ADMIN_ID = 1;


/**
 * Saves or updates the resume information for the logged-in user.
 * 
 * @param {Object} req - The request object containing resume data in the body.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} - Sends a response with the status of the operation.
  * @deprecated Legacy resume/CV implementation.
 */
const saveOrUpdateResume = async (req, res) => {
  const userId = req.session.userId;
  const {
    first_name, last_name, town, country, email,
    linkedin, github, website, skills, languages, 
    interests, settings
  } = req.body;

  try {
    const fields = {
      first_name: first_name,
      last_name: last_name,
      town: town,
      country: country,
      email: email,
      linkedin: linkedin,
      github: github,
      website: website,
      skills: skills,
      interests: interests,
      languages: languages,
      settings: settings,
      user_id: userId
    };

    const resume = await resumeService.saveOrUpdateResume(userId, fields);
    res.status(200).send({ message: 'Resume saved successfully', resumeId: resume.id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to save resume' });
  }
};


/**
 * Adds or updates a work experience entry for the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing work experience data in the body.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} - Sends a response with the status of the operation.
  * @deprecated Legacy resume/CV implementation.
 */
const addOrUpdateWorkExperience = async (req, res) => {
  const userId = req.session.userId;
  const { id, jobTitle, jobDescription, jobBeginDate, stillWorking, jobEndDate } = req.body;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    if (!resume) return res.status(400).send({ message: 'Resume not found' });

    const fields = {
      job_title: jobTitle,
      job_description: jobDescription,
      job_begin_date: jobBeginDate,
      still_working: stillWorking,
      job_end_date: jobEndDate,
      resume_id: resume.id
    };

    const response = await resumeService.addOrUpdateWorkExperience(id, fields);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to add or update work experience' });
  }
};

/**
 * Deletes a work experience entry from the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing the work experience ID in the body.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} - Sends a response with the status of the operation.
  * @deprecated Legacy resume/CV implementation.
 */
const deleteWorkExperience = async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.body;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    if (!resume) return res.status(400).send({ message: 'Resume not found' });

    const response = await resumeService.deleteWorkExperience(id);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete work experience' });
  }
};

/**
 * Adds or updates an education entry for the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing education data in the body.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} - Sends a response with the status of the operation.
  * @deprecated Legacy resume/CV implementation.
 */
const addOrUpdateEducation = async (req, res) => {
  const userId = req.session.userId;
  const { id, name, description, fromDate, stillStudying, untilDate } = req.body;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    if (!resume) return res.status(400).send({ message: 'Resume not found' });

    const fields = {
      name,
      description,
      from_date: fromDate,
      still_studying: stillStudying,
      until_date: untilDate,
      resume_id: resume.id
    };

    const response = await resumeService.addOrUpdateEducation(id, fields);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to add or update education' });
  }
};


/**
 * Deletes an education entry from the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing the education ID in the body.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} - Sends a response with the status of the operation.
  * @deprecated Legacy resume/CV implementation.
 */
const deleteEducation = async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.body;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    if (!resume) return res.status(400).send({ message: 'Resume not found' });

    const response = await resumeService.deleteEducation(id);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete education' });
  }
};

/**
 * Adds or updates a project entry for the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing project data in the body.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} - Sends a response with the status of the operation.
  * @deprecated Legacy resume/CV implementation.
 */
const addOrUpdateProject = async (req, res) => {
  const userId = req.session.userId;
  const { id, name, description } = req.body;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    if (!resume) return res.status(400).send({ message: 'Resume not found' });

    const fields = {
      name,
      description,
      resume_id: resume.id
    };

    const response = await resumeService.addOrUpdateProject(id, fields);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to add or update project' });
  }
};

/**
 * Deletes a project entry from the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing the project ID in the body.
 * @param {Object} res - The response object used to send back the result.
 * @returns {Promise<void>} - Sends a response with the status of the operation.
  * @deprecated Legacy resume/CV implementation.
 */
const deleteProject = async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.body;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    if (!resume) return res.status(400).send({ message: 'Resume not found' });

    const response = await resumeService.deleteProject(id);
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete project' });
  }
};

/**
 * Retrieves the resume information for the logged-in user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the resume information.
 * @returns {Promise<void>} - Sends a response with the resume data if found.
  * @deprecated Legacy resume/CV implementation.
 */
const getResumeInfo = async (req, res) => {
  const userId = req.session.userId;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    if (!resume) {
      return res.status(404).send({ message: 'Resume not found' });
    }
    res.status(200).send(resume);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve resume' });
  }
};

/**
 * Retrieves a specific work experience entry for the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing the work experience ID in the URL parameters.
 * @param {Object} res - The response object used to send back the work experience data.
 * @returns {Promise<void>} - Sends a response with the work experience data if found.
  * @deprecated Legacy resume/CV implementation.
 */
const getWorkExperience = async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    const workExperience = await resumeService.getWorkExperience(id);
    if (!resume || !workExperience || workExperience.resume_id !== resume.id) {
      return res.status(404).send({ message: 'Work experience not found' });
    }
    res.status(200).json(workExperience);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch work experience' });
  }
};


/**
 * Retrieves a specific education entry for the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing the education ID in the URL parameters.
 * @param {Object} res - The response object used to send back the education data.
 * @returns {Promise<void>} - Sends a response with the education data if found.
  * @deprecated Legacy resume/CV implementation.
 */
const getEducation = async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    const education = await resumeService.getEducation(id);
    if (!resume || !education || education.resume_id !== resume.id) {
      return res.status(404).send({ message: 'Education not found' });
    }
    res.status(200).json(education);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch education' });
  }
};


/**
 * Retrieves a specific project entry for the logged-in user's resume.
 * 
 * @param {Object} req - The request object containing the project ID in the URL parameters.
 * @param {Object} res - The response object used to send back the project data.
 * @returns {Promise<void>} - Sends a response with the project data if found.
  * @deprecated Legacy resume/CV implementation.
 */
const getProject = async (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    const project = await resumeService.getProject(id);
    if (!resume || !project || project.resume_id !== resume.id) {
      return res.status(404).send({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch project' });
  }
};


/**
 * Retrieves all work experiences associated with the admin's resume.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the work experience data.
 * @returns {Promise<void>} - Sends a response with the work experiences data.
  * @deprecated Legacy resume/CV implementation.
 */
const getAdminWorkExperiences = async (req, res) => {
  try {
    const resume = await resumeService.getResumeInfo(ADMIN_ID);
    if (!resume) {
      return res.status(404).send({ message: 'Resume not found' });
    }
    const experiences = await resumeService.getWorkExperiences(resume.id);
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching admin work experiences:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Retrieves all education entries associated with the admin's resume.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the education data.
 * @returns {Promise<void>} - Sends a response with the education data.
  * @deprecated Legacy resume/CV implementation.
 */
const getAdminEducations = async (req, res) => {
  try {
    const resume = await resumeService.getResumeInfo(ADMIN_ID);
    if (!resume) {
      return res.status(404).send({ message: 'Resume not found' });
    }
    const educations = await resumeService.getEducations(resume.id);
    res.status(200).json(educations);
  } catch (error) {
    console.error('Error fetching admin educations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Retrieves all projects associated with the admin's resume.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the project data.
 * @returns {Promise<void>} - Sends a response with the projects data.
  * @deprecated Legacy resume/CV implementation.
 */
const getAdminProjects = async (req, res) => {
  try {
    const resume = await resumeService.getResumeInfo(ADMIN_ID);
    if (!resume) {
      return res.status(404).send({ message: 'Resume not found' });
    }
    const projects = await resumeService.getProjects(resume.id);
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Retrieves the resume information for the admin user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the resume information.
 * @returns {Promise<void>} - Sends a response with the resume data if found.
  * @deprecated Legacy resume/CV implementation.
 */
const getAdminResume = async (req, res) => {
  try {
    const resume = await resumeService.getResumeInfo(ADMIN_ID);
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching admin resume:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * Retrieves all work experiences associated with the logged-in user's resume.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the work experience data.
 * @returns {Promise<void>} - Sends a response with the work experiences data.
  * @deprecated Legacy resume/CV implementation.
 */
const getWorkExperiences = async (req, res) => {
  const userId = req.session.userId;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    const workExperiences = await resumeService.getWorkExperiences(resume.id);
    res.status(200).send(workExperiences);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve work experiences' });
  }
};


/**
 * Retrieves all education entries associated with the logged-in user's resume.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the education data.
 * @returns {Promise<void>} - Sends a response with the education data.
  * @deprecated Legacy resume/CV implementation.
 */
const getEducations = async (req, res) => {
  const userId = req.session.userId;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    const educations = await resumeService.getEducations(resume.id);
    res.status(200).send(educations);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve educations' });
  }
};


/**
 * Retrieves all projects associated with the logged-in user's resume.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send back the project data.
 * @returns {Promise<void>} - Sends a response with the projects data.
  * @deprecated Legacy resume/CV implementation.
 */
const getProjects = async (req, res) => {
  const userId = req.session.userId;

  try {
    const resume = await resumeService.getResumeInfo(userId);
    const projects = await resumeService.getProjects(resume.id);
    res.status(200).send(projects);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve projects' });
  }
};


// ///////
// Export
// ///////

module.exports = {
  saveOrUpdateResume,
  getResumeInfo,
  addOrUpdateWorkExperience,
  deleteWorkExperience,
  addOrUpdateEducation,
  deleteEducation,
  addOrUpdateProject,
  deleteProject,
  getWorkExperience,
  getEducation,
  getProject,
  getWorkExperiences,
  getEducations,
  getProjects,
  getAdminWorkExperiences,
  getAdminEducations,
  getAdminProjects,
  getAdminResume
};
