const webpack = {
  common: {
    entry: './driver.js',
    externals: {
      'alpheios-data-models': 'alpheios-data-models'
    }
  },

  production: {
    output: {filename: 'alpheios-lexicon-client.min.js'}
  },
  development: {
    output: {filename: 'alpheios-lexicon-client.js'}
  }
}

export { webpack }
