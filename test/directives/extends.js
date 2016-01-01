'use strict'

var test = require('tap').test

test('test directives/extends.js', function (t) {
  t.plan(7)

  var directive = require('../../code/directives/extends.js')

  var dependencies = []

  t.equal('', directive({args: ['test']}, {dependencies: dependencies}, function (x) {
    t.equal(x, 'test')

    return 'test'
  }))

  t.looseEqual(dependencies, ['test'])

  t.equal(directive.minArgs, 1)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, false)

  t.equal(directive.requiresParened, false)
})
