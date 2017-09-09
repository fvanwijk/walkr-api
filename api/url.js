const config = require(`../config/${process.env === 'production' ? 'production' : 'develop'}`);
const path = require('path');

module.exports = {
  host: config.webHostname,
  port: process.env.PORT || config.webPort,
  create() {
    return `${this.host}${config.webPort ? ':' + config.webPort : ''}` + path.join.apply(this, ['/api', ...Array.prototype.slice.call(arguments).map(arg => arg.toString())]);
  },
  addHostToUrl(item) {
    item.url = `${this.host}${config.webPort ? ':' + config.webPort : ''}${item.url}`;
    return item;
  }
};
