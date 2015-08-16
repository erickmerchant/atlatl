'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const make = require('./make.js')

module.exports = function (directory) {
  directory = path.resolve(process.cwd(), directory) + '/'

  const coreFile = directory + 'compiled/.core.js'
  const compiledDirectory = directory + 'compiled/'
  var promises = {}

  var corePromise = new Promise(function (resolve, reject) {
    mkdirp(path.dirname(coreFile), function (err) {
      if (err) {
        reject(err)
      } else {
        let coreCode = `var safeVals = new Map()
        var replacements = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '\\'': '&#39;'
        }
        var replacex = new RegExp(Object.keys(replacements).join('|'), 'g')

        function replacer (match) {
          return replacements[match]
        }

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
                result += new String(values[key]).replace(replacex, replacer)
              }
            }
          })

          return result
        }`

        fs.writeFile(coreFile, coreCode, function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(coreFile)
          }
        })
      }
    })
  })

  return function load (name, callback) {
    corePromise.then(function () {
      if (!promises[name]) {
        promises[name] = new Promise(function (resolve, reject) {
          fs.readFile(directory + name, { encoding: 'utf-8' }, function (err, template) {
            if (err) {
              reject(err)
            } else {
              make(name, template, compiledDirectory, load, function (err, result) {
                if (err) {
                  reject(err)
                } else {
                  mkdirp(path.dirname(compiledDirectory + name + '.js'), function (err) {
                    if (err) {
                      reject(err)
                    } else {
                      fs.writeFile(compiledDirectory + name + '.js', result.join('\n'), function (err) {
                        if (err) {
                          reject(err)
                        } else {
                          resolve(compiledDirectory + name + '.js')
                        }
                      })
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
