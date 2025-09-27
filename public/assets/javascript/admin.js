/**
 * admin.js
 *
 * This file contains the frontend logic for the admin dashboard. It handles fetching analytics data from the server,
 * rendering various charts using the Chart.js library, and managing user interactions like redirecting to the resume editor
 * or logging out.
 *
 * Key functionalities:
 * - Fetch and render analytics data for daily, weekly, monthly, and country-based visitors.
 * - Provide navigation actions for the resume editor and logout functionalities.
 *
 * This script ensures that the admin dashboard displays relevant data in a visually appealing manner and facilitates easy navigation for the admin.
 */

/**
 * Initializes the admin dashboard by rendering the charts when the DOM is fully loaded.
 * 
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    renderCharts();
    fetchAndRenderTable();
    addClickToFilterButton();
});


function addClickToFilterButton(){
    document.getElementById('applyFilter').addEventListener('click', () => {
        const filterIPs = document.getElementById('filterIP').value;
        fetchAndRenderTable(filterIPs);
        renderCharts(filterIPs);
    });
}


/**
 * Fetches the analytics data from the server.
 * 
 * @returns {Promise<Object>} - A promise that resolves to the analytics data in JSON format.
 */
async function fetchAnalyticsData(url = '/api/analytics') {
    const response = await fetch(url);
    return response.json();
}

/**
 * Renders charts on the admin dashboard using the fetched analytics data.
 * This function creates charts for daily visitors, weekly visitors, monthly visitors, and visitors by country.
 * 
 * @returns {Promise<void>} - A promise that resolves once all charts are rendered.
 */
async function renderCharts(filterIPs='') {
    let url = '/api/analytics';
    if (filterIPs) {
        url += `?filterIPs=${filterIPs}`;
    }
    
    const data = await fetchAnalyticsData(url);

    // Render daily visitors line chart
    const dailyCtx = document.getElementById('dailyChart').getContext('2d');

    let dailyChart = Chart.getChart("dailyChart");
    if (dailyChart != undefined) {
        dailyChart.destroy();
    }
    
    new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: data.dailyVisitors.toReversed().map(item => formatDate(item.date)),
            datasets: [{
                label: 'Daily Visitors',
                data: data.dailyVisitors.map(item => item.count),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Visitors' } }
            }
        }
    });

    // Render weekly visitors bar chart
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');

    let weeklyChart = Chart.getChart("weeklyChart");
    if (weeklyChart != undefined) {
        weeklyChart.destroy();
    }

    new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: data.weeklyVisitors.map(item => formatDate(item.week)),
            datasets: [{
                label: 'Weekly Visitors',
                data: data.weeklyVisitors.map(item => item.count),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Week' } },
                y: { title: { display: true, text: 'Visitors' } }
            }
        }
    });

    // Render monthly visitors bar chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');

    let monthlyChart = Chart.getChart("monthlyChart");
    if (monthlyChart != undefined) {
        monthlyChart.destroy();
    }

    new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: data.monthlyVisitors.map(item => formatDate(item.month)),
            datasets: [{
                label: 'Monthly Visitors',
                data: data.monthlyVisitors.map(item => item.count),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Month' } },
                y: { title: { display: true, text: 'Visitors' } }
            }
        }
    });

    // Render visitors by country pie chart
    const newCountriesArray = _mergeCountryHashes(data.countryVisitors);
    const countryCtx = document.getElementById('countryChart').getContext('2d');

    let countryChart = Chart.getChart("countryChart");
    if (countryChart != undefined) {
        countryChart.destroy();
    }

    new Chart(countryCtx, {
        type: 'pie',
        data: {
            labels: newCountriesArray.map(item => item.country),
            datasets: [{
                label: 'Visitors by Country',
                data: newCountriesArray.map(item => item.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

/**
 * Redirects the user to the resume editor page.
 * 
 * @returns {void}
 */
function redirectToResumeEditor() {
    window.location.href = "/admin/resume_editor";
}

/**
 * Logs the user out by redirecting them to the logout endpoint.
 * 
 * @returns {void}
 */
function logout() {
    window.location.href = "/logout";
}

/**
 * Creates an emoji out of a country code.
 * 
 * @param {string} countryCode - The code country string
 * @returns {string} The emoji code as a string
 */
function countryCodeToFlagEmoji(countryCode) {
    // Convert the country code (e.g., "US", "GB", etc.) to the corresponding flag emoji
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
}

/**
 * Formats the date so that it looks like this: 1 September 2024
 */
function formatDate(dateString) {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Fills in the contents of the admin table.
 * 
 * @param {string} filterIPs - The filtered IPs if there are any
 * @returns {void}
 */
async function fetchAndRenderTable(filterIPs = '') {
    let url = '/api/analytics';
    if (filterIPs) {
        url += `?filterIPs=${filterIPs}`;
    }
    
    const data = await fetchAnalyticsData(url);

    const tableBody = document.getElementById('visitorsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    // Sort visitors by timestamp (latest first)
    const sortedVisitors = data.countryVisitors.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    sortedVisitors.forEach(visitor => {
        const row = document.createElement('tr');

        const ipCell = document.createElement('td');
        ipCell.textContent = visitor.ip;
        row.appendChild(ipCell);

        const countryCell = document.createElement('td');
        const flagImg = document.createElement('img');
        flagImg.src = `https://flagsapi.com/${visitor.country}/flat/32.png`;
        countryCell.appendChild(flagImg);
        const span = document.createElement('span');
        span.innerHTML = countryCodeToFlagEmoji(visitor.country);
        countryCell.appendChild(span);
        row.appendChild(countryCell);
        
        const countCell = document.createElement('td');
        countCell.textContent = visitor.count;
        row.appendChild(countCell);

        const timestampCell = document.createElement('td');
        timestampCell.textContent = formatDate(visitor.timestamp);
        row.appendChild(timestampCell);

        tableBody.appendChild(row);
    });
}

/**
 * Merges the countries and adds their count, by removing the IP, so that it can be used in the pie chart statistic
 * @param {Array} hashes - An array of hashes that needs to be merged 
 * @returns An array with hashes, that only contain the Country and Count
 */
function _mergeCountryHashes(hashes) {
    const merged = [];
  
    hashes.forEach(hash => {
      const { country, count } = hash;
  
      const existingCountry = merged.find(mergedHash => mergedHash.country === country);
  
      if (existingCountry) {
        existingCountry.count += parseInt(count);
      } else {
        merged.push({ country, count: parseInt(count) });
      }
    });
  
    return merged;
}
