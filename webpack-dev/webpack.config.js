let path = require('path')
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
    }
}