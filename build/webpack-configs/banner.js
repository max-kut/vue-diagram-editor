const {version, homepage} = require('../../package');
const year = new Date().getFullYear();
const years = year === 2021 ? '2021' : '2021-' + year;

module.exports = `
vue-diagram-editor v${version} | (c) ${years} Maksim Kutishchev
Released under the Apache 2 License.
${homepage}
`.trim();
