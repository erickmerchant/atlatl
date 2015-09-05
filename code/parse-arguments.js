module.exports = function (string) {
  var parsed = string.match(/^(.*?)(\(.*\))?$/)
  var args = parsed[1].trim().split(/\s+/g)
  var directive = args[0] || ''
  var parened = false

  args = args.slice(1)

  if (parsed[2]) {
    parened = parsed[2].substr(1, parsed[2].length - 2)
  }

  return {args: args, parened: parened, directive: directive}
}
