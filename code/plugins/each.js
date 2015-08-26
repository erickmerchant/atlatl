function plugin (context, args, compiled, load) {
  return `if (Array.isArray(${ args[0] }) && ${ args[0] }.length) { output = output.concat(${ args[0] }.map(function(${ args.slice(1).join(', ') }) { var output = []
  ${ compiled }
  return output.join('\\n') })) }`
}

plugin.block = true

module.exports = plugin
