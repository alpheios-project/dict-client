import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import string from 'rollup-plugin-string'

export default {
  entry: 'src/driver.js',
  plugins: [
    string({
      include: ['src/**/*.json']
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
  moduleName: 'ApheiosLexiconClient',
  targets: [
    {
      dest: 'dist/alpheios-lexicon-client.js',
      format: 'es',
      sourceMap: true
    }
  ]
}
