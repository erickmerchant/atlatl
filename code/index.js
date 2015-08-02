'use strict'

const loader = require('./loader.js')
const make = require('./make.js')

module.exports = function (directory) {
  return loader(directory, make)
}
