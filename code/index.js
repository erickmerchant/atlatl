'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const make = require('./make.js')

module.exports = function (directory) {
  directory = path.resolve(process.cwd(), directory) + '/'

  const compiledDirectory = directory + 'compiled/'
  var promises = {}

  return function load (name, callback) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        try {
          fs.readFile(directory + name, { encoding: 'utf-8' }, function (err, result) {
            if (err) throw err

            make(result, load, function (err, result) {
              if (err) throw err

              mkdirp(path.dirname(compiledDirectory + name + '.js'), function (err) {
                if (err) throw err

                fs.writeFile(compiledDirectory + name + '.js', result.join('\n'), function (err) {
                  if (err) throw err

                  resolve(compiledDirectory + name + '.js')
                })
              })
            })
          })
        } catch (err) {
          reject(err)
        }
      })
    }

    promises[name].then(function (path) {
      var template = require(path)

      callback(null, template)
    }).catch(callback)
  }
}
