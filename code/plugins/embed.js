module.exports = function (context, args, compiled, load) {
  context.dependencies.push(new Promise(function (resolve, reject) {
    load(args[0], function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  }))

  return 'output.push(require("./' + args[0] + '.js")(content))'
}
