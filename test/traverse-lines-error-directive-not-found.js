'use strict'

// var mockery = require('mockery')
var test = require('tap').test

test('test traverse-lines.js - error, directive not found', function (t) {
  t.plan(1)

  var traverse = require('../code/traverse-lines.js')('@test', function () {}, {})

  t.throws(function () { traverse({}) }, /Directive test not found/)
})
