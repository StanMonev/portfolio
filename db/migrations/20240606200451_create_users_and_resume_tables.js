/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * @deprecated Legacy resume/CV schema migration.
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id').primary();
            table.string('username').notNullable().unique();
            table.string('password').notNullable();
            table.string('email').notNullable().unique();
            table.timestamps(true, true);
        })
        .createTable('resumes', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('town').notNullable();
            table.string('country').notNullable();
            table.string('email').notNullable();
            table.string('linkedin');
            table.string('github');
            table.string('website');
            table.text('skills');
            table.text('interests');
            table.timestamps(true, true);
        })
        .createTable('work_experiences', function(table) {
            table.increments('id').primary();
            table.integer('resume_id').unsigned().references('id').inTable('resumes').onDelete('CASCADE');
            table.string('job_title').notNullable();
            table.text('job_description').notNullable();
            table.date('job_begin_date').notNullable();
            table.boolean('still_working').defaultTo(false);
            table.date('job_end_date');
            table.timestamps(true, true);
        })
        .createTable('educations', function(table) {
            table.increments('id').primary();
            table.integer('resume_id').unsigned().references('id').inTable('resumes').onDelete('CASCADE');
            table.string('name').notNullable();
            table.text('description').notNullable();
            table.date('from_date').notNullable();
            table.boolean('still_studying').defaultTo(false);
            table.date('until_date');
            table.timestamps(true, true);
        })
        .createTable('projects', function(table) {
            table.increments('id').primary();
            table.integer('resume_id').unsigned().references('id').inTable('resumes').onDelete('CASCADE');
            table.string('name').notNullable();
            table.text('description');
            table.timestamps(true, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * @deprecated Legacy resume/CV schema migration.
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('projects')
        .dropTableIfExists('educations')
        .dropTableIfExists('work_experiences')
        .dropTableIfExists('resumes')
        .dropTableIfExists('users');
};
