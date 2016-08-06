'use strict'

// var mockery = require('mockery')
var test = require('tape')

test('test traverse-lines.js - error, directive not found', function (t) {
  t.plan(1)

  var traverse = require('../../lib/traverse-lines.js')('@test', {load: function () {}, directives: {}})

  t.throws(function () { traverse({}) }, /Directive test not found/)
})
