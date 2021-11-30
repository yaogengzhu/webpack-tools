let babel = require('@babel/core');
// let loaderUtils = require('loader-utils');
function loader(source) {
    let options = this.getOptions()
    console.log(options, '????')
    let cb = this.async(); // flag
    babel.transform(source, {
        ...options,
        sourceMap: true,
    }, function (err, result) {
        cb(err, result.code, result.map)
    })

    return source
}

module.exports =loader;