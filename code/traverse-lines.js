'use strict'

module.exports = function (load, directives) {
  return function traverse (shared, lines, parent, parentArgs) {
    var code = []

    while (lines.length) {
      if (lines[0].trim().startsWith('@')) {
        let line = lines.shift()
        let trimmed = line.trim()
        let parts = trimmed.substr(1).split(/\s+/)
        let directive = parts[0]
        let args = parts.slice(1)
        let nested = []
        let level
        let compiled

        if (directives[directive]) {
          if (directives[directive].isBlock) {
            level = 1
            while (level) {
              let line = lines.shift() || ''
              let trimmed = line.trim()

              if (trimmed === '@') {
                level -= 1
                if (level) {
                  nested.push(line)
                }
              } else {
                if (trimmed.startsWith('@')) {
                  let sub = trimmed.substr(1).split(/\s+/)[0]

                  if (directives[sub] && directives[sub].isBlock) {
                    level += 1
                  }
                }

                nested.push(line)
              }
            }
          }

          if (!directives[directive].isComment) {
            compiled = traverse(shared, nested, directive, args).join('\n')
          } else {
            compiled = '/*\n' + nested.join('\n') + '\n*/'
          }

          code.push(directives[directive]({
            compiled: compiled,
            args: args,
            parent: parent,
            parentArgs: parentArgs
          }, shared, load))

        } else {
          throw new Error('Directive ' + directive + ' not found')
        }
      } else {
        let literal = []

        do {
          let line = lines.shift()

          if (line.trim().substring(0, 2) === '\\@') {
            let index = line.indexOf('\\')

            line = line.substring(0, index) + line.substring(index + 1)
          }

          literal.push(line)
        } while (lines.length && !lines[0].trim().startsWith('@'))

        code.push('output.push(escape`' + literal.join('\n').replace('`', '\\`') + '`)')
      }
    }

    return code
  }
}
