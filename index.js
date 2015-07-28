'use strict'

var make = require('./make.js')
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')

module.exports = function (directory) {
  directory = path.resolve(process.cwd(), directory) + '/'

  var promises = {}
  var now = Date.now()
  var loader = function (name, callback) {
    fs.readFile(directory + name + '.html', { encoding: 'utf-8' }, callback)
  }

  return function (name, content, callback) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        make(name, loader, function (err, result) {
          if (err) {
            reject(err)
          } else {
            mkdirp(directory + 'compiled/' + now + '/', function (err) {
              if (err) {
                reject(err)
              } else {
                fs.writeFile(directory + 'compiled/' + now + '/' + name + '.js', result, function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve()
                  }
                })
              }
            })
          }
        })
      })
    }

    promises[name].then(function () {
      var template = require(directory + 'compiled/' + now + '/' + name + '.js')

      var result = template(content)

      callback(null, result)
    }).catch(callback)
  }

}
