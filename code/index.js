'use strict'

const loader = require('./loader.js')
const make = require('./make.js')

module.exports = function (directory, partials) {
  return loader(directory, partials, make)
}
