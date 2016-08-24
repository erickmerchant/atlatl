'use strict'

var test = require('tape')

test('test directives/if.js', function (t) {
  t.plan(3)

  var directive = require('../../../lib/directives/if')

  t.equal('${' + 'safe((test) ? // compiled : "")}', directive({
    context: { parened: 'test', args: [] },
    nested: function () { return '// compiled' }
  }))

  t.throws(function () { directive({context: {args: ['test']}}) }, /Exactly zero args allowed/)

  t.throws(function () { directive({context: {args: []}}) }, /Parened is required/)
})
