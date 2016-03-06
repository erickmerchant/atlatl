'use strict'

var mockery = require('mockery')
var test = require('tap').test

test('test make-template.js - extending', function (t) {
  t.plan(2)

  var makeTemplate

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./traverse-lines', function () {
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

  makeTemplate = require('../code/make-template')

  makeTemplate('', {load: function () {}, directives: {}}, function (err, code) {
    t.equal(err, null)

    t.equal(code, [ '"use strict"',
    'module.exports = function (template) {',
    'var safe = template.safe',
    'var ParentTemplate = require("./Test.js")(template)',
    'class Template extends ParentTemplate {',
    'test () {}',
    '}',
    'Template.prototype.test = require("./test-file.js")(template).prototype.testMethod',
    'return Template',
    '}' ].join('\n'))
  })
})
