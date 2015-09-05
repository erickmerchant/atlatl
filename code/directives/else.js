function plugin (context) {
  if (['if', 'each'].indexOf(context.parent.directive) < 0) {
    return ''
  }

  return '} else {'
}

plugin.minArgs = 0

plugin.maxArgs = 0

plugin.hasParened = false

plugin.requiresParened = false

module.exports = plugin
