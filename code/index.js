'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const makeTemplate = require('./make-template.js')
const assign = require('lodash.assign')
const defaultDirectives = {}

;['--', 'call', 'each', 'else', 'extends', 'if', 'import', 'parent', 'partial', 'section', 'yield'].forEach(function (directive) {
  defaultDirectives[directive] = require('./directives/' + directive + '.js')
})

module.exports = function (directory, directives) {
  directory = path.resolve(process.cwd(), directory) + '/'
  directives = assign({}, defaultDirectives, directives || {})

  const compiledDirectory = directory + 'compiled/' + (new Date()).getTime() + '/'
  var promises = {}

  return function load (name) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        fs.readFile(directory + name, { encoding: 'utf-8' }, function (err, result) {
          if (err) {
            reject(err)
          } else {
            makeTemplate(result, load, directives, function (err, result) {
              if (err) {
                reject(err)
              } else {
                mkdirp(path.dirname(compiledDirectory + name + '.js'), function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    fs.writeFile(compiledDirectory + name + '.js', result, function (err) {
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

    return promises[name].then(function (path) {
      var Template = require(path)

      return Promise.resolve(function (content) {
        return (new Template()).render(content)
      })
    })
  }
}
