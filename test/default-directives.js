'use strict'

var test = require('tap').test

test('test default-directives', function (t) {
  t.plan(1)

  t.looseEqual(require('../code/default-directives'), {
    'call': require('../code/directives/call'),
    'each': require('../code/directives/each'),
    'extends': require('../code/directives/extends'),
    'if': require('../code/directives/if'),
    'import': require('../code/directives/import'),
    'parent': require('../code/directives/parent'),
    'partial': require('../code/directives/partial'),
    'section': require('../code/directives/section'),
    'yield': require('../code/directives/yield')
  })
})
