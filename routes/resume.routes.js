const express = require('express');
const resumeController = require('../controllers/resumeController');
const { requireResumeApiAccess } = require('../middleware/resumeApiAuthMiddleware');

const router = express.Router();

router.use('/api/resume', requireResumeApiAccess);

router.post('/api/resume/save', resumeController.saveOrUpdateResume);
router.get('/api/resume', resumeController.getResumeInfo);
router.post('/api/resume/work-experience', resumeController.addOrUpdateWorkExperience);
router.delete('/api/resume/work-experience', resumeController.deleteWorkExperience);
router.get('/api/resume/work-experience/:id', resumeController.getWorkExperience);
router.post('/api/resume/education', resumeController.addOrUpdateEducation);
router.delete('/api/resume/education', resumeController.deleteEducation);
router.get('/api/resume/education/:id', resumeController.getEducation);
router.post('/api/resume/project', resumeController.addOrUpdateProject);
router.delete('/api/resume/project', resumeController.deleteProject);
router.get('/api/resume/project/:id', resumeController.getProject);
router.get('/api/resume/projects', resumeController.getProjects);
router.get('/api/resume/educations', resumeController.getEducations);
router.get('/api/resume/work-experiences', resumeController.getWorkExperiences);
router.get('/api/resume/projects-admin', resumeController.getAdminProjects);
router.get('/api/resume/educations-admin', resumeController.getAdminEducations);
router.get('/api/resume/work-experiences-admin', resumeController.getAdminWorkExperiences);
router.get('/api/resume/admin', resumeController.getAdminResume);

module.exports = router;
