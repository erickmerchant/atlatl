function plugin (context, template, nested) {
  var collection = context.args[0]
  var parened = context.parened

  return `if (Array.isArray(${collection}) && ${collection}.length) { output = output.concat(${collection}.map(function(${parened}) { var output = []
  ${nested()}
  return output.join('\\n') }, this)) }`
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = true

plugin.requiresParened = true

module.exports = plugin
