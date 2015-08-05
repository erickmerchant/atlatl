'use strict'

module.exports = function (loader) {
  return function make (name, extensions, callback) {
    loader(name, function (err, template) {
      var lines = template.split(/\s*(@.*)\n/g)
      var code = [`function (content) {
          var output = []
      `]
      var inherits = false
      var embeds = []
      var sections = extensions.sections || []
      var partials = extensions.partials || []
      var vars = extensions.vars || []
      var ends = []

      if (err) {
        callback(err)
      } else {
        code = code.concat(compile(lines))

        Promise.all(embeds).then(function (embeds) {
          if (!inherits) {
            if (vars.length) {
              code.splice(1, 0, 'var ' + vars.join(', '))
            }

            if (embeds.length) {
              code.splice(1, 0, 'var embeds')

              embeds.forEach(function (embed) {
                code.splice(2, 0, embed)
              })
            }

            code = code.concat(Object.keys(partials).map(function (k) {
              return partials[k]
            }))

            code = code.concat(sections)

            code.push("return output.join('\\n')", '}')

            callback(null, code.join('\n'))
          } else {
            make(inherits, {
              name: name,
              sections: sections,
              partials: partials,
              vars: vars
            }, callback)
          }
        }).catch(callback)
      }

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
              if (['section', 'partial'].indexOf(directive) > -1) {
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
                    if (trimmed.startsWith('@') && ['if', 'each', 'section', 'partial'].indexOf(trimmed.substr(1).split(/\s+/)[0]) > -1) {
                      level += 1
                    }

                    func.push(line)
                  }
                }
              }

              switch (directive) {
                case 'extends':
                  inherits = arg0
                  break

                case 'embed':
                  code.push('output.push(embeds["' + arg0 + '"]())')
                  embeds.push(new Promise(function (resolve, reject) {
                    make(arg0, {}, function (err, result) {
                      if (err) {
                        reject(err)
                      } else {
                        result = 'embeds["' + arg0 + '"] = ' + result

                        resolve(result)
                      }
                    }, true)
                  }))
                  break

                case 'set':
                  code.push(arg0 + ' = ' + args.slice(1).join(' '))
                  vars.push(arg0)
                  break

                case 'yield':
                  code.push('output = output.concat(' + arg0 + '())')
                  break

                case 'parent':
                  code.push('output = output.concat(parent_' + arg0 + '())')
                  break

                case 'section':
                  code.push('output = output.concat(' + arg0 + '())')
                  sections.forEach(function (code) {
                    if (code.startsWith(`function ${ arg0 }() {`)) {
                      arg0 = 'parent_' + arg0
                    }
                  })
                  sections.push(`function ${ arg0 }() {
                    var output = []
                    ${ compile(func).join('\n') }
                    return output
                  }`)
                  break

                case 'partial':
                  if (!partials[arg0]) {
                    partials[arg0] = `function ${ arg0 }(${ args.slice(1).join(', ') }) {
                      var output = []
                      ${ compile(func).join('\n') }
                      return output.join('\\n')
                    }`
                  }
                  break

                case 'each':
                  code.push('if (Array.isArray(' + arg0 + ')) { output = output.concat(' + arg0 + '.map(function(' + args.slice(1).join(', ') + ') { var output = [] ')
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
            code.push('output.push(`' + line.replace('`', '\\`') + '`)')
          }
        }

        return code
      }
    })
  }
}
