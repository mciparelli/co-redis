var redis = require('redis');
var co = require('co');
var wrap = require('..');
var assert = require('assert');

describe('wrap', function () {
  it('should support callback functions', function (done) {
    co(function * () {
      var client = wrap(redis.createClient());
      yield client.set('test', 33);
      assert.equal(33, yield client.get('test'));
    })(done);
  })
  
  it('should support multi()', function (done) {
    co(function * () {
      var client = wrap(redis.createClient());
      yield client.multi()
        .set('test', 33)
        .set('foo', 'bar')
        .exec();
      assert.equal(33, yield client.get('test'));
      assert.equal('bar', yield client.get('foo'));
    })(done);
  })
})
