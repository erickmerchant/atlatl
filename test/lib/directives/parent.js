'use strict'

var test = require('tape')

test('test directives/parent.js', function (t) {
  t.plan(4)

  var directive = require('../../../lib/directives/parent')

  t.equal('${safe(super(content))}', directive({context: {args: []}, variable: 'content'}))

  t.equal('${safe(super(content, parened))}', directive({context: {args: [], parened: 'parened'}, variable: 'content'}))

  t.equal('${safe(super.arg(content))}', directive({context: {args: ['arg']}, variable: 'content'}))

  t.throws(function () { directive({context: {args: ['test', 'test']}}) }, /Zero or one args allowed/)
})
