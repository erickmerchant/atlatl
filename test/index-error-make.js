'use strict'

var mockery = require('mockery')
var test = require('tap').test

test('test index.js - error on make', function (t) {
  t.plan(6)

  var index
  var load
  var test

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./default-directives.js', {})

  mockery.registerMock('fs', {
    readFile: function (file, options, callback) {
      t.equal(file, process.cwd() + '/templates/test.html')

      t.looseEqual(options, { encoding: 'utf-8' })

      callback(null, '${content.message}')
    }
  })

  mockery.registerMock('./make-template.js', function (result, load, directives, callback) {
    t.equal(result, '${content.message}')

    t.looseEqual(directives, {})

    callback(new Error('test'), '${content.message}')
  })

  index = require('../code/index.js')

  load = index('./templates/', {cacheDirectory: './templates/compiled/'})

  test = load('test.html')

  return test.catch(function (err) {
    t.looseEqual(err, new Error('test'))

    return load('test.html')
    .catch(function (err) {
      t.looseEqual(err, new Error('test'))

      t.end()
    })
  })
  .then(function () {
    t.end(new Error('Error expected'))
  })
})