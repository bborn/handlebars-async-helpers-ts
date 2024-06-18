# Handlebars Async Helpers

Library that adds support to asynchronous function helpers to handlebars lib.

### How to install

```shell
npm install handlebars-async-helpers
```

### How to use

```javascript
import * as handlebars from "handlebars";
import * as asyncHelpers from "handlebars-async-helpers";

const hb = asyncHelpers(handlebars);

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
