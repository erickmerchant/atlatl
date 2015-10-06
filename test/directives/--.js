'use strict'

var test = require('tap').test

test('test directives/--.js', function (t) {
  t.plan(7)

  var directive = require('../../code/directives/--.js')

  t.equal('', directive())

  t.equal(directive.minArgs, 0)

  t.equal(directive.maxArgs, 0)

  t.equal(directive.hasParened, false)

  t.equal(directive.requiresParened, false)

  t.equal(directive.isBlock, true)

  t.equal(directive.isComment, true)

  t.end()
})
