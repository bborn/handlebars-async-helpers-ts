import { isPromise, isEmpty } from '../utils';

type Options = {
  fn: Function,
  inverse: Function,
  hash: {
    includeZero?: boolean
  }
};

export default (handlebars: any) => {
  handlebars.registerHelper('if', async function(conditional: any, options: Options) {
    if (arguments.length !== 2) {
      throw new Error('#if requires exactly one argument');
    }
    if (typeof conditional === 'function') {
      conditional = conditional.call(this);
    } else if (isPromise(conditional)) {
      conditional = await conditional;
    }
    if ((!options.hash.includeZero && !conditional) || isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  handlebars.registerHelper('unless', function(conditional: any, options: Options) {
    if (arguments.length !== 2) {
      throw new Error('#unless requires exactly one argument');
    }
    return handlebars.helpers['if'].call(this, conditional, {
      fn: options.inverse,
      inverse: options.fn,
      hash: options.hash
    });
  });
}