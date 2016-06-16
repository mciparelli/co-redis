
/**
 * Module dependencies.
 */

var promisify = require('es6-promisify');
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
  
  wrap.multi = function (cmds) {
    var multi = client.multi(cmds);
    multi.exec = promisify(multi.exec, multi);
    return multi;
  };

  wrap.batch = function (cmds) {
    var batch = client.batch(cmds);
    batch.exec = promisify(batch.exec, batch);
    return batch;
  };
  
  wrap.pipeline = function(){
    var pipeline = client.pipeline();
    pipeline.exec = promisify(pipeline.exec, pipeline);
    return pipeline;
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

  var nowrap = {
    'multi': true,
    'batch': true,
    'pipeline': true
  };

  Object.keys(Object.getPrototypeOf(client)).forEach(function (key) {
    var protoFunction = client[key].bind(client);
    var isCommand = API_FUNCTIONS.indexOf(key) === -1;
    
    if (nowrap[key]) return;
    if (isCommand) {
      protoFunction = promisify(protoFunction, client);
    }
    wrap[key] = protoFunction;
  });
  return wrap;
};
