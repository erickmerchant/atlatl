module.exports = function (context, shared, load) {
  shared.imports[context.args[0]] = context.args.slice(1).join(' ')

  shared.dependencies.push(load(context.args.slice(1).join(' ')))

  return ''
}
