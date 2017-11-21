import BaseLexiconAdapter from './base_adapter.js'
import papaparse from 'papaparse'
import { Definition, ResourceProvider } from 'alpheios-data-models'
import DefaultConfig from './config.json'

class AlpheiosLexAdapter extends BaseLexiconAdapter {
  /**
   * A Client Adapter for the Alpheios Lexicon service
   * @constructor
   * @param {string} lexid - the idenitifer code for the lexicon this instance
   *                         provides access to
   * @param {Object} config - JSON configuration object override
   */
  constructor (lexid = null, config = null) {
    super()
    this.lexid = lexid
    this.data = null
    this.index = null
    // this is a bit of a hack to enable inclusion of a JSON config file
    // in a way that works both pre and post-rollup. Our rollup config
    // will stringify the file and then we can parse it but if we want to
    // run unit tests on pre-rolled up code, then we need to have a fallback
    // which works with the raw ES6 import
    if (config == null) {
      try {
        let fullconfig = JSON.parse(DefaultConfig)
        this.config = fullconfig[lexid]
      } catch (e) {
        this.config = DefaultConfig[lexid]
      }
    } else {
      this.config = config
    }
    this.provider = new ResourceProvider(this.config.uri, this.config.rights)
  }

  /**
   * @override BaseLexiconAdapter#lookupFullDef
   */
  async lookupFullDef (lemma = null) {
    // TODO figure out the best way to handle initial reading of the data file
    if (this.index === null && this.getConfig('urls').index) {
      let url = this.getConfig('urls').index
      let unparsed = await this._loadData(url)
      let parsed = papaparse.parse(unparsed, {})
      this.index = new Map(parsed.data)
    }
    let id
    if (this.index) {
      id = this._lookupInDataIndex(this.index, lemma)
    }
    let url = this.getConfig('urls').long
    if (id) {
      url = `${url}&n=${id}`
    } else {
      url = `${url}&l=${lemma.word}`
    }
    let targetLanguage = this.getConfig('langs').target
    let p = new Promise((resolve, reject) => {
      window.fetch(url).then(
          function (response) {
            let text = response.text()
            resolve(text)
          }
        ).catch((error) => {
          reject(error)
        })
    })
    return p.then((result) => {
      let def = new Definition(result, targetLanguage, 'text/html')
      return ResourceProvider.getProxy(this.provider, def)
    })
  }

  /**
   * @override BaseLexiconAdapter#lookupShortDef
   */
  async lookupShortDef (lemma = null) {
    if (this.data === null) {
      let url = this.getConfig('urls').short
      let unparsed = await this._loadData(url)
      let parsed = papaparse.parse(unparsed, {})
      this.data = new Map(parsed.data)
    }
    let deftext = this._lookupInDataIndex(this.data, lemma)
    return new Promise((resolve, reject) => {
      let def = new Definition(deftext, this.getConfig('langs').target, 'text/plain')
      resolve(ResourceProvider.getProxy(this.provider, def))
    })
  }

  /**
   * Lookup a Lemma object in an Alpheios v1 data index
   * @param {Map} data the data inddex
   * @param {Lemma} lemma the lemma to lookupInDataIndex
   * @return {string} the index entry as a text string
   */
  _lookupInDataIndex (data, lemma) {
    // legacy behavior from Alpheios lemma data file indices
    // first look to see if we explicitly have an instance of this lemma
    // with capitalization retained
    let found

    let alternatives = []
    for (let l of [...lemma.principalParts, lemma.word]) {
      alternatives.push(l)
      let nosense = l.replace(/_?\d+$/, '')
      if (l !== nosense) {
        alternatives.push(nosense)
      }
    }
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
