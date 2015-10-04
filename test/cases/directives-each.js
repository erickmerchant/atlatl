'use strict'

var test = require('tap').test

test('test directives/each.js', function (t) {
  t.plan(6)

  var directive = require('../../code/directives/each.js')

  t.equal(`if (Array.isArray(test) && test.length) { output = output.concat(test.map(function(parened) { var output = []
  // compiled
  return output.join('\\n') }, this)) }`, directive({args: ['test'], compiled: '// compiled', parened: 'parened'}))

  t.equal(directive.minArgs, 1)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, true)

  t.equal(directive.requiresParened, true)

  t.equal(directive.isBlock, true)

  t.end()
})
