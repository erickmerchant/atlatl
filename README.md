# Atlatl

Atlatl is a templating language for CommonJS. So node or browserify as examples. It is inspired by Twig, Swig, and Nunjucks (so Jinja2), and Laravel's Blade. It works by a series of directives. Each directive is an at-sign then the directive and any number of arguments. The types of arguments allowed varies per directive. There is also the ending directive which is a line with just an at-sign. The ending directive is used to close block level directives. Within block level directives code is transformed into ES6 templates. HTML is escaped by default but the `safe` function can be used to mark code to not escape.

## The Directives So Far

### Logic and Loops

#### @each _var_ _val_ [_key_]

Loops through an array. Block level.

#### @else

Used with `@each` or `@if`. With `@each`, if __var__ is empty or is not an array then the code after `@else` is run. With `@if` it acts just like an `else` in any other programming context.

#### @if _condition_

Just like an if in javascript. Block level.

### Embeds

#### @embed _template_

Used to embed another template.

### Methods

#### @call _name arg1 [ arg2[ ...[ argN]]]_

Calls a method. If it is not defined an error will occur.

#### @partial _name arg1 [ arg2[ ...[ argN]]]_

Defines a method that can be called with `@call`. Block level.

#### @section _name_

Defines and calls a method that can be overridden when the template is extended. Or it defines code to override that method in a extending template. Block level.

#### @yield _name_

Defines and calls a method. Great for templates that are meant to be extended.

### Inheritance

#### @extends _template_

Used to extend another template. The methods in the extending template override methods in the extended template. Any code outside of methods is ignored.

#### @import _name_ _template_

Can import partials or sections (any method) from another file.

#### @parent

Calls the extended's method code inside a method in a extending template.

## Caution

A work in progress. Not fit for production. Examples and tests to come.
