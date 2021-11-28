function loader(source) {
    let style = document.createElement('style'); // 创建style
    style.innerHTML = `${JSON.stringify(source)}`
    document.head.appendChild(style)
    return style
}

module.exports = loader