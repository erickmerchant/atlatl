'use strict'

var test = require('tape')

test('test default-directives', function (t) {
  t.plan(1)

  t.looseEqual(require('../../lib/default-directives'), {
    'call': require('../../lib/directives/call'),
    'each': require('../../lib/directives/each'),
    'extends': require('../../lib/directives/extends'),
    'if': require('../../lib/directives/if'),
    'import': require('../../lib/directives/import'),
    'parent': require('../../lib/directives/parent'),
    'partial': require('../../lib/directives/partial'),
    'section': require('../../lib/directives/section'),
    'yield': require('../../lib/directives/yield')
  })
})
