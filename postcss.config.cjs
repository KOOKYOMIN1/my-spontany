// postcss.config.cjs
const tailwindcss = require('@tailwindcss/postcss')  // 핵심 포인트

module.exports = {
  plugins: [
    tailwindcss(),  // 직접 실행 함수로 호출해야 함
    require('autoprefixer'),
  ],
}