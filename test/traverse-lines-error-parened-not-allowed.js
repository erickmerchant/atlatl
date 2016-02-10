'use strict'

// var mockery = require('mockery')
var test = require('tap').test

function block (context, template, nested) {
  return nested()
}

block.isBlock = true

block.hasParened = false

test('test traverse-lines.js - error, too few arguments', function (t) {
  t.plan(1)

  var traverse = require('../code/traverse-lines.js')('@block (a, b)\n@', function () {}, {block: block})

  t.throws(function () { traverse({}) }, /Parened argument not allowed for @block/)
})
