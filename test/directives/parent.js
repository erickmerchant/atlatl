'use strict'

var test = require('tap').test

test('test directives/parent.js', function (t) {
  t.plan(4)

  var directive = require('../../code/directives/parent.js')

  t.equal('${safe(super(content))}', directive({args: []}))

  t.equal('${safe(super(content, parened))}', directive({args: [], parened: 'parened'}))

  t.equal('${safe(super.arg(content))}', directive({args: ['arg']}))

  t.throws(function () { directive({args: ['test', 'test']}) }, /Zero or one args allowed/)
})
