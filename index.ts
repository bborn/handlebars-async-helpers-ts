import { registerCoreHelpers } from "./helpers";

const isPromise = (obj: any): boolean =>
  !!obj &&
  (typeof obj === "object" || typeof obj === "function") &&
  typeof obj.then === "function";

export function asyncHelpers(hbs: any) {
  const handlebars = hbs.create(),
    asyncCompiler = class extends hbs.JavaScriptCompiler {
      compiler: any;

      constructor() {
        super();
        this.compiler = asyncCompiler;
      }

      mergeSource(varDeclarations: any) {
        const sources = super.mergeSource(varDeclarations);
        sources.prepend("return (async () => {");
        sources.add(" })()");
        return sources;
      }

      appendToBuffer(source: any, location: any, explicit: any) {
        if (!Array.isArray(source)) {
          source = [source];
        }
        source = this.source.wrap(source, location);

        if (this.environment.isSimple) {
          return ["return await ", source, ";"];
        }
        if (explicit) {
          return ["buffer += await ", source, ";"];
        }
        source.appendToBuffer = true;
        source.prepend("await ");
        return source;
      }
    };

  handlebars.JavaScriptCompiler = asyncCompiler;

  const _compile = handlebars.compile,
    _template = (handlebars.VM as any).template,
    _escapeExpression = handlebars.escapeExpression,
    escapeExpression = function (value: any) {
      if (isPromise(value)) {
        return value.then((v: any) => _escapeExpression(v));
      }
      return _escapeExpression(value);
    };

  function lookupProperty(containerLookupProperty: any) {
    return function (parent: any, propertyName: any) {
      if (isPromise(parent)) {
        return parent.then((p: any) =>
          containerLookupProperty(p, propertyName)
        );
      }
      return containerLookupProperty(parent, propertyName);
    };
  }

  handlebars.template = function (spec: any) {
    spec.main_d =
      (
        _prog: any,
        _props: any,
        container: any,
        _depth: any,
        data: any,
        blockParams: any,
        depths: any
      ) =>
      async (context: any) => {
        container.escapeExpression = escapeExpression;
        container.lookupProperty = lookupProperty(container.lookupProperty);
        if (depths.length == 0 && data) {
          depths = [data.root];
        }
        const v = spec.main(
          container,
          context,
          container.helpers,
          container.partials,
          data,
          blockParams,
          depths
        );
        return v;
      };
    return _template(spec, handlebars);
  };

  handlebars.compile = function (template: any, options: any) {
    const compiled = _compile.apply(handlebars, [template, { ...options }]);

    return function (context?: any, execOptions?: any) {
      context = context || {};

      return compiled.call(handlebars, context, execOptions);
    };
  };

  registerCoreHelpers(handlebars);

  return handlebars;
}

export default asyncHelpers;
