import each from './each';
import iff from './if';
import withh from './with';

export const registerCoreHelpers = (handlebars: any) => {
    each(handlebars);
    iff(handlebars);
    withh(handlebars);
}