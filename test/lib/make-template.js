'use strict'

var mockery = require('mockery')
var test = require('tape')

test('test make-template.js', function (t) {
  t.plan(2)

  var makeTemplate

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./traverse-lines', function () {
    return function () { return [] }
  })

  makeTemplate = require('../../lib/make-template')

  makeTemplate('', {load: function () {}, directives: {}, variable: 'content'}, function (err, code) {
    t.equal(err, null)

    t.equal(code, [ '"use strict"',
    'module.exports = function (template) {',
    'var safe = template.safe',
    'class Template {',
    'render (content) { return template`` }',
    '}',
    'return Template',
    '}' ].join('\n'))

    mockery.disable()
  })
})
