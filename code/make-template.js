'use strict'

module.exports = function (lines, load, directives, callback) {
  const traverse = require('./traverse-lines.js')(lines, load, directives)

  var template = {
    dependencies: [],
    extending: '',
    imports: new Map(),
    methods: new Map()
  }

  var traversed = traverse(template)

  Promise.all(template.dependencies)
  .then(function () {
    if (!template.extending) {
      template.methods.set('render', `render (content) {
        var output = []

        ${traversed}

        return output.join('\\n')
      }`)
    }

    var code = []

    code.push('"use strict"')

    code.push('var template = require("atlatl/code/runtime.js")')
    code.push('var safe = template.safe')

    if (template.extending) {
      code.push('var ParentTemplate = require("./' + template.extending + '.js")')
    }

    code.push('class Template' + (template.extending && ' extends ParentTemplate') + ' {')

    template.methods.forEach(function (method) {
      code.push(method)
    })

    code.push('}')

    template.imports.forEach(function (imported, method) {
      if (imported.file && imported.method) {
        code.push('Template.prototype.' + method + ' = require("./' + imported.file + '.js").prototype.' + imported.method)
      }
    })

    code.push('module.exports = Template')

    callback(null, code.join('\n'))
  })
  .catch(callback)
}
