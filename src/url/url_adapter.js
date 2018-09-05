import { Feature, Definition, ResourceProvider } from 'alpheios-data-models'
import axios from 'axios'
/**
 * Adapter Class for a Lexicon Service which retrieves a full definition from
 * the url specified in the src feature of the Lemma
 */
class UrlLexAdapter {
  constructor () {
    this.config = {}
    this.config.description = 'URL Lexicon Adapter'
  }
  /**
   * Lookup a full definition in a lexicon
   * @param {Lemma} lemma Lemma to lookup
   * @return {Promise} a Promise that resolves to an array of Definition objects
   */
  async lookupFullDef (lemma) {
    let promises = []
    if (lemma.features[Feature.types.source] && lemma.features[Feature.types.source].value.match(/https?:/)) {
      let url = lemma.features[Feature.types.source].value
      promises.push(new Promise((resolve, reject) => {
        if (typeof window !== 'undefined') {
          window.fetch(url).then(
            function (response) {
              let text = response.text()
              resolve(text)
            }
          ).catch((error) => {
            reject(error)
          })
        } else {
          axios.get(url).then(
            function (response) {
              let text = response.text()
              resolve(text)
            }
          ).catch((error) => {
            reject(error)
          })
        }
      }).then((result) => {
        if (result.match(/No entries found/)) {
          throw new Error('Not Found')
        } else {
          let def = new Definition(result, lemma.languageID, 'text/html', lemma.word)
          return ResourceProvider.getProxy(this.provider, def)
        }
      }))
    } else {
      promises.push(new Promise((resolve, reject) => {
        reject(new Error('Invalid Source URL'))
      }))
    }
    return Promise.all(promises).then(
      values => {
        return values.filter(value => { return value })
      },
      error => {
        throw (error)
      }
    )
  }

  /**
   * Get the available lexicons provided by this adapter class for the
   * requested language
   * @param {string} language languageCode
   * @return {Array} a Map of lexicon objects. Keys are lexicon uris, values are the lexicon description.
   */
  static getLexicons (language) {
    return []
  }
}

export default UrlLexAdapter
