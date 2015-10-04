'use strict'

var runner = require('../index.js')
var test = require('tap').test

test('test index.js - error on read', function (t) {
  t.plan(4)

  runner(t, 'read')
})
