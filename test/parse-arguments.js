'use strict'

var test = require('tap').test

test('test index.js', function (t) {
  t.plan(5)

  var parseArguments = require('../code/parse-arguments.js')

  t.deepEqual(parseArguments(''), {args: [], parened: '', directive: ''})

  t.deepEqual(parseArguments('directive'), {args: [], parened: '', directive: 'directive'})

  t.deepEqual(parseArguments('directive arg1 arg2 arg3'), {args: ['arg1', 'arg2', 'arg3'], parened: '', directive: 'directive'})

  t.deepEqual(parseArguments('directive (...)'), {args: [], parened: '...', directive: 'directive'})

  t.deepEqual(parseArguments('directive arg1 arg2 arg3 (...)'), {args: ['arg1', 'arg2', 'arg3'], parened: '...', directive: 'directive'})
})
