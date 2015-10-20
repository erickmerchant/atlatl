'use strict'

// var mockery = require('mockery')
var test = require('tap').test

function block () {
  return ''
}

block.isBlock = true

function inline () {
  return ''
}

const directives = {
  inline: inline,
  block: block
}

test('test traverse-lines.js', function (t) {
  t.plan(3)

  var traverse1 = require('../code/traverse-lines.js')(function () {}, directives)

  t.deepEqual([''], traverse1({}, ['@inline']))

  var traverse2 = require('../code/traverse-lines.js')(function () {}, directives)

  t.deepEqual([''], traverse2({}, [
    '@block',
    '...',
    '@'
  ]))

  var traverse3 = require('../code/traverse-lines.js')(function () {}, directives)

  t.deepEqual([''], traverse3({}, [
    '@block',
    '  @inline',
    '  @block',
    '    ...',
    '  @',
    '@'
  ]))
})
