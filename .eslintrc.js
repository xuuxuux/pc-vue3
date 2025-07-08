// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true, // 标识为根配置，ESLint 不再向上级目录查找配置
  parserOptions: {
    parser: 'babel-eslint' // 使用 Babel 解析器，支持新的 ES 特性
  },
  env: {
    node: true,    // Enable Node.js global variables and Node.js scoping
    browser: true, // 启用浏览器全局变量（如 window、document）
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'plugin:vue/essential', // Vue 3 基础语法规则
    'standard'             // 继承 StandardJS 代码风格规范
  ],
  plugins: [
    'vue' // 支持 .vue 单文件组件语法校验
  ],
  rules: {
    "indent": ["off", 2],    // 禁用缩进检查（原设置为 2 空格缩进）
    'generator-star-spacing': 'off', // 关闭生成器函数星号间距检查
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off' // 生产环境禁用 debugger
  }
}
