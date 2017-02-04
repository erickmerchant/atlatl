#!/usr/bin/env node
'use strict'

const command = require('sergeant/command')()
const assert = require('assert')
const chalk = require('chalk')
const atlatl = require('../index')
const thenify = require('thenify')
const glob = thenify(require('glob'))
const chokidar = require('chokidar')

command
.describe('compile Atlatl templates')
.option('cache-directory', 'directory to place the compiled templates')
.option('directives', 'a sub-args map of additional directives to use')
.option('variable', 'the variable that\'s used in templates')
.option('watch', 'watch for changes')
.parameter('templates', 'glob to find all templates')
.action(function (args) {
  var settings = {}
  var result

  assert.ok(args.has('templates'), 'templates is required')

  assert.equal(typeof args.get('templates'), 'string', 'templates must be a string')

  if (args.has('cache-directory')) {
    assert.equal(typeof args.get('cache-directory'), 'string', 'cache-directory must be a string')

    settings.cacheDirectory = args.get('cache-directory')
  }

  if (args.has('directives')) {
    assert.ok(args.get('directives') instanceof Map, 'directives must be a map')

    settings.directives = {}

    args.get('directives').forEach(function (val, key) {
      settings.directives[key] = require(val)
    })
  }

  if (args.has('variable')) {
    assert.equal(typeof args.get('variable'), 'string', 'variable must be a string')

    settings.variable = args.get('variable')
  }

  result = compile()

  if (args.has('watch')) {
    chokidar
    .watch(args.get('templates'), {ignoreInitial: true})
    .on('all', function () {
      compile().catch(function (e) {
        throw e
      })
    })
  }

  return result

  function compile () {
    var engine = atlatl(settings || {})

    return glob(args.get('templates')).then(function (files) {
      return Promise.all(files.map(function (file) {
        return engine(file)
        .then(function (template) {
          console.log('compiled ' + chalk.green(file))
        })
      }))
    })
    .catch(function (e) {
      console.error(chalk.red(e))
    })
  }
})

command.run()
