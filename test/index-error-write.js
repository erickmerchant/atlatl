'use strict'

var mockery = require('mockery')
var path = require('path')
var test = require('tape')

test('test index.js - error on write', function (t) {
  t.plan(9)

  var index
  var load
  var test

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./lib/default-directives', {})

  mockery.registerMock('fs', {
    readFile: function (file, options, callback) {
      t.equal(file, 'templates/test.html')

      t.looseEqual(options, { encoding: 'utf-8' })

      callback(null, '${' + 'content.message}')
    },
    writeFile: function (file, result, callback) {
      t.equal(file, path.join(process.cwd(), 'templates/compiled/test.html.js'))

      t.equal(result, '${' + 'content.message}')

      callback(new Error('test'), '${' + 'content.message}')
    }
  })

  mockery.registerMock('./lib/make-template', function (result, settings, callback) {
    t.equal(result, '${' + 'content.message}')

    t.looseEqual(settings.directives, {})

    callback(null, '${' + 'content.message}')
  })

  mockery.registerMock('mkdirp', function (directory, callback) {
    t.equal(directory, path.join(process.cwd(), 'templates/compiled'))

    callback(null)
  })

  mockery.registerMock(path.join(process.cwd(), './templates/compiled/test.html.js'), class {
    render (content) {
      return `${content.message}`
    }
  })

  index = require('../')

  load = index({cacheDirectory: './templates/compiled/'})

  test = load('./templates/test.html')

  return test.catch(function (err) {
    t.looseEqual(err, new Error('test'))

    return load('./templates/test.html')
    .catch(function (err) {
      t.looseEqual(err, new Error('test'))

      mockery.disable()
    })
  })
})
