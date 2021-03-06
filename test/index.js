'use strict'

var mockery = require('mockery')
var path = require('path')
var test = require('tape')

test('test index.js', function (t) {
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

      callback(null, '${' + 'content.message}')
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

  mockery.registerMock(path.join(process.cwd(), './templates/compiled/test.html.js'), function (runtime) {
    return class {
      render (content) {
        return `${content.message}`
      }
    }
  })

  index = require('../')

  load = index({cacheDirectory: './templates/compiled/'})

  test = load('./templates/test.html')

  return test.then(function (template) {
    t.equal('testing 1 2 3', template.render({message: 'testing 1 2 3'}))

    return load('./templates/test.html')
    .then(function (template) {
      t.equal('testing 1 2 3', template.render({message: 'testing 1 2 3'}))

      mockery.disable()
    })
  })
})
