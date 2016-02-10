const assert = require('assert')

function plugin (context) {
  assert.ok(context.args.length === 0, 'Exactly zero args allowed')

  if (['if', 'each'].indexOf(context.parent.directive) < 0) {
    return ''
  }

  if (context.parened) {
    return `} else if (${context.parened}) {`
  }

  return '} else {'
}

module.exports = plugin
