'use strict'

var test = require('tap').test

test('test directives/if.js', function (t) {
  t.plan(3)

  var directive = require('../../code/directives/if.js')

  t.equal(`if (test) {
  // compiled
  }`, directive({ parened: 'test', args: [] }, {}, function () { return '// compiled' }))

  t.throws(function () { directive({args: ['test']}) }, /Exactly zero args allowed/)

  t.throws(function () { directive({args: []}) }, /Parened is required/)
})
