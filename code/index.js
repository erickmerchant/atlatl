'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const assign = require('lodash.assign')
const makeTemplate = require('./make-template.js')
const defaultDirectives = require('./default-directives.js')

module.exports = function (directory, settings) {
  settings = settings || {}
  directory = path.resolve(process.cwd(), directory) + '/'

  var directives = assign({}, defaultDirectives, settings.directives || {})
  const compiledDirectory = settings.cacheDirectory || directory + 'compiled/' + (new Date()).getTime() + '/'
  var promises = {}

  return function load (name) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        fs.readFile(directory + name, { encoding: 'utf-8' }, function (err, result) {
          if (err) throw err

          makeTemplate(result, load, directives, function (err, result) {
            if (err) throw err

            mkdirp(path.dirname(compiledDirectory + name + '.js'), function (err) {
              if (err) throw err

              fs.writeFile(compiledDirectory + name + '.js', result, function (err) {
                if (err) throw err

                resolve(compiledDirectory + name + '.js')
              })
            })
          })
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
