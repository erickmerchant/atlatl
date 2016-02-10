'use strict'

// var mockery = require('mockery')
var test = require('tap').test

function block (context, template, nested) {
  return nested()
}

function inline () {
  return ''
}

const directives = {
  inline: inline,
  block: block
}

test('test traverse-lines.js', function (t) {
  t.plan(4)

  var traverse1 = require('../code/traverse-lines.js')('@inline', function () {}, directives)

  t.deepEqual([''].join('\n'), traverse1({}))

  var traverse2 = require('../code/traverse-lines.js')('@block\n  ...\n@', function () {}, directives)

  t.deepEqual(['output.push(escape`  ...`)'].join('\n'), traverse2({}))

  var traverse3 = require('../code/traverse-lines.js')('@block\n  @inline\n  @block\n    ...\n  @\n@', function () {}, directives)

  t.deepEqual(['\noutput.push(escape`    ...`)'].join('\n'), traverse3({}))

  var traverse4 = require('../code/traverse-lines.js')('    \\@    ', function () {}, directives)

  t.deepEqual(['output.push(escape`    @    `)'].join('\n'), traverse4({}))
})
