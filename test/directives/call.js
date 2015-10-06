'use strict'

var test = require('tap').test

test('test directives/call.js', function (t) {
  t.plan(6)

  var directive = require('../../code/directives/call.js')

  t.equal('output = output.concat(this.test(content))', directive({args: ['test']}))

  t.equal('output = output.concat(this.test(content, testing, it))', directive({args: ['test'], parened: 'testing, it'}))

  t.equal(directive.minArgs, 1)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, true)

  t.equal(directive.requiresParened, false)

  t.end()
})
