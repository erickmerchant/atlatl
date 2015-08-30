module.exports = function (context, shared, load) {
  shared.extending = context.args[0]

  shared.dependencies.push(load(context.args[0]))

  return ''
}
