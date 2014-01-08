
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
  
  Object.defineProperty(wrap, 'connected', {
    get: function () { return client.connected }
  });
  
  Object.defineProperty(wrap, 'retry_delay', {
    get: function () { return client.retry_delay }
  });
  
  Object.defineProperty(wrap, 'retry_backoff', {
    get: function () { return client.retry_backoff }
  });

  Object.keys(Object.getPrototypeOf(client)).forEach(function (key) {
    if (['end', 'unref'].indexOf(key) > -1) {
      return wrap[key] = client[key].bind(client);
    }
    if (key == 'multi') return;
    wrap[key] = thunkify(client[key].bind(client));
  });
  
  return wrap;
};