'use strict'

var test = require('tap').test

test('test directives/import.js', function (t) {
  t.plan(10)

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

  t.equal('', directive({args: ['one2', 'two2', 'three2']}, {dependencies: dependencies, imports: imports}, function (x) {
    t.equal(x, 'two2')

    return 'test2'
  }))

  imports2.set('three2', {
    file: 'two2',
    method: 'one2'
  })

  t.looseEqual(dependencies, ['test', 'test2'])

  t.looseEqual(imports2, imports)

  t.equal(directive.minArgs, 2)

  t.equal(directive.maxArgs, 3)

  t.equal(directive.hasParened, false)

  t.equal(directive.requiresParened, false)
})
