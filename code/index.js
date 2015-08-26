'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const make = require('./make.js')
const defaultPlugins = {}
const assign = require('lodash.assign')

;['--', 'each', 'else', 'embed', 'extends', 'if', 'import', 'parent', 'partial', 'section', 'set', 'yield'].forEach(function (plugin) {
  defaultPlugins[plugin] = require('./plugins/' + plugin + '.js')
})

module.exports = function (directory, plugins) {

  directory = path.resolve(process.cwd(), directory) + '/'
  plugins = assign({}, defaultPlugins, plugins || {})

  const compiledDirectory = directory + 'compiled/'
  var promises = {}

  return function load (name, callback) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        fs.readFile(directory + name, { encoding: 'utf-8' }, function (err, result) {
          if (err) {
            reject(err)
          } else {
            make(result, load, plugins, function (err, result) {
              if (err) {
                reject(err)
              } else {
                mkdirp(path.dirname(compiledDirectory + name + '.js'), function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    fs.writeFile(compiledDirectory + name + '.js', result.join('\n'), function (err) {
                      if (err) throw err

                      resolve(compiledDirectory + name + '.js')
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
  }
}
