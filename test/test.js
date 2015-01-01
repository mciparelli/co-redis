var redis = require('redis');
var co = require('co');
var wrap = require('..');
var assert = require('assert');

describe('wrap', function () {
  it('should support callback functions', function () {
    return co(function * () {
      var client = wrap(redis.createClient());
      yield client.set('test', 33);
      assert.equal(33, yield client.get('test'));
    });
  })

  it('should support multi()', function () {
    return co(function * () {
      var client = wrap(redis.createClient());
      yield client.multi()
        .set('test', 33)
        .set('foo', 'bar')
        .exec();
      assert.equal(33, yield client.get('test'));
      assert.equal('bar', yield client.get('foo'));
    });
  })

  it('should support publish / subscribe', function (done) {
    var pub = wrap(redis.createClient());
    var sub = wrap(redis.createClient());

    sub.subscribe('channel');

    sub.on('subscribe', function () {
      pub.publish('channel', 'message');
    });

    sub.on('message', function (channel, message) {
      assert.equal(channel, 'channel');
      assert.equal(message, 'message');
      done();
    });
  })
})
