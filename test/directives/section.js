'use strict'

var test = require('tap').test

test('test directives/section.js', function (t) {
  t.plan(4)

  var directive = require('../../directives/section.js')

  var methods = new Map()
  var methods2 = new Map()

  t.equal('${safe(this.test(content))}', directive({args: ['test']}, {methods: methods}, function () {}))

  methods2.set('test', `test(content) {
    var output = []
    // compiled
    return output
  }`)

  t.looseEqual(methods, methods2)

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)

  t.throws(function () { directive({args: ['test'], parened: 'test'}) }, /Parened not allowed/)
})
