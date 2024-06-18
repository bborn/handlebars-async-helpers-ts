import { isPromise, isEmpty, createFrame, appendContextPath, blockParams } from "../utils";

export default (handlebars: any) => {
    handlebars.registerHelper('with', async function(this: any, context: any, options: any) {
        if (arguments.length !== 2) {
            throw new Error('#with requires exactly one argument')
        }
        if (typeof context === 'function') {
            context = context.call(this)
        } else if (isPromise(context)) {
            context = await context
        }

        const { fn } = options

        if (!isEmpty(context)) {
            let { data } = options
            if (options.data && options.ids) {
                data = createFrame(options.data)
                data.contextPath = appendContextPath(
                    options.data.contextPath,
                    options.ids[0]
                )
            }

            return fn(context, {
                data,
                blockParams: blockParams([context], [data && data.contextPath])
            })
        }
        return options.inverse(this)

    })
}