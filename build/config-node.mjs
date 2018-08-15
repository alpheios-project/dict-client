import path from 'path'
const projectRoot = process.cwd()

const webpack = {
  common: {
    entry: './driver.js',
    externals: {
      'alpheios-data-models': 'alpheios-data-models'
    },
    target: "node"
  },

  production: {
    output: {filename: 'alpheios-lexicon-client.node.min.js'},
    resolve: {
      alias: {
        'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.node.min.js')
      }
    }
  },
  development: {
    output: {filename: 'alpheios-lexicon-client.node.js'},
    resolve: {
      alias: {
        'alpheios-data-models': path.join(projectRoot, 'node_modules/alpheios-data-models/dist/alpheios-data-models.node.js')
      }
    }
  }
}

export { webpack }
