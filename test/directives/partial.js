'use strict'

var test = require('tap').test

test('test directives/partial.js', function (t) {
  t.plan(8)

  var directive = require('../../code/directives/partial.js')

  var methods = new Map()
  var methods2 = new Map()

  t.equal('', directive({args: ['test'], compiled: '// compiled'}, {methods: methods}))

  methods2.set('test', `test(content) {
    var output = []
    // compiled
    return output
  }`)

  t.equal('', directive({args: ['test'], parened: 'parened', compiled: '// compiled'}, {methods: methods}))

  methods2.set('test', `test(content, parened) {
    var output = []
    // compiled
    return output
  }`)

  t.looseEqual(methods, methods2)

  t.equal(directive.minArgs, 1)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, true)

  t.equal(directive.requiresParened, false)

  t.equal(directive.isBlock, true)
})
