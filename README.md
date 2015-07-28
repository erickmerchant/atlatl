# atlatl

A templating engine inspired by Blade, Twig, and Swig.

```
<!-- child template -->
@extends index

@section sidebar
  <ul>
    @each content.links link index
      <li>${ link }</li>
    @
  </ul>
@

@section main
  @if content.intro
    <p class="lead">${ content.intro }</p>
  @
  @parent
@
```

A work in progress. Not fit for production.
