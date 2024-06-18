interface Params {
  path?: any;
  [key: string]: any;
}

interface Frame {
  _parent?: any;
  [key: string]: any;
}

function blockParams(params: Params, ids: any[]): Params {
  params.path = ids;
  return params;
}

function extend(obj: any, ...source: any[]): any {
  for (let i = 0; i < source.length; i++) {
    for (const key in source[i]) {
      if (Object.prototype.hasOwnProperty.call(source[i], key)) {
        obj[key] = source[i][key];
      }
    }
  }

  return obj;
}

function appendContextPath(contextPath: string, id: string): string {
  return (contextPath ? `${contextPath}.` : '') + id;
}

function createFrame(object: any): Frame {
  const frame: Frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function isEmpty(value: any): boolean {
  if (!value && value !== 0) {
    return true;
  } if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
}

function isPromise(value: any): boolean {
  return (
    typeof value === 'object'
        && value !== null
        && typeof value.then === 'function'
  );
}

export {
  blockParams,
  extend,
  appendContextPath,
  createFrame,
  isEmpty,
  isPromise
};