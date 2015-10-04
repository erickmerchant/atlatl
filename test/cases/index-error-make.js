'use strict'

var runner = require('../index.js')
var test = require('tap').test

test('test index.js - error on make', function (t) {
  t.plan(6)

  runner(t, 'make')
})
