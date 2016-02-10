'use strict'

var test = require('tap').test

test('test directives/partial.js', function (t) {
  t.plan(4)

  var directive = require('../../code/directives/partial.js')

  var methods = new Map()
  var methods2 = new Map()

  t.equal('', directive({args: ['test']}, {methods: methods}, function () {}))

  methods2.set('test', `test(content) {
    var output = []
    // compiled
    return output
  }`)

  t.equal('', directive({args: ['test'], parened: 'parened'}, {methods: methods}, function () {}))

  methods2.set('test', `test(content, parened) {
    var output = []
    // compiled
    return output
  }`)

  t.looseEqual(methods, methods2)

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)
})
