'use strict'

var runner = require('../index.js')
var test = require('tap').test

test('test index.js - error on directory', function (t) {
  t.plan(7)

  runner(t, 'directory')
})
