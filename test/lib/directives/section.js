'use strict'

var test = require('tape')

test('test directives/section.js', function (t) {
  t.plan(4)

  var directive = require('../../../lib/directives/section')

  var methods = new Map()
  var methods2 = new Map()

  t.equal('${' + 'safe(this.test(content))}', directive({
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

  t.looseEqual(methods, methods2)

  t.throws(function () { directive({context: {args: []}}) }, /Exactly one arg required/)

  t.throws(function () { directive({context: {args: ['test'], parened: 'test'}}) }, /Parened not allowed/)
})
