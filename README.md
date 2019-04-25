# npm-change-resolve

Takes a change object emitted by [follow](https://ghub.io/follow) for the npm registry and returns a manifest in the form of:

```json
{
  "json": { ... },
  "versions": [ ... ],
  "tarballs": [ ... ]
}
```

For example `registry.get('getos')`

This module was ripped out of [registry-follow](https://ghub.io/registry-follow) and made to be generic
