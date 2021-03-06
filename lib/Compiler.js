let fs = require('fs');
let path = require('path');
let { SyncHook } = require('tapable')

// babylon 主要是把源码转成 ast
// @babel/traverse // 遍历节点
// @babel/types   // 转换替换
// @babel/generator // 生成

let babylon = require('babylon')
let t = require('@babel/types')
let generator = require('@babel/generator').default // es6模块
let traverse = require('@babel/traverse').default
let ejs = require('ejs')

class Compiler {
    constructor(config) {
        this.config = config;
        // 需要保存入口文件路径
        this.entryId;
        // 需要保存所有模块依赖
        this.modules = {};
        this.entry = config.entry; // 入口路径
        this.root = process.cwd(); // 工作路径
        this.hooks = {
            entryOption: new SyncHook(),
            compile: new SyncHook(),
            afterCompile: new SyncHook(),
            run: new SyncHook(),
            emit: new SyncHook(),
            done: new SyncHook()
        }

        // 如果传递plugins
        let plugins = this.config.plugins
        if (Array.isArray(plugins)) {
            plugins.forEach( plugin => {
                plugin.apply(this)
            })
        }
        this.hooks.afterCompile.call()
    }

    // 获取源码
    getSource(modulePath) {
        let relus = this.config.module.relus;
        let content = fs.readFileSync(modulePath, 'utf8'); // 读取模块内容
        for (let i = 0; i < relus.length; i++) {
            let rule = relus[i]
            const { test, use } = relus
            let len = use.length - 1;
            if (test.test(modulePath)) { // 需要这个loader 来转换
                function normalLoader() {
                    let loader = require(use[len]); // 获取对应的loader
                    content = loader(content)
                    if (len >= 0) {
                        normalLoader()
                    }
                }
                normalLoader()
            }
        }

        return content;
    }

    // 解析源码
    parse(source, parentPath) { // 解析源码
        console.log(source)
        let ast = babylon.parse(source); // 解析语法树
        let dependencies = []; // 依赖数组
        traverse(ast, {
            CallExpression(p) {
                let node = p.node // 对应的节点
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__';
                    let moduleName = node.arguments[0].value; // 取到模块的引用名字
                    moduleName = moduleName + (path.extname(moduleName) ? '' : '.js');
                    moduleName = './' + path.join(parentPath, moduleName);
                    dependencies.push(moduleName);
                    node.arguments = [t.stringLiteral(moduleName)]
                }
            }
        })
        let sourceCode = generator(ast).code;
        return {
            sourceCode,
            dependencies
        }
    }
    // 构建模块
    buildModule(modulePath, isEntry) {
        // 拿到模块的内容
        let source = this.getSource(modulePath);
        // 模块id
        let moduleName = './' + path.relative(this.root, modulePath); // 相对路径
        // console.log(source, moduleName)

        if (isEntry) {
            this.entryId = moduleName; // 保存入口的名字
        }
        // 解析需要把source进行改造 返回一个依赖列表
        let { sourceCode, dependencies } = this.parse(
            source,
            path.dirname(moduleName)
        ); // ./src
        // 把相对路径和模块中的内容对应起来
        this.modules[moduleName] = sourceCode;
        // 附模块的加载,递归加载
        dependencies.forEach(dep => {
            this.buildModule(path.join(this.root, dep), false)
        })
    }
    emitFile() {
        // 用数据渲染 // 
        // 输出到哪个目录下
        let main = path.join(this.config.output.path, this.config.output.filename); // 输出路径
        let templateStr = this.getSource(path.join(__dirname, 'main.ejs')) // 模板路径
        let code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules })
        this.assets = {}
        this.assets[main] = code
        fs.writeFileSync(main, this.assets[main]);
    }
    run() {
        this.hooks.run.call()
        this.hooks.compile.call()
        // 代码执行, 并且创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true);
        this.afterCompile.call()
        console.log(this.modules, this.entryId)
        // 发射一个文件，打包后的文件
        this.emitFile();
        this.hooks.emit.call()
        this.hooks.done.call()
    }
}

module.exports = Compiler;
