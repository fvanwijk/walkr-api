const path = require('path');

module.exports = {
  host: 'http://localhost',
  port: process.env.PORT || 1337,
  create() {
    return `${this.host}:${this.port}` + path.join.apply(this, ['/api'].concat(Array.prototype.slice.call(arguments)));
  }
};
