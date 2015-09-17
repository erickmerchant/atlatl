var mockery = require('mockery')
var tape = require('tape')
var path = require('path')

tape('test index.js', function (t) {
  var directory = './templates/'
  var index
  var load

  t.plan(2)

  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('fs', {
    readFile: function (file, options, callback) {
      t.equal(file, path.resolve(process.cwd(), directory) + '/' + 'test')

      t.looseEqual(options, { encoding: 'utf-8' })
    }
  })

  index = require('../code/index.js')

  load = index(directory)

  load('test')
})
