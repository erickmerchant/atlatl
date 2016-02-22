'use strict'

var test = require('tap').test

test('test directives/yield.js', function (t) {
  t.plan(4)

  var directive = require('../../code/directives/yield.js')

  var methods = new Map()

  var methods2 = new Map()

  t.equal('${safe(this.test(content))}', directive({args: ['test']}, {methods: methods}))

  methods2.set('test', `test() {
    return []
  }`)

  t.looseEqual(methods, methods2)

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)

  t.throws(function () { directive({args: ['test'], parened: 'test'}) }, /Parened not allowed/)
})
