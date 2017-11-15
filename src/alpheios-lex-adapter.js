import BaseDictAdapter from './base_adapter.js'
import papaparse from 'papaparse'
import * as Config from './config.js'

class AlpheiosLexAdapter extends BaseDictAdapter {
  constructor (lexid = null) {
    super()
    this.lexid = lexid
    this.data = null
  }

  async lookupShortDef (lemma = null) {
    if (this.data === null) {
      let unparsed = await this._loadShortDefsData()
      let parsed = papaparse.parse(unparsed, {})
      this.data = new Map(parsed.data)
    }
    return this.data.get(lemma)
    // TODO we need to add in special handling, per lexicon and language
    // see https://github.com/alpheios-project/ff-extension-greek/blob/master/content/alpheios-greek-langtool.js#L860-L889
  }

  _loadShortDefsData () {
    // TODO figure out best way to load this data
    let url = this.getConfig('short')
    return new Promise((resolve, reject) => {
      window.fetch(url).then(
          function (response) {
            let text = response.text()
            resolve(text)
          }
        ).catch((error) => {
          reject(error)
        })
    })
  }

  getConfig (property) {
    return Config.Config[this.lexid][property]
  }
}

export default AlpheiosLexAdapter
