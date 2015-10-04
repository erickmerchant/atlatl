function plugin (context, shared) {
  var parened = 'content'
  var method = context.args[0]

  if (context.parened) {
    parened += ', ' + context.parened
  }

  shared.methods.set(method, `${ method }(${ parened }) {
    var output = []
    ${ context.compiled }
    return output
  }`)

  return ''
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = true

plugin.requiresParened = false

plugin.isBlock = true

module.exports = plugin
