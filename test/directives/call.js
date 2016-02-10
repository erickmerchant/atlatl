'use strict'

var test = require('tap').test

test('test directives/call.js', function (t) {
  t.plan(3)

  var directive = require('../../code/directives/call.js')

  t.equal('output = output.concat(this.test(content))', directive({args: ['test']}))

  t.equal('output = output.concat(this.test(content, testing, it))', directive({args: ['test'], parened: 'testing, it'}))

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)
})
