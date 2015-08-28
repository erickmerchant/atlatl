'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const make = require('./make.js')
const assign = require('lodash.assign')
const defaultDirectives = {}

;['--', 'each', 'else', 'embed', 'extends', 'if', 'import', 'parent', 'partial', 'section', 'yield'].forEach(function (directive) {
  defaultDirectives[directive] = require('./directives/' + directive + '.js')
})

module.exports = function (directory, directives) {

  directory = path.resolve(process.cwd(), directory) + '/'
  directives = assign({}, defaultDirectives, directives || {})

  const compiledDirectory = directory + 'compiled/'
  var promises = {}

  return function load (name, callback) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        fs.readFile(directory + name, { encoding: 'utf-8' }, function (err, result) {
          if (err) {
            reject(err)
          } else {
            make(result, load, directives, function (err, result) {
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
      var Template = require(path)

      callback(null, function (content) {
        return (new Template()).render(content)
      })
    }).catch(callback)
  }
}
