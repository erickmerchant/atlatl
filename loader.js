'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

module.exports = function (directory, make) {
  directory = path.resolve(process.cwd(), directory) + '/'

  var promises = {}
  var now = Date.now()
  var loader = function (name, callback) {
    fs.readFile(directory + name + '.html', { encoding: 'utf-8' }, callback)
  }

  return function (name, callback) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        make(loader)(name, {}, function (err, result) {
          if (err) {
            reject(err)
          } else {
            mkdirp(directory + 'compiled/' + now + '/', function (err) {
              if (err) {
                reject(err)
              } else {
                result = 'module.exports = ' + result

                fs.writeFile(directory + 'compiled/' + now + '/' + name + '.js', result, function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve('require("' + directory + 'compiled/' + now + '/' + name + '.js")')
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

      callback(null, template)
    }).catch(callback)
  }
}
