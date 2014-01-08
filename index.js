module.exports = function (redisClient) {
  var exports = {};
  require('./commands').forEach(function (command) {
    var commandLower = command.toLowerCase();
    exports[command] = function () {
      var args = Array.prototype.slice.call(arguments);
      return function (done) {
        args.push(done);
        return redisClient[command].apply(redisClient, args);
      }
    }
    exports[commandLower] = exports[command];
  });
  return exports;
};
