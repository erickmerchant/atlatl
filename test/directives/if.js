'use strict'

var test = require('tap').test

test('test directives/if.js', function (t) {
  t.plan(5)

  var directive = require('../../code/directives/if.js')

  t.equal(`if (test) {
  // compiled
  }`, directive({ parened: 'test' }, {}, function () { return '// compiled' }))

  t.equal(directive.minArgs, 0)

  t.equal(directive.maxArgs, 0)

  t.equal(directive.hasParened, true)

  t.equal(directive.requiresParened, true)
})
