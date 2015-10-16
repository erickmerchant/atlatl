'use strict'

var mockery = require('mockery')
var test = require('tap').test

test('test index.js', function (t) {
  t.plan(2)

  var makeTemplate

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./traverse-lines.js', function () {
    return function (shared) {
      shared.extending = 'Test'

      shared.methods.set('test', 'test () {}')

      shared.imports.set('test', {
        file: 'test-file',
        method: 'testMethod'
      })

      shared.imports.set('foo', {})

      return []
    }
  })

  makeTemplate = require('../code/make-template.js')

  makeTemplate('', function () {}, {}, function (err, code) {
    t.equal(err, null)

    t.equal(code, [ '"use strict"',
    'var escape = require("/Users/erickmerchant/Code/atlatl/code/runtime.js").escape',
    'var safe = require("/Users/erickmerchant/Code/atlatl/code/runtime.js").safe',
    'var ParentTemplate = require("./Test.js")',
    'class Template extends ParentTemplate {',
    'test () {}',
    '}',
    'Template.prototype.test = require("./test-file.js").prototype.testMethod',
    'module.exports = Template' ].join('\n'))
  })
})
