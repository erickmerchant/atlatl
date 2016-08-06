'use strict'

var test = require('tape')

test('test runtime.js', function (t) {
  t.plan(1)

  var runtime = require('../runtime')
  var foo = '<>'

  t.equal(runtime`${runtime.safe(foo)} ${foo}`, '<> &lt;&gt;')
})
