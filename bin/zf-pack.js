#! /usr/bin/env node

let path = require('path');

// 拿到执行命令的路径
let config = require(path.resolve('webpack.config.js'))
// 拿到配置文件
// console.log(config)
let Complier = require('../lib/Compiler.js')
let compiler = new Complier(config)

compiler.ahooks.entryOptions.call()
// 编译时运行
compiler.run()