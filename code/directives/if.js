function plugin (context, template, nested) {
  var parened = context.parened

  return `if (${parened}) {
  ${nested()}
  }`
}

plugin.minArgs = 0

plugin.maxArgs = 0

plugin.hasParened = true

plugin.requiresParened = true

module.exports = plugin
