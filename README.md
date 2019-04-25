# npm-change-resolve

Takes a change object emitted by [follow](https://ghub.io/follow) for the npm registry and returns a manifest in the form of:

```json
{
  "json": { ... },
  "versions": [ ... ],
  "tarballs": [ ... ]
}
```

For example `registry.get('getos', console.log)`

This module was ripped out of [follow-registry](https://ghub.io/follow-registry) and made to be generic
