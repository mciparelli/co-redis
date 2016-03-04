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

  it('should support batch()', function () {
    return co(function * () {
      var client = wrap(redis.createClient());
      yield client.multi()
        .set('test', 33)
        .set('foo', 'bar')
        .exec();

      var replies = yield client.batch()
        .get('test')
        .get('foo')
        .exec();

      assert.equal(33, replies[0]);
      assert.equal('bar', replies[1]);
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

  it('should work with buffers', function () {
    return co(function * () {
      var client = wrap(redis.createClient({ detect_buffers: true }));
      var key = 'some string';
      var value = 'this is a buffer';
      yield client.set(key, value);
      var buffer = yield client.get(new Buffer(key));
      assert.strictEqual(buffer.constructor.name, 'Buffer');
      assert.strictEqual(buffer.toString(), value);
    });
  });
})
