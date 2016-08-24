'use strict'

var test = require('tape')

test('test directives/yield.js', function (t) {
  t.plan(4)

  var directive = require('../../../lib/directives/yield')

  var methods = new Map()

  var methods2 = new Map()

  t.equal('${' + 'safe(this.test(content))}', directive({
    context: {args: ['test']},
    template: {methods: methods},
    variable: 'content'
  }))

  methods2.set('test', `test() {
    return []
  }`)

  t.looseEqual(methods, methods2)

  t.throws(function () { directive({context: {args: []}}) }, /Exactly one arg required/)

  t.throws(function () { directive({context: {args: ['test'], parened: 'test'}}) }, /Parened not allowed/)
})
