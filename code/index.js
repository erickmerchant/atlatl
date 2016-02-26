'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const defaultRuntime = require('./runtime.js')
const assign = require('lodash.assign')
const makeTemplate = require('./make-template.js')
const defaultDirectives = require('./default-directives.js')

module.exports = function (settings) {
  settings = settings || {}
  settings.cacheDirectory = path.join(process.cwd(), settings.cacheDirectory || './.atlatl-cache/')

  var directives = assign({}, defaultDirectives, settings.directives || {})
  var promises = {}

  return function (file, runtime) {
    var directory = path.dirname(file)

    runtime = runtime || defaultRuntime

    function load (file) {
      var _file = path.join(directory, file)

      if (!promises[_file]) {
        promises[_file] = new Promise(function (resolve, reject) {
          fs.readFile(_file, { encoding: 'utf-8' }, function (err, result) {
            if (err) throw err

            makeTemplate(result.trim(), load, directives, function (err, result) {
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

        return Promise.resolve(function (content) {
          return (new Template()).render(content)
        })
      })
    }

    return load(path.basename(file))
  }
}
