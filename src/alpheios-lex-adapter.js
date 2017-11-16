import BaseDictAdapter from './base_adapter.js'
import papaparse from 'papaparse'
import * as Defaults from './config.js'

class AlpheiosLexAdapter extends BaseDictAdapter {
  constructor (lexid = null, config = Defaults.Config[lexid]) {
    super()
    this.lexid = lexid
    this.data = null
    this.index = null
    this.config = config
  }

  async lookupFullDef (lemma = null) {
    if (this.index === null && this.getConfig('index')) {
      let url = this.getConfig('index')
      let unparsed = await this._loadData(url)
      let parsed = papaparse.parse(unparsed, {})
      this.index = new Map(parsed.data)
    }
    let id
    if (this.index) {
      id = this.lookupInDataIndex(this.index, lemma)
    }
    let url
    if (id) {
      url = this.getConfig('long_id').replace('r_ID', id)
    } else {
      url = this.getConfig('long_lemma').replace('r_LEMMA', lemma)
    }
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

  async lookupShortDef (lemma = null) {
    if (this.data === null) {
      let url = this.getConfig('short')
      let unparsed = await this._loadData(url)
      let parsed = papaparse.parse(unparsed, {})
      this.data = new Map(parsed.data)
    }
    return this.lookupInDataIndex(this.data, lemma)
  }

  lookupInDataIndex (data, lemma) {
    // legacy behavior from Alpheios lemma data file indices
    // first look to see if we explicitly have an instance of this lemma
    // with capitalization retained
    let found

    let alternatives = [ lemma, lemma.replace(/_?\d+$/, '') ]
    // TODO may be other language specific normalizations here

    for (let lookup of alternatives) {
      found = data.get(lookup.toLocaleLowerCase())
      if (found === '@') {
        found = data.get(`@${lookup}`)
      }
      if (found) {
        break
      }
    }
    return found
  }

  _loadData (url) {
    // TODO figure out best way to load this data
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
    return this.config[property]
  }
}

export default AlpheiosLexAdapter
