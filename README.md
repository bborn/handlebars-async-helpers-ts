# Handlebars Async Helpers

Library that adds support to asynchronous function helpers to handlebars lib.

### How to install

```shell
npm install handlebars-async-helpers-ts
```

### How to use

```javascript
import Handlebars from "handlebars";
import asyncHelpers from "handlebars-async-helpers-ts";

const hb = asyncHelpers(Handlebars);

hb.registerHelper(
  "sleep",
  async (): Promise<string> =>
    new Promise((resolve) => {
      setTimeout(() => resolve("Done!"), 1000);
    })
);

const compileTemplate = async (): Promise<void> => {
  const template = hb.compile("Mark when is completed: {{#sleep}}{{/sleep}}");
  const result = await template();
  console.log(result);
  // 'Mark when is completed: Done!'
};

compileTemplate().catch(console.error);
```
