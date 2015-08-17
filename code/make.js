'use strict'

module.exports = function (name, template, directory, load, callback) {
  var lines = template.split('\n')
  var renderCode = []
  var extending = false
  var dependencies = []
  var sections = []
  var partials = []
  var imports = []
  var vars = []
  var ends = []

  renderCode = renderCode.concat(compile(lines))

  Promise.all(dependencies).then(function () {

    if (!extending) {
      sections.push(`render(content) {
        var output = []

        ${ renderCode.join('\n') }

        return output.join('\\n')
      }`)
    }

    var code = []

    code.push('"use strict"')

    code.push('var escape = require("atlatl/code/core.js").escape')
    code.push('var safe = require("atlatl/code/core.js").safe')

    Object.keys(imports).forEach(function (k) {
      code.push('var ' + k + ' = require("' + directory + imports[k] + '.js").partials.' + k)
    })

    if (vars.length) {
      code.push('var ' + vars.join(', '))
    }

    if (extending) {
      code.push('var ParentSections = require("' + directory + extending + '.js").Sections')
    }

    code.push('class Sections' + (extending ? ' extends ParentSections' : '') + ' {')

    code = code.concat(sections)

    code.push('}')

    code = code.concat(Object.keys(partials).map(function (k) {
      return partials[k]
    }))

    code.push('function render(content) { return (new Sections()).render(content) }')

    code.push('render.Sections = Sections')

    code.push('render.partials = {}')

    Object.keys(partials).forEach(function (k) {
      code.push('render.partials.' + k + ' = ' + k)
    })

    code.push('module.exports = render')

    callback(null, code)

  }).catch(callback)

  function compile (lines) {
    var code = []

    while (lines.length) {
      let line = lines.shift()
      let trimmed = line.trim()
      let parts = trimmed.substr(1).split(/\s+/)
      let directive = parts[0]
      let args = parts.slice(1)
      let arg0 = args[0]
      let func = []
      let level

      if (trimmed.startsWith('@')) {
        if (trimmed === '@') {
          code.push(ends.shift())
        } else {
          if (['section', 'partial', '--'].indexOf(directive) > -1) {
            level = 1
            while (level) {
              let line = lines.shift() || ''
              let trimmed = line.trim()

              if (trimmed === '@') {
                level -= 1
                if (level) {
                  func.push(line)
                }
              } else {
                if (trimmed.startsWith('@') && ['--', 'if', 'each', 'section', 'partial'].indexOf(trimmed.substr(1).split(/\s+/)[0]) > -1) {
                  level += 1
                }

                func.push(line)
              }
            }
          }

          switch (directive) {
            case '--':
              break

            case 'extends':
              extending = arg0
              dependencies.push(new Promise(function (resolve, reject) {
                load(arg0, function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve()
                  }
                })
              }))
              break

            case 'embed':
              code.push('output.push(require("' + directory + arg0 + '.js")(content))')
              dependencies.push(new Promise(function (resolve, reject) {
                load(arg0, function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve()
                  }
                })
              }))
              break

            case 'set':
              code.push(arg0 + ' = ' + args.slice(1).join(' '))
              vars.push(arg0)
              break

            case 'yield':
              code.push('output = output.concat(this.' + arg0 + '(content))')
              break

            case 'parent':
              code.push('output = output.concat(super(content))')
              break

            case 'section':
              code.push('output = output.concat(this.' + arg0 + '(content))')
              sections.push(`${ arg0 }(content) {
                var output = []
                ${ compile(func).join('\n') }
                return output
              }`)
              break

            case 'import':
              imports[arg0] = args.slice(1).join(' ')
              dependencies.push(new Promise(function (resolve, reject) {
                load(args.slice(1).join(' '), function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve()
                  }
                })
              }))
              break

            case 'partial':
              if (!partials[arg0]) {
                partials[arg0] = `function ${ arg0 }(${ args.slice(1).join(', ') }) {
                  var output = []
                  ${ compile(func).join('\n') }
                  return safe(output.join('\\n'))
                }`
              }
              break

            case 'each':
              code.push('if (Array.isArray(' + arg0 + ') && ' + arg0 + '.length) { output = output.concat(' + arg0 + '.map(function(' + args.slice(1).join(', ') + ') { var output = [] ')
              ends.unshift("return output.join('\\n') })) }")
              break

            case 'if':
              code.push('if(' + args.join(' ') + ') {')
              ends.unshift('}')
              break

            case 'elseif':
              if (ends.length) {
                code.push(ends.shift())
              } else {
                code.push('if (false) {')
              }
              code.push('else if(' + args.join(' ') + ') {')
              ends.unshift('}')
              break

            case 'else':
              if (ends.length) {
                code.push(ends.shift())
              } else {
                code.push('if (false) {')
              }
              code.push('else {')
              ends.unshift('}')
              break
          }
        }
      } else if (line.trim().length) {
        if (line.trim().substring(0, 2) === '\\@') {
          let index = line.indexOf('\\')

          line = line.substring(0, index) + line.substring(index + 1)
        }

        code.push('output.push(escape`' + line.replace('`', '\\`') + '`)')
      }
    }

    return code
  }
}
