'use strict'

var mockery = require('mockery')
var test = require('tap').test

test('test index.js - error on write', function (t) {
  t.plan(9)

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
    },
    writeFile: function (file, result, callback) {
      t.equal(file, './templates/compiled/test.html.js')

      t.equal(result, '${content.message}')

      callback(new Error('test'), '${content.message}')
    }
  })

  mockery.registerMock('./make-template.js', function (result, load, directives, callback) {
    t.equal(result, '${content.message}')

    t.looseEqual(directives, {})

    callback(null, '${content.message}')
  })

  mockery.registerMock('mkdirp', function (directory, callback) {
    t.equal(directory, './templates/compiled')

    callback(null)
  })

  mockery.registerMock('./templates/compiled/test.html.js', class {
    render (content) {
      return `${content.message}`
    }
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
