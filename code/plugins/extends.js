module.exports = function (context, args, compiled, load) {
  context.extending = args[0]
  context.dependencies.push(new Promise(function (resolve, reject) {
    load(args[0], function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  }))

  return ''
}
