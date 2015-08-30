'use strict'

const path = require('path')
const runtimePath = path.join(__dirname, 'runtime.js')

module.exports = function (lines, load, directives, callback) {
  const traverseLines = require('./traverse-lines.js')(load, directives)

  var shared = {
    dependencies: [],
    extending: '',
    imports: {},
    methods: new Map()
  }

  var renderCode = traverseLines(shared, lines.split('\n'))

  Promise.all(shared.dependencies).then(function () {

    if (!shared.extending) {
      shared.methods.set('render', `render (content) {
        var output = []

        ${ renderCode.join('\n') }

        return output.join('\\n')
      }`)
    }

    var code = []

    code.push('"use strict"')

    code.push('var escape = require("' + runtimePath + '").escape')
    code.push('var safe = require("' + runtimePath + '").safe')

    if (shared.extending) {
      code.push('var ParentTemplate = require("./' + shared.extending + '.js")')
    }

    code.push('class Template' + (shared.extending && ' extends ParentTemplate') + ' {')

    var methods = shared.methods.values()
    var method

    do {
      method = methods.next()

      if (!method.done) {
        code.push(method.value)
      }
    } while (!method.done)

    code.push('}')

    Object.keys(shared.imports).forEach(function (method) {
      code.push('Template.prototype.' + method + ' = require("./' + shared.imports[method] + '.js").prototype.' + method)
    })

    code.push('module.exports = Template')

    callback(null, code)

  }).catch(callback)
}
