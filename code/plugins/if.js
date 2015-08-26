function plugin (context, args, compiled, load) {
  return `if(${ args.join(' ') }) {
  ${ compiled }
  }`
}

plugin.block = true

module.exports = plugin
