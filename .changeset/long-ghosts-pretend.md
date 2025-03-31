---
'@builder.io/morpho': patch
---

[React] Refactor how `react` handles morpho ``Fragment``.

Using ``import { Fragment } from '@builder.io/morpho';
`` and `<Fragment key={option}>` in morpho, generates an empty fragment in ``react`` target: `<>`. With this improvement the generated output will be `<React.Fragment key={`key-${option}`}>`. This will help to avoid issues with same keys e.g. inside for loops.


