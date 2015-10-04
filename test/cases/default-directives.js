'use strict'

var test = require('tap').test

test('test default-directives.js', function (t) {
  t.plan(1)

  t.looseEqual(require('../../code/default-directives.js'), {
    '--': require('../../code/directives/--.js'),
    'call': require('../../code/directives/call.js'),
    'each': require('../../code/directives/each.js'),
    'else': require('../../code/directives/else.js'),
    'extends': require('../../code/directives/extends.js'),
    'if': require('../../code/directives/if.js'),
    'import': require('../../code/directives/import.js'),
    'parent': require('../../code/directives/parent.js'),
    'partial': require('../../code/directives/partial.js'),
    'section': require('../../code/directives/section.js'),
    'yield': require('../../code/directives/yield')
  })
})
