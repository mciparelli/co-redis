
/**
 * Module dependencies.
 */

var thunkify = require('thunkify');

/**
 * Wrap `client`.
 *
 * @param {Redis} client
 * @return {Object}
 */

module.exports = function (client) {
  var wrap = {};
  
  wrap.multi = function () {
    var multi = client.multi();
    multi.exec = thunkify(multi.exec);
    return multi;
  };
  
  Object.keys(client).forEach(function (key) {
    wrap[key] = client[key];
  });

  Object.keys(Object.getPrototypeOf(client)).forEach(function (key) {
    if (key == 'multi') return;
    wrap[key] = thunkify(client[key].bind(client));
  });
  
  return wrap;
};