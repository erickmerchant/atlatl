'use strict'

// var mockery = require('mockery')
var test = require('tap').test

test('test index.js', function (t) {
  t.plan(1)

  var traverse = require('../code/traverse-lines.js')(function () {}, {
    'test': function () {
      return ''
    }
  })

  t.deepEqual([''], traverse({}, ['@test']))
})
