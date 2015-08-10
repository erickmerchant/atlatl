# Atlatl

Atlatl is a templating language for CommonJS. So node or browserify as examples. It is inspired by Twig, Swig, and Blade. It works by a series of directives. Each directive is a line that begins with any amount of whitespace followed by an at-sign then the directive and any number of arguments. The types of arguments allowed varies per directive. There is also the ending directive which is a line with any amount of whitespace followed by an at-sign and then any amount whitespace. The ending directive is used to close directives that need closing.

Outside of directive lines code is transformed into ES6 templates. HTML is escaped by default but the `safe` function can be used to mark code to not escape.

## The Directives So Far

### @embed _embed_

Used to embed another template.

### @extends _extended_

Used to extend another template. The sections in the extending template override sections in the extended template. Any code outside of sections is ignored.

### @section _name_

Defines a section that can be overridden when the template is extended. Or it defines code to override that section when extending.

It must be closed.

### @yield _name_

Calls a section. If it is not defined an error will occur. Great for templates that are meant to be extended.

### @parent

Calls the extended's section code inside a section in a extending template.

### @partial _name arg1 [ arg2[ ...[ argN]]]_

Defined a function that can be used in code outside directives.

One thing to note is that an extending template does not inherit partials from it's extended templates. `@import` can help with that though.

It must be closed

### @import _name_ _template_

Can import partials from another file.

### @set _var_ _value_

Sets a variable with a particular value that can be used outside the directives.

### @each _var_ _val_ [_key_]

Loops through an array. It can be closed or followed by `@elseif` or `@else`

### @if _condition_

If the condition is met then the containing code is run. It can be closed or followed by `@elseif` or `@else`

### @elseif _condition_

Can follow `@each` or `@if`. If following `@each` if the that array is empty or is not an array it checks the condition and if it's met it runs the containing code. If following `@if` it acts just like an `else if` in any other programming context.

### @else

Can follow `@each` or `@if` or `@elseif`. If following `@each` if the that array is empty or is not an array it runs the containing code. If following `@if` or `@elseif` it acts just like an `else` in any other programming context.

## Caution

A work in progress. Not fit for production. Examples and tests to come.
