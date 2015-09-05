function plugin (context) {
  var method = ''
  var parened = 'content'

  if (context.parened) {
    parened += ', ' + context.parened
  }

  if (context.args.length) {
    method = '.' + context.args[0]
  }

  return 'output = output.concat(super' + method + '(' + parened + '))'
}

plugin.minArgs = 0

plugin.maxArgs = 1

plugin.hasParened = true

plugin.requiresParened = false

module.exports = plugin
