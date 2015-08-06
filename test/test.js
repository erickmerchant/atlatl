'use strict'

const atlatl = require('../code/index.js')('./templates/', [
  function test () {
    return 'test'
  }
])

atlatl('parent.html', function (err) { err && console.error(err) })
atlatl('child.html', function (err) { err && console.error(err) })
