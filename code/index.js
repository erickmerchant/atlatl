'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const defaultRuntime = require('./runtime')
const assign = require('lodash.assign')
const makeTemplate = require('./make-template')
const defaultDirectives = require('./default-directives')

module.exports = function (settings) {
  settings = settings || {}
  settings.cacheDirectory = path.join(process.cwd(), settings.cacheDirectory || './.atlatl-cache/')
  settings.variable = settings.variable || 'content'

  settings.directives = assign({}, defaultDirectives, settings.directives || {})
  var promises = {}

  return function (file, runtime) {
    var directory = path.dirname(file)

    runtime = runtime || defaultRuntime

    settings.load = function (file) {
      var _file = path.join(directory, file)

      if (!promises[_file]) {
        promises[_file] = new Promise(function (resolve, reject) {
          fs.readFile(_file, { encoding: 'utf-8' }, function (err, result) {
            if (err) throw err

            makeTemplate(result.trim(), settings, function (err, result) {
              if (err) throw err

              var cacheFile = path.join(settings.cacheDirectory, file + '.js')

              mkdirp(path.dirname(cacheFile), function (err) {
                if (err) throw err

                fs.writeFile(cacheFile, result, function (err) {
                  if (err) throw err

                  resolve(cacheFile)
                })
              })
            })
          })
        })
      }

      return promises[_file].then(function (path) {
        delete require.cache[path]

        var Template = require(path)(runtime)

        return Promise.resolve(new Template())
      })
    }

    return settings.load(path.basename(file))
  }
}
