**co-redis** is a [node-redis](https://github.com/mranney/node_redis‎) wrapper to be used with [visionmedia's co](https://github.com/visionmedia/co) library.

## Usage

```js
var co = require('co');
var redisClient = require('redis').createClient();
var wrapper = require('co-redis');
var redisCo = wrapper(redisClient);
co(function* () {
  yield redisCo.set('test', 33);
  console.log(yield redisCo.get('test')); // logs 33
});
```

## Installation

    $ npm install co-redis

## License 

(The MIT License)

Copyright (c) 2013 Martín Ciparelli &lt;mciparelli@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
