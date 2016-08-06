'use strict'

// var mockery = require('mockery')
var test = require('tape')

function block (settings) {
  return '${' + settings.nested() + '}'
}

function inline () {
  return ''
}

const directives = {
  inline: inline,
  block: block
}

test('test traverse-lines', function (t) {
  t.plan(4)

  var traverse1 = require('../../lib/traverse-lines')('@inline', {load: function () {}, directives: directives})

  t.deepEqual('', traverse1({}))

  var traverse2 = require('../../lib/traverse-lines')('@block\n  ...\n@', {load: function () {}, directives: directives})

  t.deepEqual('${template`  ...`}', traverse2({}))

  var traverse3 = require('../../lib/traverse-lines')('@block\n  @inline\n  @block\n    ...\n  @\n@', {load: function () {}, directives: directives})

  t.deepEqual('${template`\n${template`    ...`}`}', traverse3({}))

  var traverse4 = require('../../lib/traverse-lines')('    \\@    ', {load: function () {}, directives: directives})

  t.deepEqual('    @    ', traverse4({}))
})
