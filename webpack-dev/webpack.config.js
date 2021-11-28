let path = require('path')

class P {
    apply(compiler) {
        console.log('start')
        compiler.hooks.emit.tap('emit', function(e) {
            console.log('emit事件')
        })
    }
}
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'boundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                loader: [path.resolve(__dirname, 'loader', 'style-loader'), path.resolve(__dirname, 'loader', 'less-loader')],
            }
        ]
    },
    plugins: [
        new P()
    ]
}