'use strict'

const path = require('path')
const runtimePath = path.join(__dirname, 'runtime.js')

module.exports = function (lines, load, directives, callback) {
  const traverseLines = require('./traverse-lines.js')(load, directives)

  var shared = {
    dependencies: [],
    extending: '',
    imports: new Map(),
    methods: new Map()
  }

  var renderCode = traverseLines(shared, lines.split('\n'))

  Promise.all(shared.dependencies)
  .then(function () {
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

    shared.methods.forEach(function (method) {
      code.push(method)
    })

    code.push('}')

    shared.imports.forEach(function (imported, method) {
      if (imported.file && imported.method) {
        code.push('Template.prototype.' + method + ' = require("./' + imported.file + '.js").prototype.' + imported.method)
      }
    })

    code.push('module.exports = Template')

    callback(null, code.join('\n'))
  })
  .catch(callback)
}
