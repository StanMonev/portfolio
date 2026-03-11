const knex = require('../db/knex');

/**
 * Resume.js
 *
 * This file defines the Resume model, which provides methods to interact with the 'resumes' table in the database.
 * The Resume model includes methods for finding, creating, updating, and deleting resume records.
 *
 * Key functionalities:
 * - Retrieve resume records by resume ID or by user ID.
 * - Insert new resume records into the database.
 * - Update existing resume records.
 * - Delete resume records from the database.
 *
 * This model serves as an abstraction layer between the database and the application logic,
 * allowing for easy and consistent interaction with resume-related data.
  * @deprecated Legacy resume/CV implementation.
 */
class Resume {
    /**
     * @deprecated Legacy resume/CV implementation.
     */
    static async findById(id) {
        return knex('resumes').where({ id }).first();
    }

    /**
     * @deprecated Legacy resume/CV implementation.
     */
    static async findByUserId(userId) {
        return knex('resumes').where({ user_id: userId }).first();
    }

    /**
     * @deprecated Legacy resume/CV implementation.
     */
    static async create(data) {
        return knex('resumes').insert(data).returning('*');
    }

    /**
     * @deprecated Legacy resume/CV implementation.
     */
    static async update(id, data) {
        return knex('resumes').where({ id }).update(data).returning('*');
    }

    /**
     * @deprecated Legacy resume/CV implementation.
     */
    static async delete(id) {
        return knex('resumes').where({ id }).del();
    }
}

module.exports = Resume;
