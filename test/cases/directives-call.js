'use strict'

var test = require('tap').test

test('test directives/call.js', function (t) {
  t.plan(5)

  var directive = require('../../code/directives/call.js')

  t.equal('output = output.concat(this.test(content))', directive({args: ['test']}))

  t.equal(directive.minArgs, 1)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, true)

  t.equal(directive.requiresParened, false)

  t.end()
})
