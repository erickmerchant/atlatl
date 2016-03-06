'use strict'

var test = require('tap').test

test('test directives/each.js', function (t) {
  t.plan(3)

  var directive = require('../../code/directives/each')

  t.equal('${safe((Array.isArray(test) && test.length) ? test.map(function(parened) { return // compiled }, this) : "")}', directive({
    context: {args: ['test'], parened: 'parened'},
    nested: function () { return '// compiled' }
  }))

  t.throws(function () {
    directive({
      context: {args: ['test']}
    })
  }, /Parened is required/)

  t.throws(function () {
    directive({
      context: {args: []}
    })
  }, /Exactly one arg required/)
})
