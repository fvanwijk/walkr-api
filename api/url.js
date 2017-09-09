const config = require(`../config/${process.env.NODE_ENV === 'production' ? 'production' : 'develop'}.json`);
const path = require('path');

module.exports = {
  hostname: config.webHostname,
  port: process.env.PORT || config.webPort,
  getHost() { return `${this.hostname}${config.webPort ? ':' + config.webPort : ''}`; },
  create() {
    return path.join.apply(this, ['/api', ...Array.prototype.slice.call(arguments).map(arg => arg.toString())]);
  },
  addHostToUrl(url) {
    return `${this.getHost()}${url}`;
  }
};
