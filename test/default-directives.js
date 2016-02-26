'use strict'

var test = require('tap').test

test('test default-directives.js', function (t) {
  t.plan(1)

  t.looseEqual(require('../default-directives.js'), {
    'call': require('../directives/call.js'),
    'each': require('../directives/each.js'),
    'extends': require('../directives/extends.js'),
    'if': require('../directives/if.js'),
    'import': require('../directives/import.js'),
    'parent': require('../directives/parent.js'),
    'partial': require('../directives/partial.js'),
    'section': require('../directives/section.js'),
    'yield': require('../directives/yield')
  })
})
