const utils = require('../utils');
const packageJSON = require(utils.resolve('package.json'));
const fs = require('fs');

const year = new Date().getFullYear();

module.exports = {
  version: packageJSON.version,
  homepage: packageJSON.homepage,
  copyright_years: year === 2021 ? '2021' : `2021-${year}`,
  files: {
    structure: fs.readFileSync(utils.resolve('docs/files/structure.json')),
    click_port_event_data: fs.readFileSync(utils.resolve('docs/files/click-port-event-data.json')),
    vue_simple_example: fs.readFileSync(utils.resolve('docs/files/simple-example.vue')),
    vue_simple_example_umd: fs.readFileSync(utils.resolve('docs/files/simple-example-umd.html')),
  }
};
