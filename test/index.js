'use strict'

var mockery = require('mockery')

module.exports = function (t, expectedErrors) {
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

      callback((expectedErrors === 'read') ? new Error('test') : null, '${content.message}')
    },
    writeFile: function (file, result, callback) {
      t.equal(file, './templates/compiled/test.html.js')

      t.equal(result, '${content.message}')

      callback((expectedErrors === 'write') ? new Error('test') : null, '${content.message}')
    }
  })

  mockery.registerMock('./make-template.js', function (result, load, directives, callback) {
    t.equal(result, '${content.message}')

    t.looseEqual(directives, {})

    callback((expectedErrors === 'make') ? new Error('test') : null, '${content.message}')
  })

  mockery.registerMock('mkdirp', function (directory, callback) {
    t.equal(directory, './templates/compiled')

    callback((expectedErrors === 'directory') ? new Error('test') : null)
  })

  mockery.registerMock('./templates/compiled/test.html.js', class {
    render (content) {
      return `${content.message}`
    }
  })

  index = require('../code/index.js')

  load = index('./templates/', {cacheDirectory: './templates/compiled/'})

  test = load('test.html')

  if (!expectedErrors) {
    test = test.then(function (template) {
      t.equal('testing 1 2 3', template({message: 'testing 1 2 3'}))
    })
  } else {
    test = test.catch(function (err) {
      t.looseEqual(err, new Error('test'))
    })
  }

  test.then(function () {
    var test = load('test.html')

    if (!expectedErrors) {
      test.then(function (template) {
        t.equal('testing 1 2 3', template({message: 'testing 1 2 3'}))
      })
    } else {
      test.catch(function (err) {
        t.looseEqual(err, new Error('test'))
      })
    }

    test.then(function () {
      t.end()
    })
  })
}
