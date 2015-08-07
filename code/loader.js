'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

module.exports = function (directory, partials, make) {
  directory = path.resolve(process.cwd(), directory) + '/'
  partials = partials || []

  var promises = {}
  var now = Date.now()
  var loader = function (file, callback) {
    fs.readFile(directory + file, { encoding: 'utf-8' }, callback)
  }

  return function (name, callback) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        var extensions = { partials: {} }

        partials.forEach(function (partial) {
          if (partial.name) {
            extensions.partials[partial.name] = partial
          }
        })

        make(loader)(name, extensions, function (err, result) {
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
                    resolve(directory + 'compiled/' + now + '/' + name + '.js')
                  }
                })
              }
            })
          }
        })
      })
    }

    promises[name].then(function (path) {
      var template = require(path)

      callback(null, template)
    }).catch(callback)
  }
}
