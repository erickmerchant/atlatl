'use strict'

var test = require('tap').test

test('test directives/else.js', function (t) {
  t.plan(7)

  var directive = require('../../code/directives/else.js')

  t.equal('} else {', directive({parent: {directive: 'if'}}))

  t.equal('} else if (true) {', directive({parent: {directive: 'if'}, parened: 'true'}))

  t.equal('', directive({parent: {directive: 'foo'}}))

  t.equal(directive.minArgs, 0)

  t.equal(directive.maxArgs, 0)

  t.equal(directive.hasParened, true)

  t.equal(directive.requiresParened, false)
})
