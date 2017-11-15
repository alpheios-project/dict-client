import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import string from 'rollup-plugin-string'

export default {
  entry: 'src/alpheios-lex-adapter.js',
  plugins: [
    string({
      include: ['src/*.json']
    }),
    commonjs({
      ignoreGlobal: true,  // Default: false
      sourceMap: true  // Default: true
    }),
    resolve({
      module: true, // Default: true
      jsnext: true,  // Default: false
      main: true,  // Default: true
      browser: true,  // Default: false
      namedExports: {
      }
    })
  ],
  moduleName: 'BaseDictAdapter',
  targets: [
    {
      dest: 'dist/alpheios-dict-client.js',
      format: 'es',
      sourceMap: true
    }
  ]
}
