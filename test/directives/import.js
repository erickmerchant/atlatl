'use strict'

var test = require('tap').test

test('test directives/import.js', function (t) {
  t.plan(8)

  var directive = require('../../code/directives/import.js')

  var imports = new Map()
  var imports2 = new Map()
  var dependencies = []

  t.equal('', directive({args: ['one', 'two']}, {dependencies: dependencies, imports: imports}, function (x) {
    t.equal(x, 'two')

    return 'test'
  }))

  imports2.set('one', {
    file: 'two',
    method: 'one'
  })

  t.looseEqual(dependencies, ['test'])

  t.looseEqual(imports2, imports)

  t.equal(directive.minArgs, 2)

  t.equal(directive.maxArgs, 3)

  t.equal(directive.hasParened, false)

  t.equal(directive.requiresParened, false)

  t.end()
})
