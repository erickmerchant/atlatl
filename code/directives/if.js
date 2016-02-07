function plugin (context) {
  var parened = context.parened

  return `if (${parened}) {
  ${context.compiled}
  }`
}

plugin.minArgs = 0

plugin.maxArgs = 0

plugin.hasParened = true

plugin.requiresParened = true

plugin.isBlock = true

module.exports = plugin
