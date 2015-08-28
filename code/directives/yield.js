module.exports = function (context, args) {
  return 'output = output.concat(this.' + args[0] + '(content))'
}
