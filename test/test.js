'use strict'

const atlatl = require('../code/index.js')('./templates/')

atlatl('child.html', function (err) { err && console.error(err) })
atlatl('parent.html', function (err) { err && console.error(err) })
