'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

module.exports = function (directory, make) {
  directory = path.resolve(process.cwd(), directory) + '/'

  var promises = {}
  var corePromise = new Promise(function (resolve, reject) {
    mkdirp(path.dirname(directory + 'compiled/code.js'), function (err) {
      if (err) {
        reject(err)
      } else {
        var coreCode = `var safeVals = new Map()

        ${ require('escape-html').toString() }

        module.exports.safe = function safe(val) {
          var result = Symbol()

          safeVals.set(result, val)

          return result
        }
        
        module.exports.escape = function escape (strings) {
          var values = [].slice.call(arguments, 1)
          var result = ''

          strings.forEach(function (val, key) {
            result += val

            if (values[key]) {
              if (typeof values[key] == 'symbol' && safeVals.has(values[key])) {
                result += safeVals.get(values[key])
              } else {
                result += escapeHtml(values[key])
              }
            }
          })

          return result
        }`

        fs.writeFile(directory + 'compiled/.core.js', coreCode, function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(directory + 'compiled/.core.js')
          }
        })
      }
    })
  })

  function read (file, callback) {
    fs.readFile(directory + file, { encoding: 'utf-8' }, callback)
  }

  return function load (name, callback) {
    corePromise.then(function () {
      if (!promises[name]) {
        promises[name] = new Promise(function (resolve, reject) {
          make(directory + 'compiled/', read, load)(name, function (err, result) {
            if (err) {
              reject(err)
            } else {
              mkdirp(path.dirname(directory + 'compiled/' + name + '.js'), function (err) {
                if (err) {
                  reject(err)
                } else {
                  fs.writeFile(directory + 'compiled/' + name + '.js', result.join('\n'), function (err) {
                    if (err) {
                      reject(err)
                    } else {
                      resolve(directory + 'compiled/' + name + '.js')
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
    })
  }
}
