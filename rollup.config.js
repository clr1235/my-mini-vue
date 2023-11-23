import typescript from '@rollup/plugin-typescript';
import pkg from './package.json'

export default {
    input: './src/index.ts',
    output: [
        {
            format: 'cjs',
            // 如果是cjs模块的话，package.json文件中的入口会读取 main 选项的值
            file: pkg.main
        },
        {
            format: 'es',
            // 如果是esm模块的话，package.json文件中的入口会读取 module 选项的值，所以此处可以读取package.json文件中的配置来作为rollup打包文件的输出口
            file: pkg.module
        }
    ],
    plugins: [
        typescript()
    ]
}