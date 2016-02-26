'use strict'

var test = require('tap').test

test('test parse-arguments.js', function (t) {
  t.plan(5)

  var parseArguments = require('../parse-arguments.js')

  t.deepEqual(parseArguments(''), {args: [], parened: undefined, directive: ''})

  t.deepEqual(parseArguments('directive'), {args: [], parened: undefined, directive: 'directive'})

  t.deepEqual(parseArguments('directive arg1 arg2 arg3'), {args: ['arg1', 'arg2', 'arg3'], parened: undefined, directive: 'directive'})

  t.deepEqual(parseArguments('directive (...)'), {args: [], parened: '...', directive: 'directive'})

  t.deepEqual(parseArguments('directive arg1 arg2 arg3 (...)'), {args: ['arg1', 'arg2', 'arg3'], parened: '...', directive: 'directive'})
})
