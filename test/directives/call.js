'use strict'

var test = require('tap').test

test('test directives/call.js', function (t) {
  t.plan(3)

  var directive = require('../../directives/call.js')

  t.equal('${safe(this.test(content))}', directive({args: ['test']}))

  t.equal('${safe(this.test(content, testing, it))}', directive({args: ['test'], parened: 'testing, it'}))

  t.throws(function () { directive({args: []}) }, /Exactly one arg required/)
})
