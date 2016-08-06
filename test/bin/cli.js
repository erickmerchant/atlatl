'use strict'

var mockery = require('mockery')
var test = require('tape')

test('test cli.js', function (t) {
  t.plan(1)

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.equal(1, 1)

  mockery.disable()
})
