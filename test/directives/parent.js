'use strict'

var test = require('tap').test

test('test directives/parent.js', function (t) {
  t.plan(7)

  var directive = require('../../code/directives/parent.js')

  t.equal('output = output.concat(super(content))', directive({args: []}))

  t.equal('output = output.concat(super(content, parened))', directive({args: [], parened: 'parened'}))

  t.equal('output = output.concat(super.arg(content))', directive({args: ['arg']}))

  t.equal(directive.minArgs, 0)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, true)

  t.equal(directive.requiresParened, false)
})
