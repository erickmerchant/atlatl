function plugin (context) {
  if (['if', 'each'].indexOf(context.parent.directive) < 0) {
    return ''
  }

  if (context.parened) {
    return `} else if (${context.parened}) {`
  }

  return '} else {'
}

plugin.minArgs = 0

plugin.maxArgs = 0

plugin.hasParened = true

plugin.requiresParened = false

module.exports = plugin
