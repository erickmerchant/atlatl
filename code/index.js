'use strict'

const load = require('./load.js')
const make = require('./make.js')

module.exports = function (directory) {
  return load(directory, make)
}
