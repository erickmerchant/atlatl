'use strict'

var test = require('tap').test

test('test directives/extends.js', function (t) {
  t.plan(5)

  var directive = require('../../directives/extends.js')

  var dependencies = []

  t.equal('', directive({args: ['test']}, {dependencies: dependencies}, function () {}, function (x) {
    t.equal(x, 'test')

    return 'test'
  }))

  t.looseEqual(dependencies, ['test'])

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)

  t.throws(function () { directive({args: ['test'], parened: 'test'}) }, /Parened not allowed/)
})
