'use strict'

var test = require('tap').test

test('test directives/each.js', function (t) {
  t.plan(3)

  var directive = require('../../code/directives/each.js')

  t.equal(`if (Array.isArray(test) && test.length) { output = output.concat(test.map(function(parened) { var output = []
  // compiled
  return output.join('\\n') }, this)) }`, directive({args: ['test'], parened: 'parened'}, {}, function () { return '// compiled' }))

  t.throws(function () { directive({args: ['test']}) }, /Parened is required/)

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)
})
