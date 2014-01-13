
/**
 * Module dependencies.
 */

var thunkify = require('thunkify');
var EventEmitter = require('events').EventEmitter;

/**
 * List of API functions that do not take a callback as an argument
 *   since they are not redis commands.
 *
 * @constant
 * @type {Array}
 */
var API_FUNCTIONS = ['end', 'unref'];

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
  
  Object.keys(EventEmitter.prototype).forEach(function (key) {
    if (typeof client[key] != 'function') return;
    wrap[key] = client[key].bind(client);
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
    var protoFunction = client[key].bind(client);
    var isCommand = API_FUNCTIONS.indexOf(key) === -1;
    var isMulti = key == 'multi';
    if (isMulti) return;
    if (isCommand) {
      protoFunction = thunkify(protoFunction);
    }
    wrap[key] = protoFunction;
  });
  return wrap;
};