let path = require('path')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'boundle.js',
        clean: true
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loader')],
    },
    module: {
        // loader分类， pre 在前面， post 在后面， normal： 中间
        rules: [
            {
                test: /\.js$/,
                loader: 'loader1', // 从右向左, 从下到上
                enforce: 'pre', // 可以改变顺序
            },
            {
                test: /\.js$/,
                loader: 'loader2', // 从右向左, 从下到上
            },
        ]
    },
}