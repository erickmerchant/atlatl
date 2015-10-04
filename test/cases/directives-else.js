'use strict'

var test = require('tap').test

test('test directives/else.js', function (t) {
  t.plan(5)

  var directive = require('../../code/directives/else.js')

  t.equal('} else {', directive({parent: {directive: 'if'}}))

  t.equal(directive.minArgs, 0)

  t.equal(directive.maxArgs, 0)

  t.equal(directive.hasParened, false)

  t.equal(directive.requiresParened, false)

  t.end()
})
