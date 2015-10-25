'use strict'

// var mockery = require('mockery')
var test = require('tap').test

function block (context) {
  return context.compiled
}

block.isBlock = true

block.maxArgs = 1

test('test traverse-lines.js - error, too few arguments', function (t) {
  t.plan(1)

  var traverse = require('../code/traverse-lines.js')(function () {}, {block: block})

  t.throws(function () { traverse({}, ['@block a b', '@']) }, /Too many arguments given for @block/)
})
