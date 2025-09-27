/**
 * cookieService.js
 *
 * This service file contains functions for handling analytics data and user cookie preferences.
 * The functions interact with a PostgreSQL database using Knex.js to store and retrieve
 * analytics information and user preferences.
 *
 * Key functionalities:
 * - Track and store analytics data in the database.
 * - Save user cookie preferences.
 * - Retrieve analytics data for various time periods and by country.
 *
 * These functions are essential for collecting and analyzing user interaction data 
 * and managing user preferences related to cookies.
 */

const knex = require('../db/knex');


/**
 * Stores analytics data in the 'analytics' table.
 * 
 * @param {Object} analyticsData - The data to be stored, typically containing details like timestamp, country, etc.
 * @returns {Promise<Object>} - Returns a confirmation message along with the stored data.
 * @throws {Error} - Throws an error if there is a problem storing the data.
 */

const trackAnalytics = async (analyticsData) => {
  try {
    await knex('analytics').insert(analyticsData);
    return { message: 'Data received', data: analyticsData };
  } catch (error) {
    console.error('Error storing analytics data:', error);
    throw new Error('Internal server error');
  }
};

/**
 * Stores user cookie preferences in the 'functional_cookies' table.
 * 
 * @param {Object} cookieData - The cookie preference data to be stored, typically containing user ID and preference details.
 * @returns {Promise<Object>} - Returns a confirmation message along with the stored preference data.
 * @throws {Error} - Throws an error if there is a problem saving the preference.
 */

const setCookiePreference = async (cookieData) => {
  try {
    await knex('functional_cookies').insert(cookieData);
    return { message: 'Preference saved', data: cookieData };
  } catch (error) {
    console.error('Error saving preference:', error);
    throw new Error('Internal server error');
  }
};

/**
 * Retrieves analytics data from the 'analytics' table, aggregated by day, week, month, and country.
 * 
 * @returns {Promise<Object>} - Returns an object containing aggregated analytics data: daily visitors, weekly visitors, 
 *                              monthly visitors, and visitors by country.
 * @throws {Error} - Throws an error if there is a problem retrieving the data.
 */

const getAnalyticsData = async (excludedIpsString="") => {
  try {

    let excludedIps =[]
    if(excludedIpsString){
      excludedIps = excludedIpsString.split(',');
    }

    const dailyVisitors = await knex('analytics')
      .select(knex.raw('DATE(timestamp) as date'), knex.raw('count(*) as count'))
      .groupByRaw('DATE(timestamp)')
      .orderBy('date', 'desc')
      .whereNotIn('ip', excludedIps);

    const weeklyVisitors = await knex('analytics')
      .select(knex.raw('DATE_TRUNC(\'week\', timestamp) as week'), knex.raw('count(*) as count'))
      .groupByRaw('DATE_TRUNC(\'week\', timestamp)')
      .orderBy('week', 'desc')
      .whereNotIn('ip', excludedIps);

    const monthlyVisitors = await knex('analytics')
      .select(knex.raw('DATE_TRUNC(\'month\', timestamp) as month'), knex.raw('count(*) as count'))
      .groupByRaw('DATE_TRUNC(\'month\', timestamp)')
      .orderBy('month', 'desc')
      .whereNotIn('ip', excludedIps);

    const countryVisitors = await knex('analytics')
      .select('country', 'ip', knex.raw('count(*) as count'), knex.raw('MAX(timestamp) as timestamp'))
      .groupBy('country', 'ip')
      .orderBy('count', 'desc')
      .whereNotIn('ip', excludedIps);

    return { dailyVisitors, weeklyVisitors, monthlyVisitors, countryVisitors };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw new Error('Internal server error');
  }
};

// ///////
// Export
// ///////

module.exports = {
  trackAnalytics,
  setCookiePreference,
  getAnalyticsData
};
