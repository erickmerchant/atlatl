function plugin (context, args, compiled, load) {
  return `if(${ args.join(' ') }) {
  ${ compiled }
  }`
}

plugin.isBlock = true

module.exports = plugin
