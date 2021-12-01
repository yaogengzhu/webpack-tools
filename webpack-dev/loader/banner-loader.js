let fs = require('fs')
function loader(source) {
    let cb = this.async()
    // this.cacheable(false)
    this.cacheable && this.cacheable() // 缓存相关
    let options = this.getOptions();
    if (options.filename) {
        this.addDependency(options.filename) // wacth 重新自动添加文件依赖
        fs.readFile(options.filename, 'utf8', function(err, data) {
            cb(err, `/**${data}**/${source}`)
        })
    } else {
        cb(null, `/**${options.text}**/${source}`)
    }
}

module.exports = loader;
