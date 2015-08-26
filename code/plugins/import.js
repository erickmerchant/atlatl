module.exports = function (context, args, compiled, load) {
  context.imports[args[0]] = args.slice(1).join(' ')
  context.dependencies.push(new Promise(function (resolve, reject) {
    load(args.slice(1).join(' '), function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  }))

  return ''
}
