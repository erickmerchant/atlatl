function plugin (context) {
  return `if (Array.isArray(${ context.args[0] }) && ${ context.args[0] }.length) { output = output.concat(${ context.args[0] }.map(function(${ context.args.slice(1).join(', ') }) { var output = []
  ${ context.compiled }
  return output.join('\\n') }, this)) }`
}

plugin.isBlock = true

module.exports = plugin
