'use strict'

var test = require('tap').test

test('test directives/yield.js', function (t) {
  t.plan(6)

  var directive = require('../../code/directives/yield.js')

  var methods = new Map()

  var methods2 = new Map()

  t.equal('output = output.concat(this.test(content))', directive({args: ['test']}, {methods: methods}))

  methods2.set('test', `test() {
    return []
  }`)

  t.looseEqual(methods, methods2)

  t.equal(directive.minArgs, 1)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, false)

  t.equal(directive.requiresParened, false)

  t.end()
})
