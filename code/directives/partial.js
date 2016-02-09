function plugin (context, template, nested) {
  var parened = 'content'
  var method = context.args[0]

  if (context.parened) {
    parened += ', ' + context.parened
  }

  template.methods.set(method, `${method}(${parened}) {
    var output = []
    ${nested()}
    return output
  }`)

  return ''
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = true

plugin.requiresParened = false

module.exports = plugin
