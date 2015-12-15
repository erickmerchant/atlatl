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
  settings.cacheDirectory = settings.cacheDirectory || directory + 'compiled/'

  var directives = assign({}, defaultDirectives, settings.directives || {})
  var promises = {}

  return function load (name) {
    if (!promises[name]) {
      promises[name] = new Promise(function (resolve, reject) {
        fs.readFile(directory + name, { encoding: 'utf-8' }, function (err, result) {
          if (err) throw err

          makeTemplate(result, load, directives, function (err, result) {
            if (err) throw err

            mkdirp(path.dirname(settings.cacheDirectory + name + '.js'), function (err) {
              if (err) throw err

              fs.writeFile(settings.cacheDirectory + name + '.js', result, function (err) {
                if (err) throw err

                resolve(settings.cacheDirectory + name + '.js')
              })
            })
          })
        })
      })
    }

    return promises[name].then(function (path) {
      delete require.cache[path]

      var Template = require(path)

      return Promise.resolve(function (content) {
        return (new Template()).render(content)
      })
    })
  }
}
