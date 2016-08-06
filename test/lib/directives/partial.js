'use strict'

var test = require('tape')

test('test directives/partial.js', function (t) {
  t.plan(4)

  var directive = require('../../../lib/directives/partial')

  var methods = new Map()
  var methods2 = new Map()

  t.equal('', directive({
    context: {args: ['test']},
    template: {methods: methods},
    nested: function () {},
    variable: 'content'
  }))

  methods2.set('test', `test(content) {
    var output = []
    // compiled
    return output
  }`)

  t.equal('', directive({
    context: {args: ['test'], parened: 'parened'},
    template: {methods: methods},
    nested: function () {},
    variable: 'content'
  }))

  methods2.set('test', `test(content, parened) {
    var output = []
    // compiled
    return output
  }`)

  t.looseEqual(methods, methods2)

  t.throws(function () { directive({context: {args: []}}) }, /Exactly one arg required/)
})
