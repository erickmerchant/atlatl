# atlatl

A templating engine inspired by Blade, Twig, and Swig.

```
<!-- child template -->
@extend index

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

Not fit for production.
