import { Feature, Definition, ResourceProvider } from 'alpheios-data-models'
/**
 * Adapter Class for a Lexicon Service which retrieves a full definition from
 * the url specified in the src feature of the Lemma
 */
class UrlLexAdapter {
  /**
   * Lookup a full definition in a lexicon
   * @param {Lemma} lemma Lemma to lookup
   * @return {Promise} a Promise that resolves to an array of Definition objects
   */
  async lookupFullDef (lemma) {
    let url = lemma.features[Feature.types.source]
    return new Promise((resolve, reject) => {
      window.fetch(url).then(
        function (response) {
          let text = response.text()
          resolve(text)
        }
      ).catch((error) => {
        reject(error)
      })
    }).then((result) => {
      if (result.match(/No entries found/)) {
        throw new Error('Not Found')
      } else {
        let def = new Definition(result, lemma.languageID, 'text/html', lemma.word)
        return ResourceProvider.getProxy(this.provider, def)
      }
    })
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
