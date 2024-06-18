import {
  appendContextPath,
  createFrame,
  blockParams,
  isPromise,
} from "../utils";
import { Readable } from "stream";

export default function (handlebars: any) {
  handlebars.registerHelper(
    "each",
    async function (this: any, context: any, options: any) {
      if (!options) {
        throw new Error("Must pass iterator to #each");
      }

      const { fn, inverse } = options;
      let i = 0;
      let ret: any[] = [];
      let data: any;
      let contextPath: string;

      if (options.data && options.ids) {
        contextPath = `${appendContextPath(
          options.data.contextPath,
          options.ids[0]
        )}.`;
      }

      if (typeof context === "function") {
        context = context.call(this);
      }

      if (options.data) {
        data = createFrame(options.data);
      }

      async function execIteration(field: any, index: number, last?: boolean) {
        if (data) {
          data.key = field;
          data.index = index;
          data.first = index === 0;
          data.last = !!last;

          if (contextPath) {
            data.contextPath = contextPath + field;
          }
        }

        ret.push(
          await fn(context[field], {
            data,
            blockParams: blockParams(
              [context[field], field],
              [contextPath + field, null]
            ),
          })
        );
      }

      if (context && typeof context === "object") {
        if (isPromise(context)) {
          context = await context;
        }
        if (Array.isArray(context)) {
          for (let j = context.length; i < j; i++) {
            if (i in context) {
              await execIteration(i, i, i === context.length - 1);
            }
          }
        } else if (global.Symbol && context[global.Symbol.iterator]) {
          const newContext = [],
            iterator = context[global.Symbol.iterator]();
          for (let it = iterator.next(); !it.done; it = iterator.next()) {
            newContext.push(it.value);
          }
          context = newContext;
          for (let j = context.length; i < j; i++) {
            await execIteration(i, i, i === context.length - 1);
          }
        } else if (context instanceof Readable) {
          const newContext: any[] = [];
          await new Promise<void>((resolve, reject) => {
            context
              .on("data", (item: any) => {
                newContext.push(item);
              })
              .on("end", async () => {
                context = newContext;
                for (let j = context.length; i < j; i++) {
                  await execIteration(i, i, i === context.length - 1);
                }
                resolve();
              })
              .once("error", (e: Error) => reject(e));
          });
        } else {
          let priorKey;

          for (const key of Object.keys(context)) {
            if (priorKey !== undefined) {
              await execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
          if (priorKey !== undefined) {
            await execIteration(priorKey, i - 1, true);
          }
        }
      }

      if (i === 0) {
        ret = inverse(this);
        ret = [inverse(this)];
      }

      return ret.join("");
    }
  );
}
