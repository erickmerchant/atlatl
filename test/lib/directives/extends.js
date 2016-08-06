'use strict'

var test = require('tape')

test('test directives/extends.js', function (t) {
  t.plan(5)

  var directive = require('../../../lib/directives/extends')

  var dependencies = []

  t.equal('', directive({
    context: {args: ['test']},
    template: {dependencies: dependencies},
    load: function (x) {
      t.equal(x, 'test')

      return 'test'
    }
  }))

  t.looseEqual(dependencies, ['test'])

  t.throws(function () { directive({context: {args: []}}) }, /Exactly one arg required/)

  t.throws(function () { directive({context: {args: ['test'], parened: 'test'}}) }, /Parened not allowed/)
})
