module.exports = function (context, args) {
  context.vars.push(args[0])

  return args[0] + ' = ' + args.slice(1).join(' ')
}
