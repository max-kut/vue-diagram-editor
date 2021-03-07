const {version, homepage} = require('../../package');

module.exports = `
vue-diagram-editor v${version} | (c) 2021-${new Date().getFullYear()} Maksim Kutishchev
Released under the Apache 2 License.
${homepage}
`.trim();
