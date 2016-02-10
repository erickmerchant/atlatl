'use strict'

var test = require('tap').test

test('test directives/else.js', function (t) {
  t.plan(4)

  var directive = require('../../code/directives/else.js')

  t.equal('} else {', directive({parent: {directive: 'if'}, args: []}))

  t.equal('} else if (true) {', directive({parent: {directive: 'if'}, parened: 'true', args: []}))

  t.equal('', directive({parent: {directive: 'foo'}, args: []}))

  t.throws(function () { directive({args: ['not allowed']}) }, /Exactly zero args allowed/)
})
