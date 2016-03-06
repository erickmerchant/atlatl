'use strict'

var mockery = require('mockery')
var test = require('tap').test

test('test index.js - error on read', function (t) {
  t.plan(4)

  var index
  var load
  var test

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./default-directives', {})

  mockery.registerMock('fs', {
    readFile: function (file, options, callback) {
      t.equal(file, 'templates/test.html')

      t.looseEqual(options, { encoding: 'utf-8' })

      callback(new Error('test'), '${content.message}')
    }
  })

  index = require('../code')

  load = index({cacheDirectory: './templates/compiled/'})

  test = load('./templates/test.html')

  return test.catch(function (err) {
    t.looseEqual(err, new Error('test'))

    return load('./templates/test.html')
    .catch(function (err) {
      t.looseEqual(err, new Error('test'))
    })
  })
})
