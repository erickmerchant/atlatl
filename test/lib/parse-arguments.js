'use strict'

var test = require('tape')

test('test parse-arguments.js', function (t) {
  t.plan(5)

  var parseArguments = require('../../lib/parse-arguments')

  t.deepEqual(parseArguments(''), {args: [], parened: undefined, directive: ''})

  t.deepEqual(parseArguments('directive'), {args: [], parened: undefined, directive: 'directive'})

  t.deepEqual(parseArguments('directive arg1 arg2 arg3'), {args: ['arg1', 'arg2', 'arg3'], parened: undefined, directive: 'directive'})

  t.deepEqual(parseArguments('directive (...)'), {args: [], parened: '...', directive: 'directive'})

  t.deepEqual(parseArguments('directive arg1 arg2 arg3 (...)'), {args: ['arg1', 'arg2', 'arg3'], parened: '...', directive: 'directive'})
})
