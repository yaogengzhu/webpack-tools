let babel = require('@babel/core');
let loaderUtils = require('loader-utils');
function loader(source) {
    console.log('loaderUtils', loaderUtils);
    // let options = loaderUtils.getOptions(this)
    // let cb = this.async(); // flag
    // babel.transform(source, {
    //     ...options,
    //     sourceMap: true,
    // }, function (err, result) {
    //     cb(err, result.code, result.map)
    // })

    return source
}

module.exports =loader;