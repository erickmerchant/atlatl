'use strict'

var test = require('tap').test

test('test directives/call.js', function (t) {
  t.plan(3)

  var directive = require('../../code/directives/call')

  t.equal('${safe(this.test(content))}', directive({
    context: {args: ['test']},
    variable: 'content'
  }))

  t.equal('${safe(this.test(content, testing, it))}', directive({
    context: {args: ['test'], parened: 'testing, it'},
    variable: 'content'
  }))

  t.throws(function () {
    directive({
      context: {args: []}
    })
  }, /Exactly one arg required/)
})
