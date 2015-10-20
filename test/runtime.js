'use strict'

var test = require('tap').test

test('test runtime.js', function (t) {
  t.plan(1)

  var runtime = require('../code/runtime.js')
  var foo = '<>'

  t.equal(runtime.escape`${runtime.safe(foo)} ${foo}`, '<> &lt;&gt;')
})