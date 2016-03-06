const index = require('./code')
const runtime = require('./code/runtime')

function atlatl (settings) {
  return index(settings)
}

atlatl.runtime = runtime

module.exports = atlatl
