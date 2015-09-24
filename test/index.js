'use strict'

var mockery = require('mockery')
var tape = require('tape')
const NO_ERRORS = 0b0
const ERROR_READ = 0b1
const ERROR_MAKE = 0b10
const ERROR_DIRECTORY = 0b100
const ERROR_WRITE = 0b1000
const testError = new Error('testing')

tape('test index.js', function (t) {
  testIt(t, NO_ERRORS)
})

tape('test index.js - error on read', function (t) {
  testIt(t, ERROR_READ)
})

tape('test index.js - error on make', function (t) {
  testIt(t, ERROR_MAKE)
})

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
  useCleanCache: true
})

tape('test index.js - error on make', function (t) {
  testIt(t, ERROR_DIRECTORY)
})

tape('test index.js - error on make', function (t) {
  testIt(t, ERROR_WRITE)
})

function testIt (t, expectedErrors) {
  var index
  var load

  mockery.registerMock('./default-directives.js', {})

  mockery.registerMock('fs', {
    readFile: function (file, options, callback) {
      t.equal(file, process.cwd() + '/templates/test.html')

      t.looseEqual(options, { encoding: 'utf-8' })

      callback((expectedErrors & ERROR_READ) ? testError : null, 'testing')
    },
    writeFile: function (file, result, callback) {
      t.equal(file, './templates/compiled/test.html.js')

      t.equal(result, 'testing')

      callback((expectedErrors & ERROR_WRITE) ? testError : null, 'testing')
    }
  })

  mockery.registerMock('./make-template.js', function (result, load, directives, callback) {
    t.equal(result, 'testing')

    t.looseEqual(directives, {})

    callback((expectedErrors & ERROR_MAKE) ? testError : null, 'testing')
  })

  mockery.registerMock('mkdirp', function (directory, callback) {
    t.equal(directory, './templates/compiled')

    callback((expectedErrors & ERROR_DIRECTORY) ? testError : null)
  })

  mockery.registerMock('./templates/compiled/test.html.js', class {
    render (content) {
      return 'testing render'
    }
  })

  index = require('../code/index.js')

  load = index('./templates/', {cacheDirectory: './templates/compiled/'})

  load('test.html')
  .then(function () {
    mockery.deregisterAll()

    t.end()
  })
  .catch(function (err) {
    t.looseEqual(err, testError)

    mockery.deregisterAll()

    t.end()
  })
}
