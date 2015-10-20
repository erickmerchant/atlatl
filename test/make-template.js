'use strict'

var mockery = require('mockery')
var test = require('tap').test

test('test make-template.js', function (t) {
  t.plan(2)

  var makeTemplate

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./traverse-lines.js', function () {
    return function () { return [] }
  })

  makeTemplate = require('../code/make-template.js')

  makeTemplate('', function () {}, {}, function (err, code) {
    t.equal(err, null)

    t.equal(code, [ '"use strict"',
    'var escape = require("/Users/erickmerchant/Code/atlatl/code/runtime.js").escape',
    'var safe = require("/Users/erickmerchant/Code/atlatl/code/runtime.js").safe',
    'class Template {',
    'render (content) {',
    '        var output = []',
    '',
    '        ',
    '',
    '        return output.join(\'\\n\')',
    '      }',
    '}',
    'module.exports = Template' ].join('\n'))
  })
})
