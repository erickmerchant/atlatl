'use strict'

var runner = require('../index.js')
var test = require('tap').test

test('test index.js - error on write', function (t) {
  t.plan(9)

  runner(t, 'write')
})
