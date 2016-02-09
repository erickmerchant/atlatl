'use strict'

var test = require('tap').test

test('test directives/section.js', function (t) {
  t.plan(6)

  var directive = require('../../code/directives/section.js')

  var methods = new Map()
  var methods2 = new Map()

  t.equal('output = output.concat(this.test(content))', directive({args: ['test']}, {methods: methods}, function () {}))

  methods2.set('test', `test(content) {
    var output = []
    // compiled
    return output
  }`)

  t.looseEqual(methods, methods2)

  t.equal(directive.minArgs, 1)

  t.equal(directive.maxArgs, 1)

  t.equal(directive.hasParened, false)

  t.equal(directive.requiresParened, false)
})
