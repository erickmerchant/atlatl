module.exports = function (context, shared, load) {
  shared.dependencies.push(load(context.args[0]))

  return 'output.push(require("./' + context.args[0] + '.js")(content))'
}
