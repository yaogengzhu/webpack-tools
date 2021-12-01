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
    watch: true,
    devtool: 'source-map',
    module: {
        // loader分类， pre 在前面， post 在后面， normal： 中间
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'banner-loader',
                    options: {
                        text: 'yaogengzhu',
                        filename: path.resolve(__dirname, 'banner.js')
                    }
                }
            }
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     }
            // }
          
        ]
    },
}