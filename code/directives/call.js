function plugin (context) {
  var parened = 'content'
  var method = context.args[0]

  if (context.parened) {
    parened += ', ' + context.parened
  }

  return 'output = output.concat(this.' + method + '(' + parened + '))'
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = true

plugin.requiresParened = false

module.exports = plugin
