# Atlatl

Atlatl is a templating language for CommonJS. So Node or Browserify as examples. It is inspired by Twig, Swig, and Nunjucks (so Jinja2), and Laravel's Blade.

It could be thought of as a superset of ES6 template strings that adds object oriented features, logic, and default escaping of html.

It looks like this.

```html
@--
  layout.html
@

@partial title (title)
  <title>${ title }</title>
@

<!doctype html>
<html>
  <head>
    @yield head
  </head>
  <body>
    @section main
      ${ safe(content.content) }
    @
  </body>
</html>
```

```html
@--
  posts.html
@

@extends layout.html

@section head
  @call title ('Posts')
@

@section main
  <ul>
    @each content.posts (post)
      <li><a href="${ post.permalink }">${ safe(post.title) } &mdash; ${ post.date }</a></li>
    @
  </ul>
@
```

Lines that begin with an @ are called directives. Some directives are one line. Others are blocks and must be closed with a line with just an @.

HTML output by ES6 templates' `${ ... }` is escaped by default but the `safe` function can be used to mark code to not escape.

## The Directives

### Logic and Loops

#### @each _var (val, [key])_

Loops through an array. Block level.

#### @if _(condition)_

Just like any other if statement. Block level.

#### @else

Used with `@each` or `@if`. With `@each`, if `var` is empty or is not an array then the code after `@else` is run. With `@if` it acts just like an `else` in any other programming context.

### Methods

#### @partial _name ([arg1, [ ...argN]])_

Defines a method that can be called with `@call`. Block level.

#### @call _name ([arg1, [ ...argN]])_

Calls a method. If it is not defined an error will occur.

#### @section _name_

Defines and calls a method that can be overridden when the template is extended. Block level.

#### @yield _name_

Defines and calls a method. A placeholder. Great for templates that are meant to be extended.

### Inheritance

#### @extends _template_

Used to extend another template. The methods (sections and partials) in the extending template override methods in the extended template and any output outside of methods is ignored.

#### @import _name template [method]_

Can import partials or sections (any method) from another file. Use `method` to rename the method being imported. If `method` is not set then the name as defined is used.

#### @parent _[name] ([arg1, [ ...argN]])_

In a template that extends another template it calls an overridden method. If `name` is not defined it calls the same method in which it appears.

### Comments

#### @--

Block level.

## The Result

Each template is transformed into a CommonJS module that exports a class. `@section` and `@partial` add methods to that class.

## Caution

A work in progress. Not fit for production. Examples and tests to come.
