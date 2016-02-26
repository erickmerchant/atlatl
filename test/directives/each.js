'use strict'

var test = require('tap').test

test('test directives/each.js', function (t) {
  t.plan(3)

  var directive = require('../../directives/each.js')

  t.equal('${safe((Array.isArray(test) && test.length) ? test.map(function(parened) { return // compiled }, this) : "")}', directive({args: ['test'], parened: 'parened'}, {}, function () { return '// compiled' }))

  t.throws(function () { directive({args: ['test']}) }, /Parened is required/)

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)
})
