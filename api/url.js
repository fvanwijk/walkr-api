module.exports = {
  host: 'http://localhost',
  port: process.env.PORT || 1337,
  create: function (slug, id, subId) {
    return `${this.host}:${this.port}/api/${slug}/${id}` + (subId ? `/${subId}` : '')
  }
};
