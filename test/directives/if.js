'use strict'

var test = require('tap').test

test('test directives/if.js', function (t) {
  t.plan(3)

  var directive = require('../../code/directives/if')

  t.equal('${safe((test) ? // compiled : "")}', directive({
    context: { parened: 'test', args: [] },
    nested: function () { return '// compiled' }
  }))

  t.throws(function () { directive({context: {args: ['test']}}) }, /Exactly zero args allowed/)

  t.throws(function () { directive({context: {args: []}}) }, /Parened is required/)
})
