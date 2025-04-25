---
'@builder.io/morpho': patch
---

Angular: support to change the change detection strategy to `OnPush` using `useMetadata`

```ts
useMetadata({
  angular: {
    changeDetection: 'OnPush',
  },
});
```
